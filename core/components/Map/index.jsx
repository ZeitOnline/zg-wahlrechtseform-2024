export {useMap, useHover} from './hooks.js';

export {default as SVG} from './SVG.jsx';
export {default as Choropleth} from './Choropleth.jsx';
export {default as Border} from './Border.jsx';
export {default as InteriorBorder} from './InteriorBorder.jsx';
export {default as Outline} from './Outline.jsx';
export {default as Label} from './Label.jsx';
export {default as default} from './MapContainer.jsx';
/*
@TODO

* The individual components could check if they’re rendered inside an SVG tag or a future canvas tag and render themselves differently in each case.
*/
