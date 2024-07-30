import StyleDictionary from 'style-dictionary';
import Color from 'tinycolor2';
import {readFileSync} from 'fs';
import RecursiveIterator from 'recursive-iterator';

const {formattedVariables, fileHeader} = StyleDictionary.formatHelpers;

const darkLightFormatter =
  ({rgb}) =>
  ({dictionary, options, file}) => {
    const {outputReferences} = options;

    const variableFormatter = (dict) =>
      formattedVariables({
        dictionary: dict,
        format: 'css',
        outputReferences,
      });

    const darkDictionary = {...dictionary};
    darkDictionary.allTokens = darkDictionary.allTokens.filter(
      (d) => d.attributes.category === 'dark',
    );

    const lightDictionary = {...dictionary};
    lightDictionary.allTokens = lightDictionary.allTokens.filter(
      (d) => d.attributes.category !== 'dark',
    );

    return `
${fileHeader({file})}
@mixin darkColorsTokens${rgb ? 'Rgb' : ''} {
${variableFormatter(darkDictionary)}
}

:root {
${variableFormatter(lightDictionary)}
}

html.color-scheme-dark,
figure.color-scheme-dark {
  @include darkColorsTokens${rgb ? 'Rgb' : ''};
}

@media (prefers-color-scheme: dark) {
  html:not(.color-scheme-light) {
    @include darkColorsTokens${rgb ? 'Rgb' : ''};
  }
}
`;
  };

StyleDictionary.registerFormat({
  name: 'css/variables-rgb-zon',
  formatter: darkLightFormatter({rgb: true}),
});

StyleDictionary.registerFormat({
  name: 'css/variables-zon',
  formatter: darkLightFormatter({rgb: false}),
});

StyleDictionary.registerTransform({
  type: 'value',
  name: 'color/rgb-zon',
  matcher: (token) => token.type === 'color',
  transformer: (token) => {
    const rgbColor = Color(token.value).toRgb();
    return `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}`;
  },
});

StyleDictionary.registerTransform({
  type: 'name',
  name: 'name/remove-light-dark',
  matcher: (token) =>
    (token.type === 'color' && token.attributes.category === 'light') ||
    token.attributes.category === 'dark',
  transformer: (token) =>
    token.name.replace(/duv-light-/g, 'duv-').replace(/duv-dark-/g, 'duv-'),
});
StyleDictionary.registerTransform({
  type: 'name',
  name: 'name/remove-global',
  matcher: (token) => {
    return token.type === 'color' && token.attributes.category === 'global';
  },
  transformer: (token) => token.name.replace(/global-/g, ''),
});
StyleDictionary.registerTransform({
  type: 'name',
  name: 'name/add-rgb',
  matcher: (token) => {
    return token.type === 'color';
  },
  transformer: (token) => (token.name = `${token.name}--rgb`),
});

/**
 * Loads and transforms a Figma file into a token standard.
 */
const loadFigmaFile = (path, propertiesToInclude) => {
  const jsonContent = readFileSync(path, 'utf8')
    .replace(/\$type/g, 'type')
    .replace(/\$value/g, 'value');
  const parsedFile = JSON.parse(jsonContent);

  // convert px units to rem
  for (let {node} of new RecursiveIterator(parsedFile)) {
    if (node?.type == 'number') {
      node.type = 'sizing';
      if (typeof node.value == 'number')
        node.value =
          Math.round((node.value / 16 + Number.EPSILON) * 1000) / 1000 + 'rem';
    }
  }

  // keep only certain properties
  return propertiesToInclude.reduce(
    (obj, property) => ({...obj, [property]: parsedFile[property]}),
    {},
  );
};

const light = loadFigmaFile('./light.json', ['color']);
const dark = loadFigmaFile('./dark.json', ['color']);
const globals = loadFigmaFile('./light.json', ['size']);

const jsonTokens = {
  ...globals,
  light,
  dark,
};

for (let {node} of new RecursiveIterator(jsonTokens.light)) {
  if (node.value?.startsWith('{color.')) {
    node.value = node.value.replace('{color.', '{light.color.');
  }
}

for (let {node} of new RecursiveIterator(jsonTokens.dark)) {
  if (node.value?.startsWith('{color.')) {
    node.value = node.value.replace('{color.', '{dark.color.');
  }
}

StyleDictionary.extend({
  // source: ['tokens.json'],
  tokens: jsonTokens,
  platforms: {
    'scss-rgb': {
      prefix: 'duv',
      transforms: [
        'attribute/cti',
        'name/cti/kebab',
        'name/remove-global',
        'name/remove-light-dark',
        'name/add-rgb',
        'color/rgb-zon',
      ],
      buildPath: '../css-variables/',
      files: [
        {
          destination: '_tokens-rgb.scss',
          filter: (token) => {
            return token.type === 'color';
          },
          format: 'css/variables-rgb-zon',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    scss: {
      prefix: 'duv',
      transforms: [
        'attribute/cti',
        'name/cti/kebab',
        'name/remove-global',
        'name/remove-light-dark',
        'color/hex',
      ],
      buildPath: '../css-variables/',
      files: [
        {
          destination: '_tokens.scss',
          format: 'css/variables-zon',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
}).buildAllPlatforms();
