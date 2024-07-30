export const takeScreenshot = function() {
  if (typeof window.callPhantom === 'function') {
    // we need a timeout for webfonts to load etc.
    window.setTimeout(() => {
      window.callPhantom({action: 'takeScreenshot'});
    }, 1000);
  }
};
