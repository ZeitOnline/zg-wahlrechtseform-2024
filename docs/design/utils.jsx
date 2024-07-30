import {global} from '@storybook/global';
import {ColorItem} from '@storybook/addon-docs';
import config from 'src/__starterkit_config.json';
import getCssVar from 'core/utils/getCssVar';

const prefix = config.deploymentPath.replace(/\//, '-') + '-duv';

// could pass in an array of specific stylesheets for optimization
// Source: https://codepen.io/taysim/pen/qgrbyz
export function getAllCSSVariableNames(styleSheets = document.styleSheets) {
  var cssVars = [];
  // loop each stylesheet
  for (var i = 0; i < styleSheets.length; i++) {
    // loop stylesheet's cssRules
    try {
      // try/catch used because 'hasOwnProperty' doesn't work
      for (var j = 0; j < styleSheets[i].cssRules.length; j++) {
        try {
          // loop stylesheet's cssRules' style (property names)
          for (var k = 0; k < styleSheets[i].cssRules[j].style.length; k++) {
            let name = styleSheets[i].cssRules[j].style[k];
            // test name for css variable signiture and uniqueness
            if (name.startsWith('--') && cssVars.indexOf(name) == -1) {
              cssVars.push(name);
            }
          }
        } catch (error) {
          // console.error(error);
        }
      }
    } catch (error) {
      // console.error(error);
    }
  }
  return cssVars;
}

export function getElementCSSVariables(
  allCSSVars,
  element = global.document.body,
  pseudo,
) {
  var elStyles = window.getComputedStyle(element, pseudo);
  var cssVars = {};
  for (var i = 0; i < allCSSVars.length; i++) {
    let key = allCSSVars[i];
    let value = elStyles.getPropertyValue(key);
    if (value) {
      cssVars[key] = value;
    }
  }
  return cssVars;
}

export const cssVariables = getElementCSSVariables(
  getAllCSSVariableNames(),
  global.document.documentElement,
);

export const variableNames = Object.keys(cssVariables).reverse();

// append a figure to the DOM in order to read the vars afterwards
const darkEnvironment = document.createElement('figure');
darkEnvironment.classList.add('color-scheme-dark');
global.document.body.appendChild(darkEnvironment);

export const cssVariablesDark = getElementCSSVariables(
  getAllCSSVariableNames(),
  darkEnvironment,
);

export const getVariableNames = (category = 'color') => {
  return variableNames.filter((variable) =>
    variable.match(new RegExp(`--${prefix}-${category}`)),
  );
};

export const getColors = (groupName = 'text', filterOut) => {
  return getVariableNames('color').filter((variable) => {
    if (variable.match(/rgb$/)) {
      return false;
    }
    if (filterOut && variable.match(filterOut)) {
      return false;
    }
    return variable.match(`color-${groupName}-`);
  });
};

export const variableToItem = (variable) => {
  const prefixRegex = new RegExp(`--${prefix}-([a-z]+)-([a-z]+)-`);

  return {
    title: variable.replace(prefixRegex, ''),
    subtitle: variable.replace(prefix, 'duv'),
    colors: {
      'Light Mode': getCssVar(variable),
      'Dark Mode': getCssVar(variable, darkEnvironment),
    },
  };
};

export const getColorItems = (groupName, filterOut) =>
  getColors(groupName, filterOut).map(variableToItem);

export const getPalette = (groupName, filterOut) => {
  return (
    <>
      <div className="dark-background" />
      <div className="light-and-dark">
        {getColorItems(groupName, filterOut).map((d, i) => (
          <ColorItem key={i} {...d} />
        ))}
      </div>
    </>
  );
};

export const rest = () => {
  const names = ['sonnengelb', 'rubinrot', 'seegruen', 'ozeanblau', 'beeren'];

  return (
    <>
      <div className="dark-background" />
      <div className="light-and-dark">
        {names
          .map((name) => getColors(name))
          .flat(1)
          .map(variableToItem)
          .map((d, i) => (
            <ColorItem
              key={i}
              {...d}
              title={`${names[Math.floor(i / 2)]}-${d.title}`}
            />
          ))}
      </div>
    </>
  );
};
