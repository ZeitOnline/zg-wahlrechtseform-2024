import {ArticleTemplate, ViviEmbed, LoremIpsum} from 'starterkit/templates';

export function Page() {
  return (
    <ArticleTemplate>
      <LoremIpsum />
      <ViviEmbed
        title="So hoch ist die Wertsteigerung von Immobilien pro Jahr"
        subtitle="Suchen Sie nach Ihrem Bundesland."
      />
      <LoremIpsum />
    </ArticleTemplate>
  );
}

Page.publish = false;

export default Page;
