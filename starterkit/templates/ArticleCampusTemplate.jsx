import html from './raw/campus.html?raw';

import ArticleTemplateFrame from './ArticleTemplateFrame';

function ArticleCampusTemplate(props) {
  return (
    <ArticleTemplateFrame {...props} html={html}>
      {props.children}
    </ArticleTemplateFrame>
  );
}

export default ArticleCampusTemplate;
