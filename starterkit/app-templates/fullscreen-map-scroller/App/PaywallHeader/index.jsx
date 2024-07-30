import {useEffect} from 'react';

import cn from './index.module.scss';

/**
 * Places the header embed inside of the article-page.
 *
 */
function PaywallHeader({isTruncatedByPaywall, children}) {
  useEffect(() => {
    document.querySelector('.zplus-badge')?.remove();

    if (isTruncatedByPaywall) {
      document
        .querySelector('.ad-container[data-type="desktop"][data-tile="3"]')
        ?.remove();

      document.querySelector('.article-header').classList.add('zg-paywall');

      // remove html tags in text
      document.querySelectorAll('.paragraph').forEach((d) => {
        d.innerText = d.innerText.replaceAll(/<[^>]*>/g, '');
      });
    }
  }, [isTruncatedByPaywall]);

  if (!isTruncatedByPaywall) {
    return null;
  }

  return <div className={cn.container}>{children}</div>;
}

export default PaywallHeader;
