/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const {utils: Cu} = Components;

const {actionCreators: ac, actionTypes: at} = Cu.import("resource://activity-stream/common/Actions.jsm", {});

const DUMMY_DATA = [
  "http://cdn.attackofthecute.com/February-13-2013-20-34-03-ii.jpg",
  "https://c1.staticflickr.com/1/202/509388231_d774116746_b.jpg",
  "https://c1.staticflickr.com/1/204/509363724_1f5d8813d0_b.jpg"
].reverse();

this.DummySectionFeed2 = class DummySectionFeed2 {
  constructor() {
    this.options = {id: "dummy_section2", title: "Dummy Section 2", rows: DUMMY_DATA};
  }
  init() {
    this.store.dispatch(ac.BroadcastToContent({type: at.SECTION_REGISTER, data: this.options}));
  }
  uninit() {
    this.store.dispatch(ac.BroadcastToContent({type: at.SECTION_DEREGISTER, data: this.options.id}));
  }
  rowsUpdate() {
    const rowsUpdateAction = {
      type: at.SECTION_ROWS_UPDATE,
      data: {id: this.options.id, rows: DUMMY_DATA}
    };
    this.store.dispatch(ac.BroadcastToContent(rowsUpdateAction));
  }
  onAction(action) {
    switch (action.type) {
      case at.INIT:
        this.init();
        break;
      case at.FEED_INIT:
        if (action.data === "feeds.section.dummy_section2") { this.init(); }
        break;
      case at.SECTION_ROWS_UPDATE_REQUEST:
        this.rowsUpdate();
        break;
    }
  }
};

this.EXPORTED_SYMBOLS = ["DummySectionFeed2"];
