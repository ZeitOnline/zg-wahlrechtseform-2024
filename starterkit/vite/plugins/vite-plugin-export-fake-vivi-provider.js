/**
 * add fake vivi provider export
 * the fake vivi provider provides a context to use for Page components
 */
function exportPages() {
  return {
    name: 'export-fake-vivi-provider',
    transform(src, id, options = {}) {
      if (!options.ssr || !id.includes('/pages/')) {
        return null;
      }

      return `export {default as FakeViviProvider} from 'starterkit/templates/FakeViviProvider.jsx';
        ${src}`;
    },
  };
}

export default exportPages;
