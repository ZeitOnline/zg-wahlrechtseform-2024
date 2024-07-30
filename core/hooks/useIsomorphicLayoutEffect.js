import {useLayoutEffect} from 'react';
import noop from 'core/utils/noop';
const isSSR = import.meta.env.SSR;

export default isSSR ? noop : useLayoutEffect;
