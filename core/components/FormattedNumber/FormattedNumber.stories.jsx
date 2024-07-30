import FormattedNumber from './index.jsx';

export default {
  title: 'Components/FormattedNumber',
  component: FormattedNumber,
};

export const Default = () => {
  const inputs = [-20.21, 0, 2.5125, 143.53, 5125.123, 12351233];
  const formats = ['d', '1,', '.0%', '+$,'];

  return (
    <>
      <div className="article__item">
        Die folgende Tabelle zeigt {inputs.length * formats.length} verschiedene
        Beispiele von der Komponente <code>&lt;FormattedNumber /&gt;</code>.
        <br />
        Im <strong>Spaltenkopf</strong> seht ihr jeweils das Format{' '}
        <code>format</code> welches angewendet wurde und im{' '}
        <strong>Zeilenkopf</strong> die Zahl <code>number</code>, welche als
        Input für die Formatierung diente.
      </div>
      <br />
      <div className="article__item">
        <table style={{textAlign: 'left'}} cellPadding={4}>
          <thead>
            <tr>
              <th>Input</th>
              {formats.map((format, j) => (
                <th
                  key={`head-${j}`}
                  scope="col"
                  style={{background: '#77777733'}}
                >
                  <code>{format}</code>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inputs.map((number, i) => (
              <tr key={`row-${i}`}>
                <th scope="row" style={{background: '#77777733'}}>
                  {number}
                </th>
                {formats.map((format, j) => (
                  <td key={`col-${j}`}>
                    <FormattedNumber number={number} format={format} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const HumanReadable = () => {
  const inputs = [-20.21, 0, 2.5125, 143.53, 5125.123, 12351233];
  const formats = ['humanReadable', 'humanReadableShort'];

  return (
    <>
      <div className="article__item">
        <table style={{textAlign: 'left'}} cellPadding={4}>
          <thead>
            <tr>
              <th>Input</th>
              {formats.map((format, j) => (
                <th
                  key={`head-${j}`}
                  scope="col"
                  style={{background: '#77777733'}}
                >
                  <code>{format}</code>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inputs.map((number, i) => (
              <tr key={`row-${i}`}>
                <th scope="row" style={{background: '#77777733'}}>
                  {number}
                </th>
                {formats.map((format, j) => (
                  <td key={`col-${j}`}>
                    <FormattedNumber number={number} format={format} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const WriteOut = () => {
  const inputs = new Array(13).fill(null).map((_, i) => i);
  const formats = ['writeOut', 'writeOutOrdinal'];

  return (
    <>
      <div className="article__item">
        <table style={{textAlign: 'left'}} cellPadding={4}>
          <thead>
            <tr>
              <th>Input</th>
              {formats.map((format, j) => (
                <th
                  key={`head-${j}`}
                  scope="col"
                  style={{background: '#77777733'}}
                >
                  <code>{format}</code>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inputs.map((number, i) => (
              <tr key={`row-${i}`}>
                <th scope="row" style={{background: '#77777733'}}>
                  {number}
                </th>
                {formats.map((format, j) => (
                  <td key={`col-${j}`}>
                    <FormattedNumber number={number} format={format} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const SuffixAndPrefix = () => {
  const format = ',';
  const prefix = 'Ich habe ';
  const suffix = {
    singular: ' Kind',
    plural: ' Kinder',
  };
  return (
    <>
      <FormattedNumber number={0} {...{format, prefix, suffix}} />
      <br />
      <FormattedNumber number={1} {...{format, prefix, suffix}} />
      <br />
      <FormattedNumber number={2} {...{format, prefix, suffix}} />
      <br />
      <FormattedNumber number={3} {...{format, prefix, suffix}} />
    </>
  );
};
