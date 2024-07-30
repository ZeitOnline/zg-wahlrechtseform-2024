import {ArticleTemplate, ViviEmbed, LoremIpsum} from 'starterkit/templates';

export function Page() {
  return (
    <ArticleTemplate
      fullwidth={true}
      header={<ViviEmbed name="paywall-header" display="paywall" />}
    >
      <LoremIpsum />
      <ViviEmbed name="projectname-embed" />
      <LoremIpsum />
    </ArticleTemplate>
  );
}

Page.publish = false;

export default Page;
