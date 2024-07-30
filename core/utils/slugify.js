/**
 * Äquivalent von slugify Funktion in utils.R
 */
function slugify(string, divider = '_') {
  if (!string || typeof string !== 'string') return string;
  return (
    string
      .toLocaleLowerCase()
      // replace umlaute
      .replaceAll(/ö/g, 'oe')
      .replaceAll(/ü/g, 'ue')
      .replaceAll(/ä/g, 'ae')
      .replaceAll(/ß/g, 'ss')
      // replace whitespace
      .replaceAll(/ /g, divider)
      // replace special chars
      .normalize('NFKD')
      .replace(/[\u0300-\u036F]/g, '')
      .replaceAll(new RegExp(`[^0-9a-zA-Z${divider}]`, 'g'), '')
      // replace multiple underscores
      .replaceAll(new RegExp(`${divider}+`, 'g'), divider)
      // remove leading and trailing underscores
      .replaceAll(new RegExp(`^${divider}|${divider}$`, 'g'), '')
  );
}

export default slugify;
