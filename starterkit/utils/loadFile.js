const ssr = import.meta.env.SSR;

let loadFileFunc = () => {};
let loadJSONFunc = () => {};
let loadCSVFunc = () => {};

if (ssr) {
  loadFileFunc = async (rawPath) => {
    const fs = await import('fs');
    const path = await import('path');

    let data = null;

    if (rawPath.startsWith('http')) {
      const res = await fetch(rawPath);
      data = await res.text();
    } else {
      let paths = rawPath.split('/');
      if (rawPath.startsWith('/')) {
        paths = ['/', ...paths];
      }
      const filePath = path.resolve(...paths);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      data = fileContent;
    }

    return data;
  };

  loadJSONFunc = async (rawPath) => {
    const data = await loadFileFunc(rawPath);
    return JSON.parse(data);
  };

  loadCSVFunc = async (rawPath) => {
    const fs = await import('fs');
    const path = await import('path');
    const d3Dsv = await import('d3-dsv');

    let paths = rawPath.split('/');
    if (rawPath.startsWith('/')) {
      paths = ['/', ...paths];
    }

    const filePath = path.resolve(...paths);
    const fileContent = fs.readFileSync(filePath, 'utf8').toString();

    let data = null;

    data = d3Dsv.csvParse(fileContent);

    return data;
  };
}

export const loadFile = loadFileFunc;
export const loadJSON = loadJSONFunc;
export const loadCSV = loadCSVFunc;
