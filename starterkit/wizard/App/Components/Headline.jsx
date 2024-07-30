import StandardHeadline from 'core/components/Headline';
import cn from './Headline.module.scss';

function Headline({children}) {
  return (
    <StandardHeadline className={cn.headline}>{children}</StandardHeadline>
  );
}

export default Headline;
