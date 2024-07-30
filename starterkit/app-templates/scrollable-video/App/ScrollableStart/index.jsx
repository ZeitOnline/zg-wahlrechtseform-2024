import PropTypes from 'prop-types';

import useIsomorphicLayoutEffect from 'core/hooks/useIsomorphicLayoutEffect';
import ScrollableVideo from '../ScrollableVideo';

import './index.scss';
import ScrollableLottie from '../ScrollableLottie';
import useIsDarkMode from 'core/hooks/useIsDarkMode';

// Adaptiert aus scrollProgressor/StickyContainer/index.jsx
function wrapWithContainer({
  dataIdentifier = 'data-prop-identifier',
  endDisplay = 'scrollable-ende',
  identifierValue,
  height,
  fullwidth = true,
}) {
  if (typeof window === 'undefined') return;
  const workHasBeenDone = !!document.querySelector(
    `.zg-sticky-container[${dataIdentifier}="${identifierValue}"]`,
  );
  const startNode = document.querySelector(
    `[${dataIdentifier}="${identifierValue}"]`,
  );
  if (!workHasBeenDone && startNode) {
    const articlePage = startNode.parentNode;
    let items = [startNode];
    let isLast = false;
    let sibling = startNode.nextElementSibling;

    const stickyContainer = document.createElement('div');
    stickyContainer.classList.add('zg-sticky-container');
    const identifierCamelCase = dataIdentifier
      .replace(/^data-/, '')
      .replaceAll(/-./g, (match) => match[1].toUpperCase());
    stickyContainer.dataset[identifierCamelCase] = identifierValue;

    if (fullwidth) {
      stickyContainer.classList.add('x-fullwidth');
      const articleBody = articlePage.parentNode;
      articleBody.style.maxWidth = 'unset';
    }

    while (!isLast && sibling) {
      items.push(sibling);
      sibling = sibling?.nextElementSibling;
      if (sibling?.dataset?.propDisplay === endDisplay) {
        items.push(sibling);
        isLast = true;
      }
    }

    articlePage.insertBefore(stickyContainer, startNode);
    stickyContainer.append(...items);

    stickyContainer.style.height = height + 'vh';
  }
}

function ScrollableStart({
  height = '400',
  identifier,
  lottieJsonUrl,
  lottieJsonUrlDark,
  fullwidth = true,
  ...props
}) {
  const isDarkMode = useIsDarkMode();
  const isLottie = lottieJsonUrl || lottieJsonUrlDark;

  useIsomorphicLayoutEffect(() => {
    wrapWithContainer({
      identifierValue: identifier,
      dataIdentifier: 'data-prop-identifier',
      height,
      endDisplay: 'scrollable-ende',
      fullwidth: [true, 'true'].includes(fullwidth),
    });
  }, []);

  if (isLottie)
    return (
      <ScrollableLottie
        lottieJsonUrl={
          isDarkMode
            ? lottieJsonUrlDark || lottieJsonUrl
            : lottieJsonUrl || lottieJsonUrlDark
        }
        {...props}
      />
    );

  // isVideo
  return <ScrollableVideo {...{identifier, ...props}} />;
}

ScrollableStart.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  identifier: PropTypes.string,
  lottieJsonUrl: PropTypes.string,
  lottieJsonUrlDark: PropTypes.string,
};

export default ScrollableStart;
