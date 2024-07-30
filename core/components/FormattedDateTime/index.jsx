import PropTypes from 'prop-types';
import {timeFormatLocale} from 'd3-time-format';
import deLocale from 'd3-time-format/locale/de-DE';

function getTimeOfMonthFormat({datetime, locale}) {
  const month = timeFormatLocale(locale).format('%B')(datetime);

  const day = datetime.getDate();
  let qualifier = 'Mitte';
  if (day < 10) {
    qualifier = 'Anfang';
  } else if (day > 21) {
    qualifier = 'Ende';
  }

  return `${qualifier} ${month}`;
}

// contains a non-breakable space before ‘Uhr’
// and a thin space after %-d.
export const dateTimeFormats = {
  datetime: '%-d. %B %Y, %-H:%M Uhr',
  datetimeWithoutYear: '%-d. %B, %-H:%M Uhr',
  date: '%-d. %B %Y',
  dateYearOnly: '%Y',
  dateYearOnlyShort: '%y',
  dateNumbersOnly: '%-d.%-m.%Y',
  dateWithoutYear: '%-d. %B',
  dateWithoutYearShort: '%-d. %b',
  dateWithoutYearNumbersOnly: '%-d.%-m.',
  time: '%-H:%M Uhr',
  timeOfMonth: getTimeOfMonthFormat,
  monthOnly: '%B',
  monthOnlyShort: '%b',
};

export function formatDate({
  datetime = null,
  format = 'datetime',
  locale = deLocale,
}) {
  if (datetime === null) {
    return null;
  }
  let _format = format;
  if (dateTimeFormats[format]) {
    _format = dateTimeFormats[format];
  }
  try {
    if (typeof _format === 'function') {
      return _format({datetime, locale});
    }

    return timeFormatLocale(locale).format(_format)(datetime);
  } catch (e) {
    console.log(e);
    return _format;
  }
}

const FormattedDateTime = (props) => {
  return <>{formatDate(props)}</>;
};

FormattedDateTime.propTypes = {
  /** What date and time whould be displayed? */
  datetime: PropTypes.instanceOf(Date).isRequired,
  /** Either a d3 date format or one of the following: `"datetime"`, `"datetimeWithoutYear"`, `"date"`, `"dateYearOnly"`, `"dateYearOnlyShort"`, `"dateNumbersOnly"`, `"dateWithoutYear"`, `"dateWithoutYearShort"`, `"dateWithoutYearNumbersOnly"`, `"time"`, `"timeOfMonth"`, `"monthOnly"`, `"monthOnlyShort"` */
  format: PropTypes.oneOf(Object.keys(dateTimeFormats)),
  /** Optional: Pass a custom d3 locale object */
  locale: PropTypes.object,
};

FormattedDateTime.defaultProps = {
  format: 'datetime',
};

export default FormattedDateTime;
