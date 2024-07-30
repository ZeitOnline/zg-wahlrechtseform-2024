import useIsomorphicLayoutEffect from 'core/hooks/useIsomorphicLayoutEffect';
import './index.scss';
import useMoveMarginalia from 'core/hooks/useMoveMarginalia';

function wrapWithContainer(stickyElementName, top, fullwidth) {
  if (typeof window === 'undefined') return;
  const workHasBeenDone = !!document.querySelector(
    `.zg-sticky-container[data-sticky-element-name="${stickyElementName}"]`,
  );
  if (!workHasBeenDone) {
    const startNode = document.querySelector(
      `[data-prop-sticky-element-name="${stickyElementName}"]`,
    );
    const articlePage = startNode.parentNode;
    let items = [];
    let isLast = false;
    let sibling = startNode.nextElementSibling;

    const stickyContainer = document.createElement('div');
    stickyContainer.classList.add('zg-sticky-container');
    if (fullwidth) {
      stickyContainer.classList.add('x-fullwidth');
      const articleBody = articlePage.parentNode;
      articleBody.style.maxWidth = 'unset';
    }
    stickyContainer.dataset.stickyElementName = stickyElementName;

    while (!isLast && sibling) {
      items.push(sibling);
      sibling = sibling?.nextElementSibling;
      if (sibling?.dataset?.propDisplay === 'sticky-container-ende') {
        isLast = true;
      }
    }

    articlePage.insertBefore(stickyContainer, startNode);
    stickyContainer.append(...items);

    const stickyElement = stickyContainer.querySelector(
      `[data-prop-display="${stickyElementName}"]`,
    );
    if (stickyElement) {
      stickyElement.style.position = 'sticky';
      stickyElement.style.top = top;
    }
  }
}

function StickyContainer({stickyElementName, top = '0px', fullwidth}) {
  useIsomorphicLayoutEffect(() => {
    wrapWithContainer(
      stickyElementName,
      top,
      [true, 'true'].includes(fullwidth),
    );
  }, []);
  useMoveMarginalia();
  return null;
}

StickyContainer.propTypes = {};

export default StickyContainer;
