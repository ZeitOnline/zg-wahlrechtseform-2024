import CloseButton from 'core/components/CloseButton';
import Popup from './Popup';
import Card from 'core/components/Card';
import Button from 'core/components/Button';
import cx from 'classnames';

import {IS_MOBILE} from 'core/utils/env';

import cn from './index.module.scss';
import {useMemo} from 'react';

const Content = ({
  tooltipComponent,
  data,
  expandedData,
  disableExpandedView,
  setIsExpanded,
  isExpanded,
}) => {
  const Component = tooltipComponent;
  return (
    <div className={cn.container}>
      <Component
        isExpanded={isExpanded && !disableExpandedView}
        {...(data || expandedData)}
      />
      {!disableExpandedView && IS_MOBILE && (
        <div className={cn.footer}>
          <Button
            className={cn.button}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}
          </Button>
        </div>
      )}
    </div>
  );
};

const Tooltip = ({
  config,
  data,
  expandedData,
  isExpanded,
  setIsExpanded,
  position,
  point,
  dimensions,
  showInsidePopup,
  disableExpandedView,
  staticText,
  onClose = () => {},
}) => {
  const visible = useMemo(() => {
    return !!expandedData || (data && position);
  }, [expandedData, data, position]);

  const content = useMemo(() => {
    if (!visible) {
      return '';
    }
    return staticText ? (
      <div className={cn.info}>{staticText}</div>
    ) : (
      <Content
        tooltipComponent={
          isExpanded
            ? config?.tooltipOptions?.expandedTooltip || (() => '')
            : config?.tooltipOptions?.condensedTooltip || (() => '')
        }
        data={data}
        expandedData={expandedData}
        disableExpandedView={disableExpandedView}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
    );
  }, [
    staticText,
    data,
    expandedData,
    visible,
    disableExpandedView,
    setIsExpanded,
    isExpanded,
    config,
  ]);

  if (!visible) {
    return null;
  }

  return showInsidePopup ? (
    <Popup
      latitude={position?.lat}
      longitude={position?.lng}
      closeButton={false}
      className={cx(cn.popup)}
      referencePoint={point}
      dimensions={dimensions}
      tipSize={4}
      onClose={onClose}
    >
      {IS_MOBILE && (
        <CloseButton className={cn.closeButton} onClick={onClose} />
      )}
      {content}
    </Popup>
  ) : (
    <Card className={cx(cn.tooltip, cn.desktopTooltip)}>
      <CloseButton className={cn.closeButton} onClick={onClose} />
      {content}
    </Card>
  );
};

export default Tooltip;
