/* globals module, require, NewTabUtils */
"use strict";
const {Cu} = require("chrome");
const {PlacesProvider} = require("addon/PlacesProvider");
const Feed = require("addon/lib/Feed");
const am = require("common/action-manager");
const MAX_NUM_LINKS = 5;

Cu.import("resource://gre/modules/NewTabUtils.jsm");

module.exports = class MetadataFeed extends Feed {
  constructor(options) {
    super(options);
    this.linksToFetch = new Map();
    this.pinnedLinks = options.pinnedLinks || NewTabUtils.pinnedLinks;
  }

  /**
   * When the app initializes, we want to have metadata for all existing entries,
   * therefore add them to the list of links to fetch metadata for, then refresh
   * the state
   */
  getInitialMetadata(reason) {
    // First, get the metadata for pinned sites
    let pinned = this.pinnedLinks.links;
    pinned.forEach(item => {
      // Skip any empty slots
      if (item && item.url) {
        this.linksToFetch.set(item.url, Date.now());
      }
    });
    this.refresh(reason);

    // Then, get initial topsites metadata
    return PlacesProvider.links.getTopFrecentSites().then(links => {
      links.forEach(item => this.linksToFetch.set(item.url, Date.now()));
      this.refresh(reason);
    })
    // Finally, get initial highlights metadata. This should be done last because
    // it takes the longest, processing 100+ urls.
    .then(() => PlacesProvider.links.getRecentlyVisited())
    .then(links => {
      // We need to cap this otherwise on some average profile we'll attempt to
      // fetch hundreds of links and hog the mainthread for a long time
      links.slice(0, 50).forEach(item => this.linksToFetch.set(item.url, Date.now()));
      this.refresh(reason);
    });
  }

  /**
   * Once the max number of links is collected, start an async job to fetch
   * metadata for those links, and clear the list of links which are missing metadata
   */
  getData() {
    const experiments = this.store.getState().Experiments.values;

    let links = Array.from(this.linksToFetch.keys(), item => Object.assign({"url": item}));
    this.linksToFetch.clear();

    // Make no requests for metadata
    if (experiments.metadataNoService) {
      return this.options.fetchNewMetadataLocally(links, "METADATA_FEED_REQUEST").then(() => (am.actions.Response("METADATA_UPDATED")));
    }

    return this.options.fetchNewMetadata(links, "METADATA_FEED_REQUEST").then(() => (am.actions.Response("METADATA_UPDATED")));
  }
  onAction(state, action) {
    switch (action.type) {
      case am.type("APP_INIT"):
        this.getInitialMetadata("app was initializing");
        break;
      case am.type("RECEIVE_PLACES_CHANGES"):
        this.linksToFetch.set(action.data.url, Date.now());
        if (this.linksToFetch.size > MAX_NUM_LINKS) {
          this.refresh("metadata was needed for these links");
        }
        break;
    }
  }
};
module.exports.MAX_NUM_LINKS = MAX_NUM_LINKS;
