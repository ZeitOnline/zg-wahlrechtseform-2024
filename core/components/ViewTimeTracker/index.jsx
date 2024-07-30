import {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Visibility from 'visibilityjs';
import track from 'core/utils/track.js';

import IntersectionObserver from 'core/components/IntersectionObserver';

const TRACKED_TIMES = [0, 5, 15, 30, 60, 120, 300, 600, 1200, 3600];

class ViewTimeTracker extends PureComponent {
  time = 0;
  timesToTrack = TRACKED_TIMES.slice();
  render = () => {
    const {
      tagName,
      children,
      className,
      threshold: propThreshold,
      minIntersectionRatio,
    } = this.props;

    const threshold = propThreshold.concat([minIntersectionRatio]);

    return (
      <IntersectionObserver
        className={className}
        tagName={tagName}
        onChange={this.handleIntersectionChange}
        threshold={threshold}
      >
        {children}
      </IntersectionObserver>
    );
  };
  componentDidMount = () => {
    if (!this.props.trackingId) {
      console.error('Please set a trackingId prop');
      return;
    }
  };
  componentWillUnmount = () => {
    this.removeInterval();
  };
  handleIntersectionChange = (entry) => {
    const {trackingId, debug, onChange, minIntersectionRatio} = this.props;
    if (debug) {
      console.log('---');
      console.log(trackingId);
      console.log(entry.intersectionRatio);
    }
    if (onChange) {
      onChange(entry);
    }
    if (
      entry.isIntersecting &&
      entry.intersectionRatio > minIntersectionRatio
    ) {
      if (debug) {
        console.log('adding interval');
      }
      return this.addInterval(trackingId);
    } else {
      if (debug) {
        console.log('removing interval');
      }
      return this.removeInterval(trackingId);
    }
  };
  addInterval = () => {
    if (this.interval) {
      return false;
    }

    const trackingId = this.props.trackingId;

    this.interval = Visibility.every(1000, () => {
      this.time += 1;
      if (this.time >= this.timesToTrack[0]) {
        const trackedTime = this.timesToTrack.shift();
        track(trackingId, {
          9: `viewed-${trackedTime}`,
        });
      }
      if (this.timesToTrack.length === 0) {
        this.removeInterval(trackingId);
      }
    });
  };
  removeInterval = () => {
    Visibility.stop(this.interval);
    this.interval = null;
  };
}

ViewTimeTracker.defaultProps = {
  tagName: 'div',
  threshold: [0, 0.75],
  debug: false,
  minIntersectionRatio: 0.75,
};
ViewTimeTracker.propTypes = {
  /** Tracking id. Probably best to clear it with audience development */
  trackingId: PropTypes.string.isRequired,
  /** Threshold for trigger. 0 = 0 % visible, 1 = 100 % visible */
  threshold: PropTypes.array,
  /** Optional callback function, in case you want to do something other than just tracking */
  onChange: PropTypes.func,
  /** Outputs debug information */
  debug: PropTypes.bool,
  /** Tag name for container */
  tagName: PropTypes.string,
  /** Additional className for container */
  className: PropTypes.string,
};

export default ViewTimeTracker;
