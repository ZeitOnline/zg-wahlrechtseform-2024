import {join} from 'path';
import {readFileSync} from 'fs';
import {dist} from '../paths.js';
import {getPublicPath} from '../vite/utils.js';
import {getStarterkitConfig} from './starterkit.js';

export function getManifest(target) {
  return JSON.parse(
    readFileSync(join(dist, target, '.vite', 'manifest.json'), 'utf8'),
  );
}

/**
 * Runs through the manifest tree recursively and gets all properties using the given propertyGetter.
 *
 * @returns {any[]}
 */
function getPropertyRecursively({key, manifest, propertyGetter}) {
  const definition = manifest[key];
  const property = propertyGetter(definition);
  if (!definition.imports) {
    return property;
  }

  const properties = definition.imports
    .reduce(
      (prev, importKey) =>
        prev.concat([
          getPropertyRecursively({key: importKey, manifest, propertyGetter}),
        ]),
      [property],
    )
    .flat()
    .filter((d) => d);

  return [...new Set(properties)];
}

function renderLinkTag(rel, href) {
  return `<link rel="${rel}" href="${href}">`;
}

export function getStylesheets(appName) {
  const deploymentPath = getStarterkitConfig().deploymentPath;
  const publicPath = getPublicPath(deploymentPath);
  const manifest = getManifest('client');
  const key = `src/apps/${appName}/index.jsx`;

  return getPropertyRecursively({
    key,
    manifest,
    propertyGetter: (d) => {
      return d.css;
    },
  }).map((cssFile) => renderLinkTag('stylesheet', publicPath + cssFile));
}

function renderScriptTag(src) {
  return `<script src="${src}" type="module"></script>`;
}

const MODULEPRELOAD_POLYFILL =
  '(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll("link[rel=\\\\"modulepreload\\\\"]"))l(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&l(c)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function l(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();';

export function getPreloads(appName) {
  const deploymentPath = getStarterkitConfig().deploymentPath;
  const publicPath = getPublicPath(deploymentPath);
  const manifest = getManifest('client');
  const key = `src/apps/${appName}/index.jsx`;
  const entryFile = manifest[key].file;

  const preloads = getPropertyRecursively({
    key,
    manifest,
    propertyGetter: (d) => d.file,
  })
    .filter((file) => file !== entryFile)
    .map((file) => renderLinkTag('modulepreload', publicPath + file));

  return preloads;
}

export function getHeadScriptTags() {
  // disable polyfill for now as this causes everything to load twice in firefox
  // return [`<script>${MODULEPRELOAD_POLYFILL}</script>`];
  return [];
}

export function getScriptTags(appName) {
  const deploymentPath = getStarterkitConfig().deploymentPath;
  const publicPath = getPublicPath(deploymentPath);
  const manifest = getManifest('client');
  const key = `src/apps/${appName}/index.jsx`;
  const entryFile = manifest[key].file;
  const entryScriptTag = renderScriptTag(publicPath + entryFile);

  return [entryScriptTag];
}

/**
 * Load all JS Modules as normal scripts (no modulepreload).
 */
export function getScriptTagsNoPreload(appName) {
  const tags = getScriptTags(appName);

  const deploymentPath = getStarterkitConfig().deploymentPath;
  const publicPath = getPublicPath(deploymentPath);
  const manifest = getManifest('client');
  const key = `src/apps/${appName}/index.jsx`;
  const entryFile = manifest[key].file;

  const preloads = getPropertyRecursively({
    key,
    manifest,
    propertyGetter: (d) => d.file,
  })
    .filter((file) => file !== entryFile)
    .map((file) => renderScriptTag(publicPath + file));

  return [...preloads, ...tags];
}
