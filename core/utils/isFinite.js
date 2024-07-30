function isFinite(value) {
  return typeof value == 'number' && Number.isFinite(value);
}

export default isFinite;
