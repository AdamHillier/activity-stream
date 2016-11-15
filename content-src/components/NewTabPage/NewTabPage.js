const React = require("react");
const {connect} = require("react-redux");
const {selectNewTabSites} = require("common/selectors/selectors");
const TopSites = require("components/TopSites/TopSites");
const Spotlight = require("components/Spotlight/Spotlight");
const Search = require("components/Search/Search");
const Loader = require("components/Loader/Loader");
const ContextMenu = require("components/ContextMenu/ContextMenu");
const {actions} = require("common/action-manager");
const setFavicon = require("lib/set-favicon");
const classNames = require("classnames");
const PAGE_NAME = "NEW_TAB";
const {HIGHLIGHTS_LENGTH} = require("common/constants");

const NewTabPage = React.createClass({
  getInitialState() {
    return {
      showSettingsMenu: false,
      showRecommendations: true
    };
  },
  toggleRecommendation() {
    this.props.dispatch(actions.NotifyEvent({
      event: "TOGGLE_RECOMMENDATION",
      page: PAGE_NAME,
      showRecommendations: !this.state.showRecommendations
    }));
    this.props.dispatch(actions.NotifyToggleRecommendations());
    this.props.dispatch(actions.RequestHighlightsLinks());
    this.setState({showRecommendations: !this.state.showRecommendations});
  },
  componentDidMount() {
    document.title = "New Tab";
    setFavicon("newtab-icon.svg");

    // Note that data may or may not be complete, depending on
    // the state of the master store, as well as if all the selectors
    // have finished (in which case the "Welcome" dialog maybe be being shown
    // without any actual images).
    this.props.dispatch(actions.NotifyPerf("NEWTAB_RENDER"));
  },
  render() {
    const props = this.props;
    const recommendationLabel = "Show Trending Highlights";
    const recommendationIcon = props.Highlights.recommendationShown ? "check" : "   ";
    const showRecommendationOption = props.showRecommendationOption;

    return (<main className="new-tab">
      <div className="new-tab-wrapper">
        <section>
          <Search />
        </section>
        <Loader
          className="loading-notice"
          show={!this.props.isReady}
          title="Welcome to new tab"
          body="Firefox will use this space to show your most relevant bookmarks, articles, videos, and pages you've recently visited, so you can get back to them easily."
          label="Identifying your Highlights" />
        <div className={classNames("show-on-init", {on: this.props.isReady})}>
          <section>
            <TopSites page={PAGE_NAME} sites={props.TopSites.rows} showHint={props.TopSites.showHint} />
          </section>

          <section>
            <Spotlight page={PAGE_NAME} length={HIGHLIGHTS_LENGTH}
              sites={props.Highlights.rows} />
          </section>

          <section className="bottom-links-container">
            <span className="link-wrapper-right">
              <a
                ref="settingsLink"
                hidden={!showRecommendationOption}
                className={classNames("bottom-link expand", {active: this.state.showSettingsMenu})}
                onClick={() => this.setState({showSettingsMenu: !this.state.showSettingsMenu})} >
                  <span className="icon icon-spacer icon-settings" /> <span className="text">Settings</span>
              </a>
              <ContextMenu
                ref="settingsMenu"
                visible={this.state.showSettingsMenu}
                onUpdate={showSettingsMenu => this.setState({showSettingsMenu})}
                options={[
                  {icon: recommendationIcon, label: recommendationLabel, onClick: this.toggleRecommendation}
                ]} />
            </span>
          </section>
        </div>
      </div>
    </main>);
  }
});

NewTabPage.propTypes = {
  TopSites: React.PropTypes.object.isRequired,
  Highlights: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired
};

module.exports = connect(selectNewTabSites)(NewTabPage);
module.exports.NewTabPage = NewTabPage;
