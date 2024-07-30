import {ArticleTemplate, ViviEmbed, LoremIpsum} from 'starterkit/templates';

export function Page() {
  return (
    <ArticleTemplate>
      <LoremIpsum />
      <ViviEmbed name="starterkit-embed" />
      <LoremIpsum />
    </ArticleTemplate>
  );
}

Page.publish = false;

export default Page;
