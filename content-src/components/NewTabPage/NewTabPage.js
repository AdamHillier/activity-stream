const React = require("react");
const {connect} = require("react-redux");
const {selectNewTabSites} = require("selectors/selectors");
const TopSites = require("components/TopSites/TopSites");
const GroupedActivityFeed = require("components/ActivityFeed/ActivityFeed");
const Spotlight = require("components/Spotlight/Spotlight");
const Search = require("components/Search/Search");
const LoadMore = require("components/LoadMore/LoadMore");
const {actions} = require("common/action-manager");
const {Link} = require("react-router");

const MAX_TOP_ACTIVITY_ITEMS = 10;

const NewTabPage = React.createClass({
  // TODO: Replace with real search api via addon
  onSearch(value) {
    this.props.dispatch(actions.NotifyPerformSearch(value));
  },
  componentDidMount() {
    document.title = "New Tab";
  },
  componentDidUpdate() {
    if (this.props.isReady) {
      this.props.dispatch(actions.NotifyTelemetry("NEWTAB_RENDER"));
    }
  },
  render() {
    const props = this.props;
    return (<main className="new-tab">
      <div className="new-tab-wrapper">
        <section>
          <Search onSearch={this.onSearch} />
        </section>

        <div className="delayedFadeIn">
          <section>
            <TopSites sites={props.TopSites.rows} />
          </section>

          <section>
            <Spotlight sites={props.Spotlight.rows} />
          </section>

          <section>
            <GroupedActivityFeed title="Recent Activity" sites={props.TopActivity.rows} length={MAX_TOP_ACTIVITY_ITEMS} />
            <LoadMore to="/timeline" label="See more activity" hidden={props.TopActivity.rows.length < MAX_TOP_ACTIVITY_ITEMS} />
          </section>
        </div>
      </div>

      <Link className="debug-link" to="/debug">debug</Link>
    </main>);
  }
});

NewTabPage.propTypes = {
  TopSites: React.PropTypes.object.isRequired,
  Spotlight: React.PropTypes.object.isRequired,
  TopActivity: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired
};

module.exports = connect(selectNewTabSites)(NewTabPage);
module.exports.NewTabPage = NewTabPage;
