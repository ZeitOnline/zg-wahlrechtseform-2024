import {ArticleTemplate, ViviEmbed, LoremIpsum} from 'starterkit/templates';

export function Page() {
  return (
    <ArticleTemplate>
      <LoremIpsum />
      <ViviEmbed name="0307-hoflaeden-map" />
      <LoremIpsum />
    </ArticleTemplate>
  );
}

Page.publish = false;

export default Page;
