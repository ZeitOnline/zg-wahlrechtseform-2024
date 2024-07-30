import isNumeric from 'core/utils/isNumeric';
import toNumber from 'core/utils/toNumber';
import isValidDate from 'core/utils/isValidDate';

/**
 * Function that can be passed to `array.sort`. It can help you sort objects
 * of arrays by accessing a certain value from within an object. It's able to
 * sort strings and numbers and will put undefined values at the end.
 * @param {function|string} acc Function that retreives or key of one number or string in the objects
 * @param {'asc'|'desc'} sortOrder Should data be sorted ascending or descending?
 * @returns {function} Function that can be passed to `array.sort`
 */
const getSortingFn = (accOrKey, sortOrder) => {
  const acc =
    typeof accOrKey === 'undefined'
      ? (d) => d
      : typeof accOrKey === 'function'
        ? accOrKey
        : (d) => d?.[accOrKey];

  return (a, b) => {
    try {
      const aType = getTypeBy(a, acc);
      const bType = getTypeBy(b, acc);
      const aValue = acc(a);
      const bValue = acc(b);
      if (aType === 'undefined' || aValue == null) return 1;
      if (bType === 'undefined' || bValue == null) return -1;
      if ((aType || bType) === 'string') {
        if (aValue === '' || aType !== 'string') return 1;
        if (bValue === '' || bType !== 'string') return -1;
        return sortOrder === 'desc'
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
      if ((aType || bType) === 'number') {
        if (!isNumeric(aValue)) return 1;
        if (!isNumeric(bValue)) return -1;
        return sortOrder === 'asc'
          ? toNumber(aValue) - toNumber(bValue)
          : toNumber(bValue) - toNumber(aValue);
      }
      if (isValidDate(aValue) || isValidDate(bValue)) {
        if (!isValidDate(aValue)) return 1;
        if (!isValidDate(bValue)) return -1;
        return sortOrder === 'desc'
          ? bValue.getTime() - aValue.getTime()
          : aValue.getTime() - bValue.getTime();
      }
    } catch (e) {
      console.error('Error in getSortingFn', e);
      return 0;
    }
  };
};

export default getSortingFn;

/**
 * Returns the type of a given object using an accessor function.
 * Function will return undefined if one of the arguments is undefined.
 * @param {object} d Object where one key should be assessed.
 * @param {function} acc Function that retreives one number or string from an object
 * @returns {string} type of the accessed value within the object
 */
const getTypeBy = (d, accOrKey) => {
  const acc = typeof accOrKey === 'function' ? accOrKey : (d) => d?.[accOrKey];
  return d
    ? typeof acc === 'function'
      ? typeof acc(d)
      : undefined
    : undefined;
};
