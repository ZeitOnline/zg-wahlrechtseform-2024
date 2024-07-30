import {PureComponent} from 'react';
import PropTypes from 'prop-types';

class IntersectionObserverComponent extends PureComponent {
  render = () => {
    const {tagName, children, className, style} = this.props;
    const Tag = tagName;

    return (
      <Tag className={className} ref={this.bindContainerRef} style={style}>
        {children}
      </Tag>
    );
  };
  bindContainerRef = (ref) => {
    this.container = ref;
  };
  componentDidMount = () => {
    this.startObserving();
  };
  componentDidUpdate = (prevProps) => {
    if (
      prevProps.threshold.join('/') !== this.props.threshold.join('/') ||
      prevProps.rootMargin !== this.props.rootMargin
    ) {
      this.startObserving();
    }
  };
  componentWillUnmount = () => {
    this.stopObserving();
  };
  startObserving = () => {
    this.stopObserving();

    const options = {
      threshold: this.props.threshold,
    };

    if (this.props.rootMargin) {
      options.rootMargin = this.props.rootMargin;
    }

    this.io = new IntersectionObserver(
      this.handleIntersectionObserved,
      options,
    );
    this.io.observe(this.container);
  };
  stopObserving = () => {
    if (this.io) {
      this.io.unobserve(this.container);
      this.io = null;
    }
  };
  handleIntersectionObserved = (entries) => {
    const {onChange, debug} = this.props;
    entries.forEach((entry) => {
      if (debug) {
        console.log('---');
        console.log(entry.intersectionRatio);
      }
      if (onChange) {
        onChange(entry);
      }
    });
  };
}

IntersectionObserverComponent.defaultProps = {
  tagName: 'div',
  threshold: [0, 0.5],
  debug: false,
  rootMargin: '',
};
IntersectionObserverComponent.propTypes = {
  /** Callback function */
  onChange: PropTypes.func.isRequired,
  /** Threshold for trigger. 0 = 0 % visible, 1 = 100 % visible */
  threshold: PropTypes.array,
  /** rootMargin for trigger */
  rootMargin: PropTypes.string,
  /** Outputs debug information */
  debug: PropTypes.bool,
  /** Tag name for container */
  tagName: PropTypes.string,
  /** Additional className for container */
  className: PropTypes.string,
};

export default IntersectionObserverComponent;
