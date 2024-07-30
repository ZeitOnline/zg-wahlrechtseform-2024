/**
 * Gets the url for an indefinitely cached directory.
 *
 * @param {*} metaData - a meta data file which holds the path for the cached dir.
 */
export function getCachedDirUrl(metaData) {
  const publicUrl = __PUBLIC_URL__;
  const isProd = import.meta.env.PROD;
  const isSSR = import.meta.env.SSR;

  return isProd || isSSR
    ? `${publicUrl}${metaData.folder}`
    : `http://${window.location.host}/${metaData.folder}`;
}
