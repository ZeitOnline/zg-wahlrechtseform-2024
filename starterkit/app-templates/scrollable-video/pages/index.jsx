import {ArticleTemplate, LoremIpsum, ViviEmbed} from 'starterkit/templates';

export function Page() {
  return (
    <ArticleTemplate fullwidth>
      <LoremIpsum />
      <LoremIpsum />
      <ViviEmbed
        name="<%projectId%>-scrollable-lottie-start"
        display="scrollable-lottie-start"
        height="300"
        fullwidth="true"
        identifier="mieten-2023"
        lottieJsonUrl="https://interactive.zeit.de/g/2023/lottie/static/lottie/mieten-2023/v1/light.json"
        lottieJsonUrlDark="https://interactive.zeit.de/g/2023/lottie/static/lottie/mieten-2023/v1/dark.json"
        totalFrames="192"
      />
      <ViviEmbed
        name="<%projectId%>-video-text-start"
        display="video-text-start"
        frameNumber="50"
      />
      <LoremIpsum />
      <ViviEmbed
        name="<%projectId%>-video-text-ende"
        display="video-text-ende"
      />
      <ViviEmbed
        name="<%projectId%>-video-text-start"
        display="video-text-start"
        frameNumber="100"
      />
      <h2 className="article__subheading article__item ">Ich bin ein Titel</h2>
      <LoremIpsum />
      <ViviEmbed
        name="<%projectId%>-video-text-ende"
        display="video-text-ende"
      />
      <ViviEmbed
        name="<%projectId%>-video-text-start"
        display="video-text-start"
        frameNumber="130"
      />
      <LoremIpsum />
      <ViviEmbed
        name="<%projectId%>-video-text-ende"
        display="video-text-ende"
      />
      <ViviEmbed
        name="<%projectId%>-scrollable-ende"
        display="scrollable-ende"
      />
      <LoremIpsum />
      <LoremIpsum />
      <ViviEmbed
        name="<%projectId%>-scrollable-video-start"
        display="scrollable-video-start"
        identifier="test"
        height="300"
        fullwidth="true"
      />
      <ViviEmbed
        name="<%projectId%>-video-text-start"
        display="video-text-start"
        frameNumber="1"
      />
      <LoremIpsum />
      <ViviEmbed
        name="<%projectId%>-video-text-ende"
        display="video-text-ende"
      />
      <ViviEmbed
        name="<%projectId%>-video-text-start"
        display="video-text-start"
        frameNumber="2"
      />
      <h2 className="article__subheading article__item ">Ich bin ein Titel</h2>
      <LoremIpsum />
      <ViviEmbed
        name="<%projectId%>-video-text-ende"
        display="video-text-ende"
      />
      <ViviEmbed
        name="<%projectId%>-scrollable-ende"
        display="scrollable-ende"
      />
      <LoremIpsum />
      <LoremIpsum />
      <ViviEmbed
        name="<%projectId%>-video-progressor-setup"
        display="video-progressor-setup"
      />
      <LoremIpsum />
      <LoremIpsum />
    </ArticleTemplate>
  );
}

Page.publish = false;

export default Page;
