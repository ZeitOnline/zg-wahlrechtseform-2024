import {EmptyTemplate, ViviEmbed} from 'starterkit/templates';

export function Page() {
  return (
    <EmptyTemplate kicker="Starterkit" title="Wizard">
      <ViviEmbed name="starterkit-embed" />
    </EmptyTemplate>
  );
}

Page.publish = true;

export default Page;
