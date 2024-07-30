import {BylineSnippet} from 'core/components/VisualArticle';
import {ArticleTemplate, LoremIpsum, ViviEmbed} from 'starterkit/templates';

export function Page() {
  return (
    <ArticleTemplate
      header={<ViviEmbed name="<%projectId%>-paywall-header" />}
      fullwidth
      forceLight
    >
      <ViviEmbed
        name="<%projectId%>-sticky-container-start"
        display="sticky-container-start"
        fullwidth="True"
        stickyElementName="mapbox-karte"
        top="0"
      />
      <ViviEmbed name="<%projectId%>-mapbox-karte" display="mapbox-karte" />
      <ViviEmbed
        name="<%projectId%>-waypoint-start"
        display="waypoint-start"
        identifier="default"
      />
      <p className="paragraph article__item">Schritt 1: Lorem Ipsum</p>
      <ViviEmbed
        name="<%projectId%>-waypoint-ende"
        display="waypoint-ende"
        margin="100"
      />
      <ViviEmbed
        name="<%projectId%>-waypoint-start"
        display="waypoint-start"
        identifier="step-one"
      />
      <p className="paragraph article__item">Schritt 1: Lorem Ipsum</p>
      <ViviEmbed
        name="<%projectId%>-waypoint-ende"
        display="waypoint-ende"
        margin="100"
      />
      <ViviEmbed
        name="<%projectId%>-waypoint-start"
        display="waypoint-start"
        identifier="step-two"
      />
      <p className="paragraph article__item">Schritt 2: Lorem Ipsum</p>
      <ViviEmbed
        name="<%projectId%>-waypoint-ende"
        display="waypoint-ende"
        margin="100"
      />
      <ViviEmbed
        name="<%projectId%>-waypoint-start"
        display="waypoint-start"
        identifier="step-three"
      />
      <p className="paragraph article__item">
        Schritt 3: Jetzt selbst erkunden
      </p>
      <ViviEmbed
        name="<%projectId%>-waypoint-ende"
        display="waypoint-ende"
        margin="100"
      />
      <ViviEmbed
        name="<%projectId%>-sticky-container-ende"
        display="sticky-container-ende"
      />
      <BylineSnippet />
      <LoremIpsum />
      <ViviEmbed
        name="<%projectId%>-scroll-progressor-setup"
        display="scroll-progressor-setup"
        windowHeightOffset="0.8"
      />
    </ArticleTemplate>
  );
}

Page.publish = false;

export default Page;
