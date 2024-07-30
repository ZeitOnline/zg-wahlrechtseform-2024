import {useContext} from 'react';
import PropTypes from 'prop-types';
import html from './raw/empty.html?raw';
import ArticleTemplateFrame from './ArticleTemplateFrame';
import {ViviContext} from './FakeViviProvider.jsx';

function EmptyTemplate(props) {
  let viviContextValue = useContext(ViviContext);
  viviContextValue = {...viviContextValue, paywall: false, pagetype: 'custom'};

  return (
    <ViviContext.Provider value={viviContextValue}>
      <ArticleTemplateFrame {...props} html={html}>
        {props.children}
      </ArticleTemplateFrame>
    </ViviContext.Provider>
  );
}

EmptyTemplate.propTypes = {
  title: PropTypes.string,
  header: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  kicker: PropTypes.string,
  teaser: PropTypes.string,
  fullwidth: PropTypes.bool,
  forceDark: PropTypes.bool,
  forceLight: PropTypes.bool,
  disablePaywallFooter: PropTypes.bool,
  className: PropTypes.string,
};

export default EmptyTemplate;
