function isNumeric(number) {
  if (typeof number === 'undefined' || number === null) {
    return false;
  }
  return !isNaN(number) && isFinite(number);
}

export default isNumeric;
