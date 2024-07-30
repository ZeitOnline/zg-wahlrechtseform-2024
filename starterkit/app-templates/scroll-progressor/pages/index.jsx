import {ArticleTemplate, LoremIpsum, ViviEmbed} from 'starterkit/templates';

export function Page() {
  return (
    <ArticleTemplate fullwidth>
      <LoremIpsum />
      <LoremIpsum />
      <ViviEmbed
        name="<%projectId%>-sticky-container-start"
        stickyElementName="grafik"
        fullwidth="true"
      />
      <ViviEmbed name="<%projectId%>-grafik" display="grafik" />
      <ViviEmbed name="<%projectId%>-waypoint-start" identifier="default" />
      <LoremIpsum />
      <ViviEmbed name="<%projectId%>-waypoint-ende" margin="20" />
      <ViviEmbed
        name="<%projectId%>-scroll-progressor-start"
        identifier="Ich komme nur ein Mal vor"
        domainFrom="-50"
      />
      <ViviEmbed name="<%projectId%>-waypoint-start" identifier="first-one" />
      <h2 className="article__subheading article__item ">Ich bin ein Titel</h2>
      <LoremIpsum />
      <ViviEmbed name="<%projectId%>-waypoint-divider" margin="50" />
      <LoremIpsum />
      <ViviEmbed name="<%projectId%>-waypoint-divider" margin="225" />
      <LoremIpsum />
      <ViviEmbed name="<%projectId%>-waypoint-ende" margin="100" />
      <ViviEmbed
        name="<%projectId%>-scroll-progressor-ende"
        domainTo="50"
        margin="0"
      />
      <ViviEmbed name="<%projectId%>-waypoint-start" identifier="second-one" />
      <LoremIpsum />
      <ViviEmbed name="<%projectId%>-waypoint-ende" margin="100" />
      <ViviEmbed name="<%projectId%>-waypoint-start" identifier="third-one" />
      <LoremIpsum />
      <ViviEmbed name="<%projectId%>-waypoint-ende" margin="100" />
      <ViviEmbed name="<%projectId%>-sticky-container-ende" />
      <ViviEmbed
        name="<%projectId%>-scroll-progressor-setup"
        windowHeightOffset="0.75"
        isUnderscroll="true"
      />
      <LoremIpsum />
      <LoremIpsum />
    </ArticleTemplate>
  );
}

Page.publish = false;

export default Page;
