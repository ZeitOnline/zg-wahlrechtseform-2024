import {useMemo} from 'react';
import {dsvFormat} from 'd3-dsv';
import useCachedFetch from './useCachedFetch';

const defaultParseFn = (d) => d;
const empty = [];

export const useDsv = (
  url,
  options,
  parseFn = defaultParseFn,
  delimiter = ',',
  fallBack = empty,
) => {
  const {response} = useCachedFetch(url, options);

  const data = useMemo(() => {
    if (!response?.length) return fallBack;
    try {
      const parser = dsvFormat(url.match(/\.tsv/) ? '\t' : delimiter || ',');
      return parser.parse(response).map(parseFn);
    } catch (e) {
      console.log(e);
      return fallBack;
    }
  }, [delimiter, fallBack, response, parseFn, url]);

  return data;
};

export default useDsv;
