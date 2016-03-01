const React = require("react");
const {connect} = require("react-redux");

const {GroupedActivityFeed} = require("components/ActivityFeed/ActivityFeed");
const Spotlight = require("components/Spotlight/Spotlight");

const TimelinePage = React.createClass({
  render() {
    const props = this.props;
    const navItems = [
      {title: "All", active: true, icon: "fa-firefox"},
      {title: "Bookmarks", icon: "fa-star"}
    ];
    return (<main className="timeline">
      <nav className="sidebar">
        <ul>
          {navItems.map(item => {
            return (<li key={item.title}>
              <a className={item.active ? "active" : ""}>
                <span className={`fa ${item.icon}`} /> {item.title}
              </a>
            </li>);
          })}
        </ul>
      </nav>
      <section className="content">
        <div className="wrapper">
          <Spotlight sites={props.History.rows} />
          <GroupedActivityFeed title="Just now" sites={props.History.rows} length={20} />
        </div>
      </section>
    </main>);
  }
});

function select(state) {
  return state;
}

module.exports = connect(select)(TimelinePage);
module.exports.TimelinePage = TimelinePage;
