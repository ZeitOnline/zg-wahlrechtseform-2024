import cx from 'classnames';

import {BylineSnippet, MetadataSnippet} from 'core/components/VisualArticle';
import cn from './Styled.module.scss';

export function StyledByline({className}) {
  return (
    <BylineSnippet
      className={cx(cn.container, 'zg-styled-byline', className)}
    />
  );
}
export function StyledMetadata({className}) {
  return (
    <MetadataSnippet
      className={cx(cn.container, 'zg-styled-metadata', className)}
    />
  );
}
export function StyledBylineAndMetadata({className}) {
  return (
    <>
      <StyledByline className={className} />
      <StyledMetadata className={className} />
    </>
  );
}

export default StyledByline;
