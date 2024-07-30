import PropTypes from 'prop-types';
import {format as d3format, formatLocale} from 'd3-format';
import germanLocale from 'd3-format/locale/de-DE';

export const formatFunction = formatLocale(germanLocale);
const defaultFormat = ',';

export const formatNumber = (number, format = defaultFormat, options = {}) => {
  try {
    const {zeroFormat, nullFormat, zeroString, showPlusSign, ...rest} = options;

    if (number === null || typeof number === 'undefined') {
      if (nullFormat) {
        return nullFormat;
      } else {
        return null;
      }
    }

    if (format === 'writeOut' || format === 'writeOutOrdinal') {
      return number <= 12 && number >= 0
        ? writtenNumbers[Math.floor(number)][format]
        : formatFunction.format(defaultFormat)(number);
    }

    if (number === 0 && zeroString) {
      return zeroString;
    }
    if (number === 0 && zeroFormat) {
      return formatFunction.format(zeroFormat)(number);
    }
    if (['humanReadable', 'humanReadableShort'].includes(format)) {
      return humanReadableFormat(number, format);
    }
    if (showPlusSign && number >= 0) {
      const formattedNumber = parseFloat(
        `${d3format(format)(number)}`.replace(/,/g, ''),
      );
      if (formattedNumber > 0) {
        return `+${formatFunction.format(format)(number)}`;
      }
      if (formattedNumber === 0) {
        return `±${formatFunction.format(format)(number)}`;
      }
    }

    const prefix =
      typeof rest?.prefix === 'object' &&
      rest.prefix.singular &&
      rest.prefix.plural
        ? number === 1
          ? rest.prefix.singular
          : rest.prefix.plural
        : rest.prefix || '';
    const suffix =
      typeof rest?.suffix === 'object' &&
      rest.suffix.singular &&
      rest.suffix.plural
        ? number === 1
          ? rest.suffix.singular
          : rest.suffix.plural
        : rest.suffix || '';

    return (
      prefix + formatFunction.format(format)(number).replace('%', ' %') + suffix
    );
  } catch (e) {
    console.error(e);
    return format;
  }
};

function FormattedNumber({
  number,
  format = defaultFormat,
  zeroFormat,
  nullFormat,
  zeroString,
  showPlusSign = false,
  prefix,
  suffix,
}) {
  return formatNumber(number, format, {
    zeroFormat,
    nullFormat,
    zeroString,
    showPlusSign,
    prefix,
    suffix,
  });
}

FormattedNumber.propTypes = {
  /** The number you want to format, please make sure its a numeric already */
  number: PropTypes.number,
  /** The d3-format string, e.g. `d` that will be passed to the original d3 format function */
  format: PropTypes.string,
  /** If the number is `null` or `undefined`, show the following string instead */
  nullFormat: PropTypes.string,
  /** If the number is `0`, show the following string instead */
  zeroString: PropTypes.string,
  /** Alternatively, you can also use a d3-format string, e.g. `d` */
  zeroFormat: PropTypes.string,
  /** Should a `+` be displayed in front of numbers above zero? */
  showPlusSign: PropTypes.bool,
  /** String rendered in front of number, either simple string or object with plural/singular */
  prefix: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      singular: PropTypes.string,
      plural: PropTypes.string,
    }),
  ]),
  /** String rendered behind number, either simple string or object with plural/singular */
  suffix: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      singular: PropTypes.string,
      plural: PropTypes.string,
    }),
  ]),
};

const HUMAN_READABLE_SUFFIXES = {
  humanReadable: [
    {fromValue: 1000000000, label: 'Millarden', divider: 1000000000},
    {fromValue: 100000, label: 'Millionen', divider: 1000000},
    {fromValue: 100, label: 'Tausend', divider: 1000},
  ],
  humanReadableShort: [
    {fromValue: 1000000000, label: 'Mrd.', divider: 1000000000},
    {fromValue: 100000, label: 'Mio.', divider: 1000000},
    {fromValue: 100, label: 'Tsd.', divider: 1000},
  ],
};

function humanReadableFormat(number, format) {
  for (const d of HUMAN_READABLE_SUFFIXES[format]) {
    if (number >= d.fromValue) {
      return `${formatFunction.format('.1f')(number / d.divider)} ${d.label}`;
    }
  }
  return formatFunction.format(defaultFormat)(number);
}

const writtenNumbers = {
  0: {writeOut: 'keiner', writeOutOrdinal: 'keiner'},
  1: {writeOut: 'eins', writeOutOrdinal: 'erst'},
  2: {writeOut: 'zwei', writeOutOrdinal: 'zweit'},
  3: {writeOut: 'drei', writeOutOrdinal: 'dritt'},
  4: {writeOut: 'vier', writeOutOrdinal: 'viert'},
  5: {writeOut: 'fünf', writeOutOrdinal: 'fünft'},
  6: {writeOut: 'sechs', writeOutOrdinal: 'sechst'},
  7: {writeOut: 'sieben', writeOutOrdinal: 'siebt'},
  8: {writeOut: 'acht', writeOutOrdinal: 'acht'},
  9: {writeOut: 'neun', writeOutOrdinal: 'neunt'},
  10: {writeOut: 'zehn', writeOutOrdinal: 'zehnt'},
  11: {writeOut: 'elf', writeOutOrdinal: 'elft'},
  12: {writeOut: 'zwölf', writeOutOrdinal: 'zwölft'},
};

export default FormattedNumber;
