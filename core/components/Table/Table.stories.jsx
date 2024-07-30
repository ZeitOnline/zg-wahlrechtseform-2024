import range from 'core/utils/range.js';
import {formatNumber} from 'core/components/FormattedNumber';
import Table, {Row, Cell, TitleRow, TitleCell} from './index.jsx';

export default {
  title: 'Components/Table',
  component: Table,
};

const data = range(1, 28).map((i) => ({value: i}));

export const Default = () => {
  return (
    <div className="article__item">
      <Table
        data={data}
        header={
          <TitleRow style={{padding: '0.5em 0'}}>
            <TitleCell sortBy="value">Original</TitleCell>
            <TitleCell sortBy="value">Ausgeschrieben</TitleCell>
          </TitleRow>
        }
        initialSortedBy="value"
        initialSortOrder="asc"
        widths="120px 1fr"
        renderRow={(d, i) => (
          <Row key={i}>
            <div>{d.value}</div>
            <div>
              {/* <FormattedNumber number={d.value} format="writeOut" /> */}
              {formatNumber(d.value, 'writeOut')}
            </div>
          </Row>
        )}
      />
    </div>
  );
};

export const UsingTemplateAreas = () => {
  return (
    <div className="article__item">
      <Table
        data={data}
        nTop={10}
        header={
          <TitleRow style={{padding: '0.5em 0'}}>
            <TitleCell sortBy="value">Original</TitleCell>
            <TitleCell sortBy="value">Ausgeschrieben</TitleCell>
          </TitleRow>
        }
        initialSortedBy="value"
        initialSortOrder="asc"
        widths="120px 1fr"
        areas='"top-left top-right" "bottom-left bottom-right"'
        colGap={10}
        rowGap={4}
        innerRowGap={2}
        renderRow={(d, i) => (
          <Row key={i} style={{borderTop: '1px solid lightgrey'}}>
            <Cell area="top-left">{d.value}</Cell>
            <Cell area="top-right">{formatNumber(d.value, 'writeOut')}</Cell>
            <Cell area="bottom-left">Foo</Cell>
            <Cell area="bottom-right">Bar</Cell>
          </Row>
        )}
      />
    </div>
  );
};

export const TopFlop = () => {
  return (
    <div className="article__item">
      <Table
        data={data}
        nTopFlop={4}
        header={
          <TitleRow style={{padding: '0.5em 0'}}>
            <TitleCell sortBy="value">Original</TitleCell>
            <TitleCell sortBy="value">Ausgeschrieben</TitleCell>
          </TitleRow>
        }
        initialSortedBy="value"
        initialSortOrder="asc"
        widths="120px 1fr"
        debug
        renderRow={(d, i) => (
          <Row key={i}>
            <div>{d.value}</div>
            <div>{formatNumber(d.value, 'writeOut')}</div>
          </Row>
        )}
      />
    </div>
  );
};

export const ShowingPageNumbers = () => {
  return (
    <div className="article__item">
      <Table
        data={data}
        nTop={4}
        header={
          <TitleRow style={{padding: '0.5em 0'}}>
            <TitleCell sortBy="value">Original</TitleCell>
            <TitleCell sortBy="value">Ausgeschrieben</TitleCell>
          </TitleRow>
        }
        initialSortedBy="value"
        initialSortOrder="asc"
        widths="120px 1fr"
        showPageNumbers
        renderRow={(d, i) => (
          <Row key={i}>
            <div>{d.value}</div>
            <div>{formatNumber(d.value, 'writeOut')}</div>
          </Row>
        )}
      />
    </div>
  );
};

export const ShowingPrevNext = () => {
  return (
    <div className="article__item">
      <Table
        data={data}
        nTop={4}
        header={
          <TitleRow style={{padding: '0.5em 0'}}>
            <TitleCell sortBy="value">Original</TitleCell>
            <TitleCell sortBy="value">Ausgeschrieben</TitleCell>
          </TitleRow>
        }
        initialSortedBy="value"
        initialSortOrder="asc"
        widths="120px 1fr"
        showPrevNext
        renderRow={(d, i) => (
          <Row key={i}>
            <div>{d.value}</div>
            <div>{formatNumber(d.value, 'writeOut')}</div>
          </Row>
        )}
      />
    </div>
  );
};
