import {useEffect} from 'react';

function useMoveMarginalia() {
  useEffect(() => {
    document
      .querySelectorAll(
        '.article-body aside.authorbox, .article-body aside.portraitbox, .article-body aside.volume-teaser, .article-body aside.topicbox',
      )
      .forEach((aside) => {
        // exit if already wrapped
        if (aside.parentNode.classList.contains('duv-scrolly-wrapper')) {
          return;
        }
        const elementBefore = aside.previousElementSibling;
        const siblings = [
          aside?.nextElementSibling,
          aside?.nextElementSibling?.nextElementSibling,
        ].filter((sibling) => sibling);
        const wrapper = document.createElement('div');
        wrapper.classList.add('x-fullwidth');
        wrapper.classList.add('duv-scrolly-wrapper');
        wrapper.style.maxWidth = '62.5em';
        wrapper.style.marginLeft = 'auto';
        wrapper.style.marginRight = 'auto';
        wrapper.append(aside);
        siblings.forEach((sibling) => {
          wrapper.append(sibling);
        });
        elementBefore?.parentNode?.insertBefore(
          wrapper,
          elementBefore.nextSibling,
        );
      });
  }, []);
}

export default useMoveMarginalia;
