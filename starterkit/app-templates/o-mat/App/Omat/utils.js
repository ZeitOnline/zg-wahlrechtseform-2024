const nonFields = ['Frage', 'Antwortmöglichkeiten'];
const defaultAdditionalFields = ['Vivi-Bildergruppe'];

export function parseData(data, rawAdditionalFields = []) {
  let rawOutcomes = Object.keys(data[0])
    .filter((d) => !nonFields.includes(d))
    .map((d) => d.trim());
  let outcomes = {};
  let questions = [];
  let isOver = false;
  let additionalFields = rawAdditionalFields
    .slice(0)
    .concat(defaultAdditionalFields);

  for (const originalD of data) {
    const d = Object.keys(originalD).reduce((d, key) => {
      return {
        ...d,
        [key.trim()]: originalD[key],
      };
    }, {});
    const frage = d.Frage.trim().length ? d.Frage.trim() : null;
    if (frage === 'Auswertungstext') {
      outcomes = rawOutcomes.reduce((reducedValue, outcome) => {
        const id = outcome.trim();
        return {
          ...reducedValue,
          [id]: {id, label: id, text: d[outcome].trim()},
        };
      }, {});
      isOver = true;
    } else if (frage && frage.trim() === 'ID') {
      for (const key of Object.keys(outcomes)) {
        if (Object.hasOwn(d, key) && d[key].trim().length > 0) {
          outcomes[key]['id'] = d[key].trim();
        }
      }
    } else if (frage && !additionalFields.includes(frage)) {
      questions.push({
        text: frage,
        answers: [],
      });
    }
    if (isOver) {
      if (d.Frage.trim().length) {
        const fieldKey = d.Frage.trim();
        if (additionalFields.includes(fieldKey)) {
          for (const key of Object.keys(outcomes)) {
            if (Object.hasOwn(d, key) && d[key].trim().length > 0) {
              outcomes[key][fieldKey] = d[key].trim();
            }
          }
        }
      }
    } else {
      if (
        !d['Antwortmöglichkeiten'] ||
        !d['Antwortmöglichkeiten'].trim().length
      ) {
        continue;
      }
      questions[questions.length - 1].answers.push({
        text: d['Antwortmöglichkeiten'].trim(),
        points: rawOutcomes.reduce((reducedValue, outcome) => {
          let pointValue = 0;
          if (Object.hasOwn(d, outcome) && d[outcome]) {
            pointValue = d[outcome].trim().length ? parseInt(d[outcome]) : 0;
          }
          return {
            ...reducedValue,
            [outcome.trim()]: pointValue,
          };
        }, {}),
      });
    }
  }
  return {
    questions,
    outcomes,
  };
}
