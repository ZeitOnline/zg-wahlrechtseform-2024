import AnimateHeight from 'react-animate-height';

import cn from './index.module.scss';

export default function Infobox({isVisible, headline, content, open}) {
  if (!isVisible) {
    return null;
  }

  return (
    <AnimateHeight duration={300} height={open ? 'auto' : 0}>
      <div className={cn.container}>
        <div className={cn.contentContainer}>
          <h3 className={cn.title}>{headline}</h3>
          <div className={cn.content}>{content}</div>
        </div>
      </div>
    </AnimateHeight>
  );
}
