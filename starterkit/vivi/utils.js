export function jsBoolToPython(value) {
  return value ? 'True' : 'False';
}

export function pythonBoolToJs(value) {
  return value === 'True';
}

export function putIteratablePropsFirst(props) {
  const propsToPutInIfs = props.filter((d) => d.iterate);
  const otherProps = props.filter((d) => !d.iterate);
  return [...propsToPutInIfs, otherProps];
}

export function createViviAnnotation({
  title,
  subtitle,
  emoji,
  color,
  borderPos = 'left',
}) {
  const viviCss = `
.fieldname-memo .label, {
  display: none;
}

.fieldname-memo .rst-display-widget {
  ${color ? `border-${borderPos}: 5px solid ${color};` : ''}
  font-weight: bold;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}

.fieldname-memo .rst-display-widget p {
  font-size: 1.1em;
}

.fieldname-memo .rst-display-widget::after,
.fieldname-memo .rst-display-widget p::before,
.fieldname-memo .rst-display-widget p::after {
  position: relative;
  color: #717171;
  font-size: 0.8em;
  font-weight: normal;
  display: block;
}

${
  emoji
    ? `.fieldname-memo .rst-display-widget p::before {
  content: "${emoji}";
  transform: scale(1.2) translateX(0.25em);
  width: 2em;
  display: inline-block;
}`
    : ''
}

${
  subtitle
    ? `.fieldname-memo .rst-display-widget p::after {
  content: '${subtitle}';
  line-height: 1.3;
  transform: translateX(-0.1em);
  margin-top: 0.3em;
}
.fieldname-memo .rst-display-widget::before,
.fieldname-memo .rst-display-widget::after {
  padding-left: 0.8em;
}`
    : ''
}
`;

  return {viviCss, viviMemo: title};
}
