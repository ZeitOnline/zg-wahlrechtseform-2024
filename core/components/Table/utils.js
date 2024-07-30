import isFinite from 'core/utils/isFinite';

/**
 * Returns the type of a given object using an accessor function.
 * Function will return undefined if one of the arguments is undefined.
 * @param {object} d Object where one key should be assessed.
 * @param {function} acc Function that retreives one number or string from an object
 * @returns {string} type of the accessed value within the object
 */
export const getTypeBy = (d, acc) =>
  d ? (typeof acc === 'function' ? typeof acc(d) : undefined) : undefined;

/**
 * Function that can be passed to `array.sort`. It can help you sort objects
 * of arrays by accessing a certain value from within an object. It's able to
 * sort strings and numbers and will put undefined values at the end.
 * @param {function} acc Function that retreives one number or string from an object
 * @param {[objects]} data Data that will be sorted, will be used to derive type
 * @param {'asc'|'desc'} sortOrder Should data be sorted ascending or descending?
 * @returns {function} Function that can be passed to `array.sort`
 */
export const getSortingFn = (acc, data, sortOrder) => {
  const type =
    typeof acc === 'function' &&
    typeof data?.map(acc).find((d) => typeof d !== 'undefined');

  return (a, b) => {
    if (getTypeBy(a, acc) === 'undefined') return 1;
    if (getTypeBy(b, acc) === 'undefined') return -1;
    if (type === 'string') {
      if (acc(a) === '') return 1;
      if (acc(b) === '') return -1;
      return sortOrder === 'asc'
        ? acc(a).localeCompare(acc(b))
        : acc(b).localeCompare(acc(a));
    }
    if (type === 'number') {
      if (!isFinite(acc(a))) return 1;
      if (!isFinite(acc(b))) return -1;
      return sortOrder === 'asc' ? acc(a) - acc(b) : acc(b) - acc(a);
    }
  };
};

/**
 * Function that returns a sorting function that can be used e.g.
 * `array.sort(sortByKey('date', array))`. It might look weird to pass
 * the whole array as a second argument but this is necessary to derive
 * the type that should be used for sorting (string or numeric)
 * @param {string} key Key that the objects in the array should be sorted after
 * @param {[objects]} data Data that will be sorted, will be used to derive type
 * @param {'asc'|'desc'} sortOrder Should data be sorted ascending or descending?
 * @returns {function} Function that can be passed to `array.sort`
 */
export function sortByKey(key, data, sortOrder) {
  return getSortingFn((d) => d[key], data, sortOrder);
}

/**
 * Returns true if an element is currently 100% within the viewport
 * @param {node} element Node that is either in or out of the viewport
 * @returns {boolean} True if the element is completely in the viewport
 */
export function isInViewport(element) {
  if (!element || typeof window === 'undefined') return false;
  const html = document.documentElement;
  const rect = element.getBoundingClientRect();
  return (
    !!rect &&
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.left <= html.clientWidth &&
    rect.top <= html.clientHeight
  );
}
