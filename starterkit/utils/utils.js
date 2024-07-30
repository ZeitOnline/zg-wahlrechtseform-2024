export function pythonValueToJs(value) {
  if (value === 'True') {
    return true;
  } else if (value === 'False') {
    return false;
  }

  return value;
}

/**
 * Removes leading and trailing appearances of given character if present.
 *
 * @param {string} value
 * @param {string} characterToTrim
 */
export function trim(value, characterToTrim) {
  if (!(typeof value === 'string' || value instanceof String)) {
    return value;
  }
  if (characterToTrim === ']') {
    characterToTrim = '\\]';
  } else if (characterToTrim === '^') {
    characterToTrim = '\\^';
  } else if (characterToTrim === '\\') {
    characterToTrim = '\\\\';
  }
  return value.replace(
    new RegExp('^[' + characterToTrim + ']+|[' + characterToTrim + ']+$', 'g'),
    '',
  );
}
