import {createPortal} from 'react-dom';

import useIsSSR from 'core/hooks/useIsSSR';
import {useEffect} from 'react';
import cn from './index.module.scss';

let portalContainer = null;
if (typeof document !== 'undefined') {
  portalContainer = document.querySelector(
    '.article-page > .zg-paywall-header-portal',
  );
  if (!portalContainer) {
    const articlePage = document.querySelector('.article-page');
    portalContainer = document.createElement('div');
    portalContainer.classList.add('zg-paywall-header-portal');
    articlePage?.insertBefore(portalContainer, articlePage.firstChild);
  }
}

function ArticlePagePortal({children}) {
  const isSSR = useIsSSR();

  if (!portalContainer || isSSR) {
    return null;
  }
  return createPortal(children, portalContainer);
}

/**
 * Places the header embed inside of the article-page.
 */
function PaywallHeader({children}) {
  useEffect(() => {
    document.querySelector('.zplus-badge')?.remove();
    document
      .querySelector('.ad-container[data-type="desktop"][data-tile="3"]')
      ?.remove();
    document.querySelector('.iqdcontainer')?.remove();
    document.querySelector('#iqd_mainAd')?.remove();
    document.querySelector('.byline')?.remove();
    document.querySelector('.article-header')?.classList.add('zg-paywall');
    // remove html tags in text
    document.querySelectorAll('.paragraph')?.forEach((d) => {
      d.innerText = d.innerText.replaceAll(/<[^>]*>/g, '');
    });
  }, []);

  return (
    <ArticlePagePortal>
      <div className={cn.container}>{children}</div>
    </ArticlePagePortal>
  );
}

export default PaywallHeader;
