function toBoolean(input) {
  if (typeof input === 'boolean') return input;
  return `${input}`.toLowerCase().trim() === 'true';
}

export default toBoolean;
