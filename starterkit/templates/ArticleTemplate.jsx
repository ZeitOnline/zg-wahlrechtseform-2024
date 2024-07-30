import PropTypes from 'prop-types';
import html from './raw/article.html?raw';

import ArticleTemplateFrame from './ArticleTemplateFrame';

function ArticleTemplate(props) {
  return (
    <ArticleTemplateFrame {...props} html={html}>
      {props.children}
    </ArticleTemplateFrame>
  );
}

ArticleTemplate.propTypes = {
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

export default ArticleTemplate;
