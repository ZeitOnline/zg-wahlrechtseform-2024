import toNumber from 'core/utils/toNumber';

function isValidDate(value) {
  return typeof value?.getTime === 'function' && !Number.isNaN(toNumber(value));
}

export default isValidDate;
