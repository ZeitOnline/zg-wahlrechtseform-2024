import {
  TooltipContentContainer,
  TooltipHeader,
  TooltipBody,
  TooltipChart,
} from './Map/Tooltip/Components.jsx';
import FormattedNumber from 'core/components/FormattedNumber';

/* START only needed for tooltips with Charts */
const years = [
  [2017, 2018, 2019, 2020, 2021],
  [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021],
];

const meanData = [
  {
    X2012: 297,
    X2013: 294,
    X2014: 293,
    X2015: 291,
    X2016: 290,
    X2017: 288,
    X2019: 286,
    X2020: 290,
    X2021: 291,
  },
  {
    X2012: 328,
    X2013: 326,
    X2014: 325,
    X2015: 324,
    X2016: 323,
    X2017: 321,
    X2019: 320,
    X2020: 324,
    X2021: 326,
  },
];
/* END only needed for tooltips with Charts */

function CustomTooltip({data, ...props}) {
  let tooltipBody = (
    <TooltipBody>
      <span>Keine Daten</span>
    </TooltipBody>
  );

  if (data.X2021 !== null) {
    tooltipBody = (
      <TooltipBody>
        <p>
          <strong>
            <FormattedNumber number={data.X2021} />
          </strong>{' '}
          private Pkw pro 1.000 Einwohner
        </p>
        <TooltipChart
          data={data}
          noData={'Keine Daten'}
          {...props}
          years={years}
          meanData={meanData}
        />
      </TooltipBody>
    );
  }

  return (
    <TooltipContentContainer>
      <TooltipHeader headline={data.GEN} subline={data.bundesland} />
      {tooltipBody}
    </TooltipContentContainer>
  );
}

export default CustomTooltip;
