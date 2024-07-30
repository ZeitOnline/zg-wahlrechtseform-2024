import {useState, useCallback} from 'react';
import {SUPPORTS_TOUCH} from 'core/utils/env';

import {
  offset,
  flip,
  shift,
  autoUpdate,
  useFloating,
  useInteractions,
  useHover,
  useClick,
  useFocus,
  useRole,
  useDismiss,
} from '@floating-ui/react-dom-interactions';

import InfoIcon from 'core/icons/info-circle-filled.svg?react';
import CloseIcon from 'core/icons/close-circle-filled.svg?react';
import cn from './index.module.scss';

import {createPortal} from 'react-dom';
import useIsSSR from 'core/hooks/useIsSSR';

const overlayPortalId = `overlay-portal-${Math.random().toString(36).substring(7)}`;

if (
  typeof window !== 'undefined' &&
  !document.getElementById(overlayPortalId)
) {
  const tooltipWrapper = document.createElement('div');
  tooltipWrapper.id = overlayPortalId;
  tooltipWrapper.style.zIndex = 99999;
  tooltipWrapper.style.position = 'relative';
  document.body.appendChild(tooltipWrapper);
}

function OverlayPortal({children}) {
  const isSSR = useIsSSR();
  if (isSSR) {
    return null;
  }
  return createPortal(children, document.getElementById(overlayPortalId));
}

const InfoButton = ({children, placement = 'top'}) => {
  const [open, setOpen] = useState(false);

  const {x, y, reference, floating, strategy, context} = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    middleware: [offset(5), flip(), shift({padding: 8})],
    whileElementsMounted: autoUpdate,
  });

  const {getFloatingProps, getReferenceProps} = useInteractions([
    useHover(context, {mouseOnly: true}),
    useFocus(context),
    useRole(context, {role: 'tooltip'}),
    useClick(context, {
      pointerDown: true,
      ignoreMouse: true,
    }),
    useDismiss(context, {
      outsidePointerDown: true,
      ancestorScroll: true,
    }),
  ]);

  const handleClick = useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
  }, []);

  let infoButtonIcon = null;
  if (SUPPORTS_TOUCH && open) {
    infoButtonIcon = <CloseIcon className={cn.icon} alt="Info schließen" />;
  } else {
    infoButtonIcon = <InfoIcon className={cn.icon} alt="Info anzeigen" />;
  }

  return (
    <div className={cn.container} data-hide-in-screenshot="hide">
      <button
        {...getReferenceProps({
          ref: reference,
          className: cn.button,
          onClick: handleClick,
        })}
      >
        {infoButtonIcon}
      </button>
      {open && (
        <OverlayPortal>
          <div
            {...getFloatingProps({
              ref: floating,
              className: cn.content,
              style: {
                position: strategy,
                top: y ?? '',
                left: x ?? '',
              },
            })}
          >
            {children}
          </div>
        </OverlayPortal>
      )}
    </div>
  );
};

export default InfoButton;
