const pageType = document.body.getAttribute('data-page-type');
const uniqueId = document.body.getAttribute('data-unique-id');

const ZON = {
  pageType,
  isHp: document.body.getAttribute('data-is-hp') === 'true',
  isCp: pageType === 'centerpage',
  isArticlePage: pageType === 'article',
  uniqueId,
};

export default ZON;
