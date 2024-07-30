function toNumber(string) {
  return string === 'NA' || string === '' ? undefined : +string;
}

export default toNumber;
