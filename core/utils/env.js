const testTouch = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  if ('ontouchstart' in window) {
    return true;
  }
  if (window?.DocumentTouch && document instanceof window.DocumentTouch) {
    return true;
  }
  return false;
};

export const SUPPORTS_TOUCH = testTouch();

export const IS_MOBILE =
  typeof navigator !== 'undefined' &&
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

export const IS_IOS =
  typeof navigator !== 'undefined' &&
  !!navigator.platform &&
  /iPad|iPhone|iPod/.test(navigator.platform);

export const iOSVersion = () => {
  if (typeof navigator === 'undefined') {
    return null;
  }
  if (navigator.userAgent.match(/ipad|iphone|ipod/i)) {
    //if the current device is an iDevice
    var ios_info = {};
    ios_info.User_Agent = navigator.userAgent;
    ios_info.As_Reported = navigator.userAgent.match(/OS (\d)?\d_\d(_\d)?/i)[0];
    ios_info.Major_Release = navigator.userAgent
      .match(/OS (\d)?\d_\d(_\d)?/i)[0]
      .split('_')[0];
    ios_info.Full_Release = navigator.userAgent
      .match(/OS (\d)?\d_\d(_\d)?/i)[0]
      .replace(/_/g, '.');
    ios_info.Major_Release_Numeric = +navigator.userAgent
      .match(/OS (\d)?\d_\d(_\d)?/i)[0]
      .split('_')[0]
      .replace('OS ', '');
    ios_info.Full_Release_Numeric = +navigator.userAgent
      .match(/OS (\d)?\d_\d(_\d)?/i)[0]
      .replace('_', '.')
      .replace('_', '')
      .replace('OS ', ''); //converts versions like 4.3.3 to numeric value 4.33 for ease of numeric comparisons
    return ios_info;
  }
};
