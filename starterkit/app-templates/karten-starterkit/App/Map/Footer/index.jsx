import cx from 'classnames';

import useToggle from 'core/hooks/useToggle';
import Infobox from '../Infobox';
import cn from './index.module.scss';
import PlusIcon from 'src/static/images/circle-plus.svg?react';

const InfoboxToggle = function ({open, onChange, children}) {
  return (
    <button
      className={cx(cn.infoboxToggle, {[cn.toggled]: open})}
      onClick={onChange}
    >
      <PlusIcon className={cn.infoboxToggleIcon} />{' '}
      <span className={cn.infoboxToggleLabel}>{children}</span>
    </button>
  );
};

const Footer = ({source, infobox}) => {
  const [infoboxOpen, toggleInfoboxOpen] = useToggle();
  const infoboxVisible = !!infobox;

  if (!infoboxVisible && !source) {
    return null;
  }

  const sourceElement = source ? (
    <span className={cn.source}>{source}</span>
  ) : null;

  const infoboxToggleElement =
    infobox && infoboxVisible ? (
      <>
        <InfoboxToggle onChange={toggleInfoboxOpen} open={infoboxOpen}>
          {infobox.buttonlabel}
        </InfoboxToggle>{' '}
        •
      </>
    ) : null;

  return (
    <>
      <div className={cx(cn.container, 'x-content-column')}>
        {infoboxToggleElement} {sourceElement}
      </div>
      <Infobox
        {...infobox}
        open={infoboxOpen}
        onClose={() => toggleInfoboxOpen(false)}
      />
    </>
  );
};

export default Footer;
