import useIsSSR from 'core/hooks/useIsSSR';
import rawHtml from 'src/static/illustrator/PROJECT/ROOT.html?raw';

function App() {
  const isSSR = useIsSSR();
  let html;
  if (!isSSR) {
    const prefix = rawHtml.match(/src="(.*)\/.*\/.*\.(svg|png|jpg)"/)[1];
    html = rawHtml.replaceAll(prefix, 'illustrator/');
  } else {
    html = rawHtml;
  }
  return <div dangerouslySetInnerHTML={{__html: html}}></div>;
}

export default App;
