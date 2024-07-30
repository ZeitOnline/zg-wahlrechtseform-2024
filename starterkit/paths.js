import {join, dirname, resolve} from 'path';
import {fileURLToPath} from 'url';

const _dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : dirname(fileURLToPath(import.meta.url));

export const src = resolve(join(_dirname, '../src'));
export const starterkit = _dirname;
export const core = resolve(join(_dirname, '../core'));
export const dist = resolve(join(_dirname, '../dist'));
export const viviDist = resolve(join(dist, 'vivi'));
export const wizard = resolve(join(_dirname, 'wizard'));
export const appTemplates = resolve(join(_dirname, 'app-templates'));
export const root = resolve(join(_dirname, '..'));
