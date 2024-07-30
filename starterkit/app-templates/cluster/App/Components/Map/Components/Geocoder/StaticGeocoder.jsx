import Autocomplete from 'core/components/Autocomplete';
import {useMemo} from 'react';
import useDsv from 'core/hooks/useDsv';

import cn from './index.module.scss';

const StaticGeocoder = (props) => {
  const data = useDsv(props?.url);
  const dropdownData = useMemo(() => {
    if (!data) return [];
    return data.map((d) => {
      return {
        value: d.name,
        label: (
          <>
            <strong className={cn.optionName}>{d.name}</strong>
          </>
        ),
        data: {
          ...d,
          coordinates: [+d?.lon || +d?.longitude, +d.lat || +d?.latitude],
        },
      };
    });
  }, [data]);

  const handleChange = (selectedOption) => {
    if (!selectedOption) {
      return props.onClear && props.onClear();
    }
    props.onGeocode(selectedOption.data);
  };

  const handleInputChange = (input) => {
    props.onInputChange(input);
  };

  return (
    <div className={cn.wrapper}>
      {props.title && <div className={cn.title}>{props.title}</div>}
      <div className={cn.container}>
        {dropdownData && (
          <Autocomplete
            onChange={handleChange}
            onInputChange={handleInputChange}
            data={dropdownData}
            placeholder={props?.placeholder}
          />
        )}
      </div>
    </div>
  );
};

export default StaticGeocoder;
