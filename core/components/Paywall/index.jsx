import PropTypes from 'prop-types';
import VisualArticleSnippet from 'core/components/VisualArticle/FullwidthSnippet';
import PaywallHeader from './PaywallHeader';
import PaywallOverlay from './PaywallOverlay';

function Paywall({
  isTruncatedByPaywall,
  imgMobile,
  imgDesktop,
  imgMobileDark,
  imgDesktopDark,
  alt,
  isVisualArticle = true,
}) {
  if (!isTruncatedByPaywall)
    return <>{isVisualArticle && <VisualArticleSnippet />}</>;

  return (
    <>
      {isVisualArticle && <VisualArticleSnippet />}
      <PaywallHeader>
        <PaywallOverlay
          imgMobile={imgMobile}
          imgDesktop={imgDesktop}
          imgMobileDark={imgMobileDark}
          imgDesktopDark={imgDesktopDark}
          alt={alt}
        />
      </PaywallHeader>
    </>
  );
}

Paywall.propTypes = {
  /** Boolean created by vivi, see viviParameterTypes.isTruncatedByPaywall */
  isTruncatedByPaywall: PropTypes.bool,
  /** Placeholder image source for mobile light */
  imgMobil: PropTypes.string,
  /** Placeholder image source for desktop light */
  imgDesktop: PropTypes.string,
  /** Placeholder image source for mobile dark */
  imgMobileDark: PropTypes.string,
  /** Placeholder image source for desktop dark */
  imgDesktopDark: PropTypes.string,
  /** Alt text for the images */
  alt: PropTypes.string,
  /** If set to true, `<VisualArticleSnippet />` will be rendered. Even if user is logged in! */
  isVisualArticle: PropTypes.bool,
};

export default Paywall;
