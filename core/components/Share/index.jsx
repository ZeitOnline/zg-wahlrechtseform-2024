import {useCallback} from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import {SUPPORTS_TOUCH, IS_MOBILE, IS_IOS} from 'core/utils/env.js';
import cn from './index.module.scss';
import FacebookIcon from './icons/FacebookRound.svg?react';
import TwitterIcon from './icons/TwitterRound.svg?react';
import SmsIcon from './icons/SMSRound.svg?react';
import WhatsappIcon from './icons/WhatsAppRound.svg?react';
import FbMessengerIcon from './icons/MessengerRound.svg?react';
import GenericIcon from './icons/GenericRound.svg?react';

const SHARE_TYPES = {
  facebook: {
    icon: FacebookIcon,
    label: 'Auf Facebook teilen',
    getUrl: ({url}) => {
      const encodedUrl = encodeURIComponent(url);
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    },
    isAvailable: () => {
      return true;
    },
  },
  fbMessenger: {
    icon: FbMessengerIcon,
    label: 'Per Facebook Messenger teilen',
    getUrl: ({url}) => {
      const encodedUrl = encodeURIComponent(url);
      return `fb-messenger://share?link=${encodedUrl}`;
    },
    isAvailable: () => {
      return IS_MOBILE;
    },
  },
  whatsApp: {
    icon: WhatsappIcon,
    label: 'Per WhatsApp teilen',
    getUrl: ({url, text}) => {
      const encodedText = encodeURIComponent(`${text} ${url}`);

      return `whatsapp://send?text=${encodedText}`;
    },
    isAvailable: () => {
      return true;
    },
  },
  twitter: {
    icon: TwitterIcon,
    label: 'Auf Twitter teilen',
    getUrl: ({url, text, hashtags, related, via}) => {
      const encodedUrl = encodeURIComponent(url);
      const encodedText = encodeURIComponent(text);

      let serviceUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;

      if (hashtags) {
        serviceUrl = `${serviceUrl}&hashtags=${hashtags.join(',')}`;
      }
      if (related) {
        serviceUrl = `${serviceUrl}&related=${related.join(',')}`;
      }
      if (via) {
        serviceUrl = `${serviceUrl}&via=${via.join(',')}`;
      }

      return serviceUrl;
    },
    isAvailable: () => {
      return true;
    },
  },
  sms: {
    icon: SmsIcon,
    label: 'Per SMS teilen',
    getUrl: ({url}) => {
      const encodedUrl = encodeURIComponent(url);

      return `sms:&body=${encodedUrl}`;
    },
    isAvailable: () => {
      return IS_MOBILE && IS_IOS;
    },
  },
  webShare: {
    icon: GenericIcon,
    label: 'Teilen',
    isAvailable: () => {
      return navigator.share;
    },
  },
};

function ShareButton({
  url,
  text,
  hashtags,
  related,
  via,
  icon: Icon,
  label,
  getUrl,
  content: rawContent,
  className,
  isAvailable,
}) {
  // don’t render SMS button on desktop etc.
  if (!isAvailable()) {
    return null;
  }

  const serviceUrl = getUrl({url, text, hashtags, related, via});

  const content = rawContent || <Icon className={cn.image} alt={label} />;

  return (
    <a
      className={cx(cn.item, className, {[cn.touch]: SUPPORTS_TOUCH})}
      href={serviceUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  );
}

function WebShareButton({
  url,
  text,
  title,
  content: rawContent,
  label,
  className,
}) {
  const handleClick = useCallback(() => {
    navigator
      .share({
        title,
        text,
        url,
      })
      .catch((error) => {
        console.error(error);
      });
  }, [text, title, url]);

  const content = rawContent || (
    <GenericIcon className={cn.image} alt={label} />
  );

  return (
    <button className={cx(cn.item, className)} onClick={handleClick}>
      {content}
    </button>
  );
}

/**
 * Renders share buttons depending on availability
 * Depending on device, OS, etc, the following services will be displayed:
 * * Facebook
 * * Facebook Messenger (mobile only)
 * * Twitter
 * * WhatsApp
 * * SMS (iOS only)
 */
const Share = function (props) {
  let buttons = [];
  if (props.webShare && SHARE_TYPES.webShare.isAvailable()) {
    const buttonProps = {
      ...props,
      ...SHARE_TYPES.webShare,
      ...props.webShare,
    };
    buttons = <WebShareButton {...buttonProps} />;
  }

  buttons = Object.keys(SHARE_TYPES)
    .filter((d) => d !== 'webShare')
    .map((d) => {
      // don’t render if e. g. <Share twitter={false} />
      // (IS_MOBILE etc. is handled by the button itself)
      if (Object.prototype.hasOwnProperty.call(props, d) && !props[d]) {
        return null;
      }
      const serviceProps = SHARE_TYPES[d];

      const buttonProps = {
        ...props, // default props for all share buttons
        ...serviceProps, // default props for specific service
        ...props[d], // props from override
      };
      return <ShareButton {...buttonProps} key={d} />;
    });

  return <div className={cx(props.className, cn.container)}>{buttons}</div>;
};

Share.propTypes = {
  /** URL of the page to share */
  url: PropTypes.string.isRequired,
  /** Text for sharing, e.g. default tweet text */
  text: PropTypes.string,
  /** Has to be enabled if you want to use the navigator.share api
   * Only supported in Chrome Android > 61, iOS 12.2, Safari Technology Preview and with `https`
   */
  webShare: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /** Override options for Twitter, or set to false to disable */
  twitter: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /** Override options for Facebook, or set to false to disable */
  facebook: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /** Override options for Facebook Messenger, or set to false to disable */
  fbMessenger: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /** Override options for WhatsApp, or set to false to disable */
  whatsApp: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /** Override options for SMS, or set to false to disable */
  sms: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  /** Additional className for container */
  className: PropTypes.string,
  /** related twitter account */
  related: PropTypes.arrayOf(PropTypes.string),
  /** via twitter account, appears at the end of tweet */
  via: PropTypes.arrayOf(PropTypes.string),
};

export default Share;
