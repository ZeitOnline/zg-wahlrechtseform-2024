import PropTypes from 'prop-types';

import rawHtml from './raw/datawrapper-easy-embed.html?raw';
import {replaceComments} from './utils.js';

/**
 * Simulates an Easy Embed with a datawrapper graphic
 */
function DatawrapperEasyEmbed({datawrapperId}) {
  let newHtml = replaceComments({
    html: rawHtml,
    slots: {
      url: datawrapperId,
    },
  });

  return (
    <div
      className="embed-wrapper"
      dangerouslySetInnerHTML={{
        __html: newHtml,
      }}
    />
  );
}

DatawrapperEasyEmbed.propTypes = {
  /** id of datawrapper graphic */
  datawrapperId: PropTypes.string,
};

export default DatawrapperEasyEmbed;
