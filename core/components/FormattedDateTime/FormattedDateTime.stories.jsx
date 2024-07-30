import FormattedDateTime, {dateTimeFormats} from './index.jsx';

export default {
  title: 'Components/FormattedDateTime',
  component: FormattedDateTime,
};

export const Default = () => {
  const now = new Date();

  return (
    <table style={{textAlign: 'left'}} cellPadding={4}>
      <thead>
        <tr>
          <th>format</th>
          <th>Output</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(dateTimeFormats).map(([format], i) => (
          <tr key={`row-${i}`}>
            <th scope="row" style={{background: '#77777733'}}>
              {format}
            </th>
            <td>
              <FormattedDateTime datetime={now} format={format} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
