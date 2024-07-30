export const getRecord = (records, variable) => {
  let record = records.get(variable);
  if (!record) {
    record = {uses: 0, dependencies: new Set(), declarations: new Set()};
    records.set(variable, record);
  }
  return record;
};

function trackVar({records}) {
  return {
    postcssPlugin: 'postcss-track-var',
    Once(root) {
      const registerDependency = (variable, dependency) => {
        const record = getRecord(records, variable);
        if (!record.dependencies) record.dependencies = new Set();
        record.dependencies.add(dependency);
      };

      const registerUse = (variable) => {
        const record = getRecord(records, variable);
        record.uses++;
      };

      // detect variable uses
      root.walkDecls((decl) => {
        const isVar = decl.prop.startsWith('--');

        // initiate record
        if (isVar) {
          const record = getRecord(records, decl.prop);
          if (!record.declarations) record.declarations = new Set();
          record.declarations.add(decl);
        }

        if (!decl.value.includes('var(')) return;

        for (const match of decl.value.matchAll(
          // eslint-disable-next-line no-useless-escape
          /var\(\s*(?<name>--[^ ,\);]+)/g,
        )) {
          const variable = match.groups.name.trim();
          if (isVar) {
            // var has been used in another var
            registerDependency(decl.prop, variable);
          } else {
            // var has been used directly
            registerUse(variable);
          }
        }
      });
    },
  };
}

export default trackVar;
