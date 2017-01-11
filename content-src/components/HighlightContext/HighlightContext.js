const React = require("react");
const highlightTypes = require("./types");
const Tooltip = require("components/Tooltip/Tooltip");
const getRelativeTime = require("lib/getRelativeTime");
const PureRenderMixin = require("react-addons-pure-render-mixin");

const HighlightContext = React.createClass({
  mixins: [PureRenderMixin],
  render() {
    let timestamp;
    const type = this.props.type;
    const {icon, label, showTimestamp, tooltip} = Object.assign({}, highlightTypes[type], this.props);
    if (this.props.date && showTimestamp !== false) {
      timestamp = getRelativeTime(this.props.date);
    }
    return (<div className="highlight-context tooltip-container">
      <span className="hc-icon">
        <span ref="icon" className={`icon icon-${icon}`} /><span className="sr-only">{this.props.type}</span>
      </span>
      <span ref="label" className="hc-label">{label}</span>
      <span hidden={!timestamp} ref="timestamp" className="hc-timestamp">{timestamp}</span>
      {tooltip && <Tooltip ref="tooltip" label={tooltip} />}
    </div>);
  }
});

HighlightContext.propTypes = {
  type: React.PropTypes.oneOf(Object.keys(highlightTypes)),
  label: React.PropTypes.string,
  date: React.PropTypes.number
};

/**
 * Only display a placeholder version (ie just outlines/shapes), for use
 * before sufficient data is available to display.
 */
const PlaceholderHighlightContext = function() {
  return (
    <div className="highlight-context placeholder">
      <div className="hc-icon">
        <div className="icon" />
      </div>
      <div className="hc-label" />
    </div>
  );
};

module.exports = {
  HighlightContext,
  PlaceholderHighlightContext,
  types: highlightTypes
};
