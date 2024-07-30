// @ADJUST: You need to configure this function in order to return the data for you chart
export function getChartData(
  data,
  dataAccessKey,
  toggleIndex = 0,
  comparisonYearsBefore = null,
  years,
) {
  let chartData = years[toggleIndex]
    // .filter((year) => data[`${dataAccessKey}${year}`])
    .map((year) => {
      let value = +data[`${dataAccessKey}${year}`];

      const date = new Date(year, 0, 1);
      // const hasAnyData = true;
      // const hasEnoughData = true;
      const hasAnyData = !!value;
      const hasEnoughData = !!value;

      return {date, value, hasAnyData, hasEnoughData};
    });
  if (comparisonYearsBefore) {
    chartData = chartData.map((d, i, arr) => {
      if (i === arr.length - 1) {
        const prev = arr.find(
          (di) =>
            di.date.getFullYear() ===
            d.date.getFullYear() - comparisonYearsBefore,
        );
        d['relToLastYear'] = (d.value / prev?.value) * 100 - 100;
        d['lastYear'] = prev?.date;
      }
      return d;
    });
  }
  return chartData;
}

export function getMeanChartData(
  meanData,
  data,
  dataAccessKey,
  toggleIndex = 0,
  years,
) {
  return (meanData = years[toggleIndex]
    .filter(
      (year) =>
        data[`${dataAccessKey}${year}`] && meanData[`${dataAccessKey}${year}`],
    )
    .map((year) => {
      let value = +meanData[`${dataAccessKey}${year}`];

      const date = new Date(year, 0, 1);
      const hasAnyData = true;
      const hasEnoughData = true;

      return {date, value, hasAnyData, hasEnoughData};
    }));
}
