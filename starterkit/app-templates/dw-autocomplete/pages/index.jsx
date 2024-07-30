import {ArticleTemplate, ViviEmbed, LoremIpsum} from 'starterkit/templates';

export function Page() {
  return (
    <ArticleTemplate>
      <LoremIpsum />
      <ViviEmbed
        name="datawrapper-autocomplete-<%chartId%>"
        initialChartId={null}
        searchBarPlaceholder={'Suche nach einem Land...'}
      />
    </ArticleTemplate>
  );
}

Page.publish = false;

export default Page;
