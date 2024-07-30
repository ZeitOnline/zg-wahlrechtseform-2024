// Setz diese booleans auf true wenn du einige visuelle Hilfestellungen
// und nützliche Konsolenausgaben haben willst
const debug = {
  scrollProgressor: true,
  waypoints: true,
};

const onlyInDevMode = Object.entries(debug).reduce((acc, [key, value]) => {
  acc[key] = value && import.meta.env.DEV;
  return acc;
}, {});

export default onlyInDevMode;
