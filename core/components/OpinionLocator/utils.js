import {formatDefaultLocale} from 'd3-format';

const SERVER_URL = 'https://zg-opiniontool.herokuapp.com/';

const germanNumberFormat = formatDefaultLocale({
  decimal: ',',
  thousands: '.',
  grouping: [3],
  currency: ['€', ''],
});

export const IS_SMALLSCREEN = window.innerWidth < 700;

export function submitResult({id, coords, token}) {
  const data = {
    coords,
  };

  if (token) {
    data.token = token;
  }

  return fetch(`${SERVER_URL}${id}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

export function getResults(id) {
  return fetch(`${SERVER_URL}${id}`).then((res) => res.json());
}

export function getTokenResults(id) {
  return fetch(`${SERVER_URL}${id}/tokens`).then((res) => res.json());
}

export function loadSubmissionCount(id) {
  return fetch(`${SERVER_URL}${id}/count`).then((res) => res.json());
}

export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

export function numberFormat(num, decimals = 0) {
  if (typeof num === 'undefined') {
    return '';
  }

  return germanNumberFormat.format(`,.${decimals}f`)(num);
}

export function parseTokenHighlightData(tokenHighlights, tokenResult) {
  return tokenHighlights
    .filter((d) => {
      const matches = tokenResult.filter(
        (res) => res.tokens.indexOf(d.token) !== -1,
      );
      return matches.length;
    })
    .map((d) => {
      const matches = tokenResult.filter(
        (res) => res.tokens.indexOf(d.token) !== -1,
      );
      const match = matches[0];

      return {
        ...d,
        pos: match.coords,
      };
    });
}
