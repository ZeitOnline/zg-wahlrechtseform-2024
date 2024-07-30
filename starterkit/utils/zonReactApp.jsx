import renderReactComponent from './renderReactComponent';
import {DATA_RENDER_ATTR, PLACEHOLDER_APP_NAME} from 'starterkit/constants.js';
import 'core/styles/css-variables.scss';

const ssr = import.meta.env.SSR;
const IS_BROWSER = typeof window !== 'undefined';

/**
 * @param {Object} obj
 * @param {function} obj.App React component used by all of the vivi embeds
 * @param {string} obj.name name of the app
 * @param {Object[]} obj.viviEmbeds configuration for vivi embeds including the parameters
 * @param {string} obj.viviEmbeds.name name for vivi embed
 * @param {Object[]} obj.viviEmbeds.props props for vivi embed
 * @param {Object} obj.viviEmbeds.viviMemo object that contains styles for the vivi embed
 * @param {string} obj.viviEmbeds.viviMemo.title title displayed instead of the embed name
 * @param {string} obj.viviEmbeds.viviMemo.subtitle title displayed instead of the embed name
 * @param {string} obj.viviEmbeds.viviMemo.emoji emoji displayed left of title and subtitle
 * @param {string} obj.viviEmbeds.viviMemo.color border top color for the vivi embed
 * @param {"top"|"right"|"bottom"|"left"} obj.viviEmbeds.viviMemo.borderPos position of the colored border, defaults to left
 * @param {Object[]} obj.viviEmbeds.disableSSRBuild disable rendering each possible prop combination during build (SSR)
 * @param {string[]} obj.viviEmbeds.viviThirdPartyVendors list of third party vendors
 * @param {boolean} obj.viviEmbeds.encryptHydrationData encrypt hydration data
 * @param {Object} obj.staticIncludes configuration for static includes including the parameters
 * @param {string} obj.staticIncludes.viviEmbedName name for vivi embed
 * @param {Object[]} obj.staticIncludes.props props for vivi embed
 * @param {string[]} obj.staticIncludes.viviThirdPartyVendors list of third party vendors
 * @param {boolean} obj.staticIncludes.encryptHydrationData encrypt hydration data
 * @param {function(): string[]} obj.getIdsForStaticIncludes Creates multiple prerendered versions of one embed. This function should return an array of ids for each version.
 * @param {function(string): Object[]} obj.getPropsForStaticIncludes Provides static props to each of the prerendered versions of the embed based on the given id.
 * @param {function(Object): boolean} obj.filterPropCombinations filters out specific prop combinations before generating html includes. Use this to remove prop combinations that are possible but won’t happen, e.g. paywall=True for non-header embeds
 */
function zonReactApp({
  App,
  appName = PLACEHOLDER_APP_NAME,
  viviEmbeds,
  staticIncludes,
  getIdsForStaticIncludes,
  getPropsForStaticIncludes,
  filterPropCombinations,
}) {
  if (!App.appName) {
    App.appName = appName;
  }

  // add prefix to app name to allow apps of different projects with identical app names on the same page
  App.appId = __PROJECT_PREFIX__ + '-' + App.appName;

  if (viviEmbeds && staticIncludes) {
    throw new Error(
      `You defined viviEmbeds and staticIncludes. Remove viviEmbeds to resolve this error. An app that creates static includes is not allowed to have any normal vivi embeds.`,
    );
  }
  // @TODO warning messages for using getIds… etc. when using viviEmbeds

  if (ssr) {
    App.viviEmbeds = viviEmbeds;
    App.staticIncludes = staticIncludes;
    App.getIdsForStaticIncludes = getIdsForStaticIncludes;
    App.getPropsForStaticIncludes = getPropsForStaticIncludes;
    App.filterPropCombinations = filterPropCombinations;
  }

  const {appId} = App;

  if (IS_BROWSER) {
    renderReactComponent({
      selector: `[${DATA_RENDER_ATTR}="${appId}"]`,
      Component: App,
      appId,
    });
  }
}

export default zonReactApp;
