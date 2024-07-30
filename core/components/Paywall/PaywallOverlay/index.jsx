import useIsDarkMode from 'core/hooks/useIsDarkMode';
import useIsSSR from 'core/hooks/useIsSSR';
import useMediaQuery from 'core/hooks/useMediaQuery';
import PaywallExclusiveContainer from '../PaywallExclusiveContainer';
import cn from './index.module.scss';

const PaywallOverlay = ({
  imgDesktop,
  imgDesktopDark,
  imgMobile,
  imgMobileDark,
  alt,
}) => {
  const isSSR = useIsSSR();
  const isDarkMode = useIsDarkMode();
  const userPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  // override in case prefers-color-scheme and actual used color scheme do not match up
  let overrideDesktop, overrideMobile;
  if (
    !isSSR &&
    isDarkMode !== userPrefersDark &&
    ((imgMobile && imgMobileDark) || (imgDesktop && imgDesktopDark))
  ) {
    overrideDesktop = isDarkMode ? imgDesktopDark : imgDesktop;
    overrideMobile = isDarkMode ? imgMobileDark : imgMobile;
  }

  return (
    <div className={cn.container}>
      <div className={cn.overlay} />
      <PaywallExclusiveContainer />
      <picture>
        {imgDesktopDark && (
          <source
            srcSet={overrideDesktop || imgDesktopDark}
            media="(prefers-color-scheme: dark) and (min-width: 465px)"
          />
        )}
        {imgMobileDark && (
          <source
            srcSet={overrideMobile || imgMobileDark}
            media="(prefers-color-scheme: dark)"
          />
        )}

        {imgDesktop && (
          <source
            srcSet={overrideDesktop || imgDesktop}
            media={`${
              imgDesktopDark ? '(prefers-color-scheme: light) and' : ''
            } (min-width: 465px)`}
          />
        )}
        {imgMobile && (
          <source
            srcSet={overrideMobile || imgMobile}
            media={imgMobileDark && '(prefers-color-scheme: light)'}
          />
        )}

        <img
          src={imgMobile || imgMobileDark || imgDesktop || imgDesktopDark}
          alt={alt}
          className={cn.image}
          loading="lazy"
        />
      </picture>
    </div>
  );
};

export default PaywallOverlay;
