import Autocomplete from 'core/components/Autocomplete';

import cn from './index.module.scss';

const MAPBOX_TOKEN =
  'pk.eyJ1IjoiemVpdG9ubGluZSIsImEiOiJQcFlJLXdvIn0.RdRQOquzTgkvJ_lOV3EhEA';

const GEOCODER_TYPES = [
  'country',
  'region',
  'postcode',
  'district',
  'place',
  'locality',
  'neighborhood',
];

// try not to show multiple entries per place
// by using the wikidata id
const getUniqueFeatures = function (features, language) {
  const uniqueFeatures = features.reduce(
    (reducedValue, d) => {
      if (
        d.properties.wikidata &&
        reducedValue.wikidataIds.hasOwnProperty.call(
          d.properties.wikidata,
          'objectProperty',
        )
      ) {
        return reducedValue;
      }
      if (d.properties.wikidata) {
        reducedValue.wikidataIds[d.properties.wikidata] = true;
      }
      reducedValue.features.push(d);
      return reducedValue;
    },
    {wikidataIds: {}, features: []},
  );
  if (language === 'de') {
    // change German Polish names to Polish names
    return uniqueFeatures.features.map((d) => {
      if (d.place_name_de.endsWith(', Polen')) {
        return {
          ...d,
          // text: d.text_pl,
          place_name: d.place_name_pl.replace(', Polska', ', Polen'),
        };
      }
      return {
        ...d,
      };
    });
  } else {
    return uniqueFeatures.features;
  }
};

const Geocoder = (props) => {
  const loadOptions = async (inputValue) => {
    const {config} = props;
    const {
      language = 'de',
      country,
      bbox,
      additionalTypes = [],
    } = config?.geocoderOptions?.dynamicOptions || {};

    let searchString = [
      `access_token=${MAPBOX_TOKEN}`,
      `language=${language}`,
      `types=${GEOCODER_TYPES.concat(additionalTypes).join(',')}`,
    ];
    if (country) {
      searchString.push(`country=${country}`);
    }
    if (bbox) {
      searchString.push(`bbox=${bbox.join(',')}`);
    }

    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${inputValue}.json?${searchString.join(
        '&',
      )}&fuzzyMatch=false`,
    );
    const data = await res.json();
    if (data && data.features && data.features.length) {
      const dropdownData = getUniqueFeatures(data.features, props.language).map(
        (f) => ({
          value: f.text,
          key: f.place_name_de,
          label: (
            <>
              <strong className={cn.optionName}>{f.text}</strong>
              <br />
              <small className={cn.optionPlaceName}>
                {f.place_name_de.replace(`${f.text}, `, '')}
              </small>
            </>
          ),
          data: f,
        }),
      );
      return dropdownData;
    }
    return [];
  };

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
        <Autocomplete
          onChange={handleChange}
          onInputChange={handleInputChange}
          customCompletionSelection={async (query, setCompletions) => {
            const options = await loadOptions(query);
            setCompletions(options);
          }}
          data={[]}
          placeholder={props.placeholder}
        />
      </div>
    </div>
  );
};

export default Geocoder;
