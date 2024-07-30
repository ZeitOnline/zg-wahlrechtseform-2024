import dateFnsTz from 'date-fns-tz';
import {differenceInCalendarDays, addHours} from 'date-fns';
import {timeParse, timeFormat} from 'd3-time-format';

import {formatDate} from 'core/components/FormattedDateTime';

const {utcToZonedTime} = dateFnsTz;

const formatWithoutTimezone = timeFormat('%Y-%m-%dT%H:%M:%S.%L');
const parseWithoutTimezone = timeParse('%Y-%m-%dT%H:%M:%S.%L');

export function getTimeAgoString({date, fallback}) {
  // always use datetime in berlin for comparison
  const berlinToday = utcToZonedTime(new Date().toISOString(), 'Europe/Berlin');
  const berlinTodayString = formatWithoutTimezone(berlinToday);
  const today = parseWithoutTimezone(berlinTodayString);

  const dataAgeInDays = differenceInCalendarDays(today, date);

  if (dataAgeInDays === 0) {
    return 'heute';
  }
  if (dataAgeInDays === 1) {
    return 'gestern';
  }
  if (dataAgeInDays === 2) {
    return 'vorgestern';
  }
  if (fallback === 'weekday') {
    return `am ${formatDate({datetime: date, format: '%A'})}`;
  }

  return `am ${formatDate({
    datetime: date,
    format: 'dateWithoutYearNumbersOnly',
  })}`;
}

const hoursFormat = timeFormat('%-H');
export function getHoursString({datetime}) {
  // always use datetime in berlin for comparison
  const berlinDatetime = utcToZonedTime(
    datetime.toISOString(),
    'Europe/Berlin',
  );
  const berlinDatetimeString = formatWithoutTimezone(berlinDatetime);
  const fixedDate = parseWithoutTimezone(berlinDatetimeString);
  const fixedDateEnd = addHours(fixedDate, 1);

  return `${hoursFormat(fixedDate)}–${hoursFormat(fixedDateEnd)}`;
}
