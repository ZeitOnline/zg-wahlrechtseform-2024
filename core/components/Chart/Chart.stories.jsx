import {useMemo} from 'react';
import {rollup} from 'd3-array';
import Chart, {SVG, XAxis, YAxis, Line, Bars} from 'core/components/Chart';
import linesUrl from '../../../docs/data/example.line.csv?url';
import stackedBarsUrl from '../../../docs/data/example.stackedBars.csv?url';
import useDsv from 'core/hooks/useDsv';
import toNumber from 'core/utils/toNumber';
import {pivotLonger, tidy} from '@tidyjs/tidy';

export default {
  title: 'Chart/Container',
  component: Chart,
};

export const Lines = () => {
  const x = (d) => d.date;
  const y = (d) => d.capacity;

  const svgProps = {};
  const margin = {
    bottom: 20,
    left: 0,
    top: 20,
  };

  const rawData = useDsv(linesUrl);

  const dataLong = useMemo(() => {
    if (!rawData?.length) return [];
    return tidy(
      rawData.map((d) => ({
        ...d,
        year: toNumber(d['Jahr']),
        date: new Date(toNumber(d['Jahr']), 0, 1),
      })),
      pivotLonger({
        cols: Object.keys(rawData[0]).filter((key) => key !== 'Jahr'),
        namesTo: 'county',
        valuesTo: 'capacity',
      }),
    ).map((d) => ({...d, capacity: toNumber(d.capacity) || null}));
  }, [rawData]);

  const dataGrouped = useMemo(() => {
    return Array.from(
      rollup(
        dataLong,
        (v) => v,
        (d) => d.county,
      ),
    );
  }, [dataLong]);

  return (
    <div style={{position: 'relative', aspectRatio: '16/9'}}>
      <Chart
        style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}
        data={dataLong}
        {...{x, y, margin}}
      >
        <SVG {...svgProps}>
          <XAxis ticks={5} format="dateYearOnly" />
          <YAxis unitLabel="kWh" hideZeroLabel inset={true} />
          {dataGrouped.map(([county, values]) => (
            <Line
              data={values}
              key={county}
              smooth={false}
              unitLabel="kWh"
              style={{stroke: '#275f96', opacity: 0.25}}
            />
          ))}
        </SVG>
      </Chart>
    </div>
  );
};

export const StackedBars = () => {
  const x = (d) => d.date;
  const y = (d) => d.count;
  const g = (d) => d.gender;

  const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 0,
  };

  const rawData = useDsv(stackedBarsUrl);

  const dataLong = useMemo(() => {
    if (!rawData?.length) return [];
    return rawData.map((d) => ({
      ...d,
      year: toNumber(d['year']),
      date: new Date(toNumber(d['year']), 0, 1),
      count: toNumber(d['count']),
    }));
  }, [rawData]);

  const dataGrouped = useMemo(() => rollup(dataLong, (v) => v, g), [dataLong]);

  return (
    <div style={{position: 'relative', aspectRatio: '16/9'}}>
      <Chart
        style={{position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}
        data={dataLong}
        {...{x, y, margin}}
      >
        <SVG>
          <XAxis format="dateYearOnly" />
          <YAxis unitLabel=" Personen" hideZeroLabel inset={true} />
          <Bars
            data={dataGrouped.get('Männer')}
            style={{fill: 'var(--duv-color-geschlechter-mann'}}
          />
          <Bars
            data={dataGrouped.get('Frauen')}
            y1={(d) =>
              dataGrouped.get('Männer').find((m) => m.year == d.year)?.count
            }
            style={{fill: 'var(--duv-color-geschlechter-frau'}}
          />
        </SVG>
      </Chart>
    </div>
  );
};
