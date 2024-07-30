import './polyfills';

import {PureComponent, createRef} from 'react';
import styled, {css} from 'styled-components';
import {scaleLinear} from 'd3-scale';
import {contourDensity} from 'd3-contour';
import queryString from 'query-string';

import ZON from 'core/utils/zon.js';
import TeaserTitle from 'core/components/TeaserTitle';
import TeaserText from 'core/components/TeaserText';
import Chart from 'core/components/OpinionLocator/Chart';
import AxisLabels from 'core/components/OpinionLocator/AxisLabels';
import Draggable from 'core/components/OpinionLocator/Draggable';
import ButtonArea from 'core/components/OpinionLocator/ButtonArea';
import Highlight from 'core/components/OpinionLocator/Highlight';
import Loader from 'core/components/OpinionLocator/Loader';
import Credits from 'core/components/OpinionLocator/Credits';
import More from 'core/components/OpinionLocator/More';
import Points from 'core/components/OpinionLocator/Points';
import {
  submitResult,
  getResults,
  getTokenResults,
  loadSubmissionCount,
  numberFormat,
  parseTokenHighlightData,
  clamp,
} from 'core/components/OpinionLocator/utils';
import {SUPPORTS_TOUCH} from 'core/utils/env';
import './style.scss';

const {isCp, isArticlePage} = ZON;
const CP_WIDTH = 41.66667;
const CP_MARGIN = 3.57143;
const CP_PADDING_X = 16;

const Container = styled.div`
  position: relative;

  @media (min-width: 768px) {
    ${isCp &&
    css`
      min-height: ${(props) =>
        props.innerSize && props.margin
          ? `${props.innerSize + props.margin.y * 2}px`
          : '0'};
      padding-left: ${CP_WIDTH + CP_MARGIN}%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    `}
  }
`;

const ChartWrapper = styled.div`
  position: relative;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  margin: 0 auto;
  padding: ${(props) => props.margin.y}px ${(props) => props.margin.x}px;

  @media (min-width: 768px) {
    ${isCp &&
    css`
      position: absolute;
      left: -${CP_PADDING_X}px;
      top: 0;
    `}
  }
`;

const HighlightWrapper = styled.div`
  position: relative;
`;

class OpinionLocator extends PureComponent {
  constructor() {
    super();

    const searchValues = queryString.parse(window.location.search);
    this.token = searchValues.token;
    this.container = createRef();

    this.state = {
      isDragging: false,
      isLoading: false,
      hasSubmitted: false,
      loadedResults: false,
      hasMoved: false,
      hasStarted: false,
      contour: false,
      tokenResult: false,
      hasClickedPosition: false, // after moving mouse and click to set position
      userCount: '...',
      points: [],
      chartMode: 'user',
    };
  }

  componentDidMount() {
    const computedStylesContainer = window.getComputedStyle(
      this.container.current,
    );
    const parentWidth =
      this.container.current.getBoundingClientRect().width -
      parseInt(computedStylesContainer.getPropertyValue('padding-left')) -
      parseInt(computedStylesContainer.getPropertyValue('padding-right'));

    this.margin = {
      x: 20,
      y: 25,
    };
    if (window.innerWidth >= 768) {
      this.margin = {
        x: 100,
        y: 25,
      };
    }

    this.outerWidth = parentWidth > 660 ? 660 : parentWidth;
    if (isCp && window.innerWidth >= 768) {
      this.margin = {
        x: CP_PADDING_X,
        y: 25,
      };
      this.outerWidth =
        (this.container.current.offsetWidth * CP_WIDTH) / 100 + 32;
    }

    this.innerSize = this.outerWidth - this.margin.x - this.margin.x;
    this.outerHeight = this.innerSize + this.margin.y + this.margin.y;

    this.scaleX = scaleLinear()
      .domain([this.props.minX, this.props.maxX])
      .range([0, this.innerSize]);

    this.scaleY = scaleLinear()
      .domain([this.props.minY, this.props.maxY])
      .range([this.innerSize, 0]);

    // used to scale the values from the server (only values between 0 - 100)
    this.serverScale = scaleLinear()
      .domain([0, 100])
      .range([0, this.innerSize]);

    this.setState({
      hasWidth: true,
      dragPosX: this.scaleX(0),
      dragPosY: this.scaleY(0),
    });

    const loader = this.container.current.parentNode.parentNode.querySelector(
      '.zg-opinionlocator-loader',
    );
    if (loader) {
      loader.style.display = 'none';
    }

    this.loadCount();
  }

  loadCount() {
    loadSubmissionCount(this.props.id).then((res) =>
      this.setState({userCount: numberFormat(res.count)}),
    );
  }

  onDragMove(evt) {
    if (this.state.hasSubmitted) {
      return false;
    }

    let dragPosX = (parseFloat(this.state.dragPosX) || 0) + evt.dx;
    let dragPosY = (parseFloat(this.state.dragPosY) || 0) + evt.dy;

    // the following doesn’t seem to work?
    // if (evt.restrict && evt.restrict.dy < 0 && SUPPORTS_TOUCH) {
    //     dragPosY = dragPosY + Math.min(15, -1 * evt.restrict.dy)
    //     dragPosY = Math.min(dragPosY, this.innerSize)
    // }

    // calculate restriction ourselves
    // drawback: distance between circle
    // and finger can change
    dragPosY = dragPosY <= 0 ? 0 : dragPosY;
    dragPosY = dragPosY >= this.innerSize ? this.innerSize : dragPosY;
    dragPosX = dragPosX <= 0 ? 0 : dragPosX;
    dragPosX = dragPosX >= this.innerSize ? this.innerSize : dragPosX;

    this.setState({dragPosX, dragPosY});
  }

  onDragEnd() {
    this.setState({isDragging: false, hasMoved: true});
  }

  onDragStart() {
    if (this.state.hasSubmitted) {
      return false;
    }

    if (SUPPORTS_TOUCH) {
      let dragPosY = this.state.dragPosY <= 0 ? 0 : this.state.dragPosY - 15;
      dragPosY = dragPosY <= 0 ? 0 : dragPosY;
      this.setState({dragPosY: dragPosY});
    }

    this.setState({hasStarted: true, isDragging: true});
  }

  onMouseEnter() {
    this.setState({hasStarted: true});
  }

  onMouseMove(dragPosX, dragPosY) {
    if (this.state.hasClickedPosition) {
      return false;
    }

    this.setState({dragPosX, dragPosY});
  }

  // called after user clicks after moving the circle with the mouse
  onSetPosition(evt) {
    if (this.state.hasSubmitted) {
      return false;
    }

    const {hasClickedPosition, hasSubmitted} = this.state;
    const target = evt.target || evt.srcElement;
    const rect = target.getBoundingClientRect();
    const offsetX = evt.clientX - rect.left;
    const offsetY = evt.clientY - rect.top;

    if (
      SUPPORTS_TOUCH ||
      (hasClickedPosition &&
        !hasSubmitted &&
        evt.target.id === 'draggable-wrapper')
    ) {
      return this.setState({
        dragPosX: offsetX - 25,
        dragPosY: offsetY - 25,
        hasStarted: true,
        hasMoved: true,
      });
    }

    this.setState({hasClickedPosition: true, hasMoved: true});
  }

  // called when user clicks "Abschicken"
  onSubmit() {
    if (!this.state.hasMoved || this.state.isLoading) {
      return false;
    }

    const x = clamp(
      Math.round((this.state.dragPosX / this.innerSize) * 100),
      0,
      this.innerSize,
    );
    const y = clamp(
      Math.round((this.state.dragPosY / this.innerSize) * 100),
      0,
      this.innerSize,
    );

    this.setState({isLoading: true, hasSubmitted: true});

    this.loadTokenResults();

    submitResult({
      id: this.props.id,
      coords: [x, y],
      token: this.token,
    }).then((res) => this.onResultsLoaded(res));
  }

  // called when user clicks "Nur Ergebnisse anzeigen"
  onShowResults() {
    this.setState({isLoading: true, loadedResults: true});

    getResults(this.props.id).then((res) => this.onResultsLoaded(res));

    this.loadTokenResults();
  }

  // we only show token highlights, when there is a config entry `tokenHighlights`
  loadTokenResults() {
    if (!this.props.tokenHighlights && !this.props.tokenPoints) {
      return false;
    }

    getTokenResults(this.props.id).then((res) =>
      this.onTokenResultsLoaded(res),
    );
  }

  onTokenResultsLoaded(tokenResult) {
    let tokenPoints = false;
    let tokenContours = false;

    // when there are tokenPoints we want to render, we need to find the matching coordinates
    if (this.props.tokenPoints) {
      tokenPoints = this.props.tokenPoints.map((item) => {
        tokenResult.forEach((tr) => {
          const matchingData = tr.tokens.filter((t) => item.token === t);
          if (matchingData && matchingData.length) {
            item.coords = tr.coords.map((d) => this.serverScale(d));
            item.color = this.props.tokenColors[item.party]
              ? this.props.tokenColors[item.party][1]
              : false;
          }
        });

        return item;
      });

      const tokenGroups = tokenPoints
        .reduce((res, item) => {
          const matchingData = res.filter((d) => item.party === d.id);

          if (matchingData && matchingData.length) {
            matchingData[0].values.push(item);
          } else {
            res.push({id: item.party, values: [item]});
          }

          return res;
        }, [])
        .filter((d) => this.props.tokenColors[d.id]);

      tokenContours = tokenGroups.map((item) => {
        return {
          ...item,
          contour: contourDensity()
            .x((d) => d.coords[0])
            .y((d) => d.coords[1])
            .weight((d) => 1)
            .size([this.innerSize, this.innerSize])
            .thresholds(Math.min(item.values.length, 6))(item.values),
        };
      });
    }

    this.setState({tokenResult, tokenPoints, tokenContours});
  }

  onResultsLoaded(results) {
    const cleanResults = results.filter((d) => d !== 0); // invalid data

    const contour = contourDensity()
      .x((d) => this.serverScale(d[0][0]))
      .y((d) => this.serverScale(d[0][1]))
      .weight((d) => d[1])
      .size([this.innerSize, this.innerSize])
      .cellSize(this.innerSize / 100)
      .thresholds(7)(cleanResults);

    const points = this.props.showPoints
      ? cleanResults
          .filter((d, i) => i < 50000)
          .map((d) => ({
            x: this.serverScale(d[0][0]),
            y: this.serverScale(d[0][1]),
            count: d[1],
          }))
      : [];

    setTimeout(
      () =>
        this.setState({
          isLoading: false,
          contour,
          points,
        }),
      250,
    );
  }

  setChartMode(chartMode) {
    this.setState({chartMode});
  }

  renderHighlights(showHighlights) {
    if (!showHighlights) {
      return null;
    }

    return (
      <HighlightWrapper>
        {this.props.highlights
          .filter((d) => d.chartMode === this.state.chartMode)
          .map((d) => (
            <Highlight
              key={d.name}
              name={d.name}
              alignX={d.alignX}
              width={d.width}
              x={this.serverScale(d.pos[0])}
              y={this.serverScale(d.pos[1])}
              color={d.color || '#222'}
            />
          ))}
      </HighlightWrapper>
    );
  }

  renderTokenHighlights(showHighlights) {
    if (!showHighlights) {
      return null;
    }

    const tokenHighlights = parseTokenHighlightData(
      this.props.tokenHighlights,
      this.state.tokenResult,
    );

    return (
      <HighlightWrapper>
        {tokenHighlights.map((d) => (
          <Highlight
            key={d.name}
            name={d.name}
            alignX={d.alignX}
            width={d.width}
            x={this.serverScale(d.pos[0])}
            y={this.serverScale(d.pos[1])}
          />
        ))}
      </HighlightWrapper>
    );
  }

  render() {
    const isResultMode =
      (this.state.hasSubmitted || this.state.loadedResults) &&
      !this.state.isLoading;
    const showHighlights =
      isResultMode && this.props.highlights && this.props.highlights.length;
    const showTokenHighlights =
      isResultMode &&
      this.props.tokenHighlights &&
      this.props.tokenHighlights.length &&
      this.state.tokenResult;
    const showCredits = this.props.credits && isResultMode;
    const showMore = this.props.more && isResultMode;
    const homeArticleUrlPath = this.props.sharingUrl.replace(
      'https://www.zeit.de',
      '',
    );
    const teaserTitle = isArticlePage ? null : (
      <TeaserTitle
        kicker={this.props.kicker}
        title={this.props.title}
        isAufmacher={isCp}
        linkUrl={homeArticleUrlPath}
      />
    );

    const teaserText = isArticlePage ? null : (
      <TeaserText>
        {this.props.question.replace(
          '{count}',
          this.state.userCount.toLocaleString(),
        )}
      </TeaserText>
    );

    let loader = !this.state.hasWidth ? null : (
      <Loader isVisible={this.state.isLoading} />
    );
    let axisLabels = !this.state.hasWidth ? null : (
      <AxisLabels
        isResultMode={isResultMode}
        innerSize={this.innerSize}
        outerWidth={this.outerWidth}
        outerHeight={this.outerHeight}
        margin={this.margin}
        scaleX={this.scaleY}
        scaleY={this.scaleX}
        colorX={this.props.colorX}
        colorY={this.props.colorY}
        minXLabel={this.props.minXLabel}
        maxXLabel={this.props.maxXLabel}
        minYLabel={this.props.minYLabel}
        maxYLabel={this.props.maxYLabel}
        labelColorX={this.props.labelColorX}
        labelColorY={this.props.labelColorY}
      />
    );
    let draggable = !this.state.hasWidth ? null : (
      <Draggable
        dragPosX={this.state.dragPosX}
        dragPosY={this.state.dragPosY}
        innerSize={this.innerSize}
        onDragMove={(evt) => this.onDragMove(evt)}
        onDragEnd={(evt) => this.onDragEnd(evt)}
        onDragStart={(evt) => this.onDragStart(evt)}
        onMouseEnter={(evt) => this.onMouseEnter(evt)}
        onMouseMove={(x, y) => this.onMouseMove(x, y)}
        hasSubmitted={this.state.hasSubmitted}
        loadedResults={this.state.loadedResults}
        isDragging={this.state.isDragging}
        hasClickedPosition={this.state.hasClickedPosition}
        onClick={(evt) => this.onSetPosition(evt)}
        hasStarted={this.state.hasStarted}
        dragCallToAction={this.props.dragCallToAction}
      />
    );

    let chart = !this.state.hasWidth ? null : (
      <Chart
        innerSize={this.innerSize}
        axisCircleSize={3}
        scaleX={this.scaleX}
        scaleY={this.scaleY}
        contour={this.state.contour}
        points={this.state.points}
        isResultMode={isResultMode}
        hasStarted={this.state.hasStarted}
        colorX={this.props.colorX}
        colorY={this.props.colorY}
        dragPosX={this.state.dragPosX}
        dragPosY={this.state.dragPosY}
        highlights={this.props.highlights}
        loadedResults={this.state.loadedResults}
        showHelperLines={this.props.showHelperLines}
        densityMinColor={this.props.densityMinColor}
        densityMaxColor={this.props.densityMaxColor}
        hasToken={this.token}
        tokenPoints={this.state.tokenPoints}
        tokenContours={this.state.tokenContours}
        tokenColors={this.props.tokenColors}
        chartMode={this.state.chartMode}
        gradientBackground={this.props.gradientBackground}
      />
    );

    const chartWrapper = !this.state.hasWidth ? null : (
      <ChartWrapper
        margin={this.margin}
        width={this.outerWidth}
        height={this.outerHeight}
      >
        {loader}
        {axisLabels}
        {this.renderHighlights(showHighlights)}
        {this.renderTokenHighlights(showTokenHighlights)}
        {draggable}
        {chart}
        {!this.token && this.state.chartMode === 'user' && (
          <Points size={this.innerSize} points={this.state.points} />
        )}
      </ChartWrapper>
    );

    const buttonArea = (
      <ButtonArea
        isDisabled={!this.state.hasMoved || this.state.hasSubmitted}
        onSubmit={() => this.onSubmit()}
        onShowResults={() => this.onShowResults()}
        isVisible={!isResultMode}
        hasToken={this.token}
        sharingUrl={this.props.sharingUrl}
        sharingText={this.props.sharingText}
        sharingHashtags={this.props.sharingHashtags}
        setChartMode={(mode) => this.setChartMode(mode)}
        showChartToggle={this.props.showChartToggle}
        chartMode={this.state.chartMode}
        resultText={this.props.resultText}
        count={this.state.userCount}
        width={this.innerSize}
      />
    );

    return (
      <Container
        ref={this.container}
        innerSize={this.innerSize}
        margin={this.margin}
      >
        {teaserTitle}
        {teaserText}
        {chartWrapper}
        {buttonArea}
        <Credits isVisible={!isCp && showCredits} text={this.props.credits} />
        <More isVisible={!isCp && showMore} text={this.props.more} />
      </Container>
    );
  }
}

OpinionLocator.defaultProps = {
  id: 'testproject',
  question: '',
  resultText: '',
  sharingUrl: '',
  sharingText: '',
  sharingHashtags: [],
  minX: -1,
  maxX: 1,
  minXLabel: '',
  maxXLabel: '',
  minY: -1,
  maxY: 1,
  minYLabel: '',
  maxYLabel: '',
  colorX: '#00CBDB',
  colorY: '#F76906',
  labelColorX: '#00CBDB',
  labelColorY: '#F76906',
  highlights: false,
  tokenHighlights: false,
  tokenPoints: false,
  tokenColors: {},
  showHelperLines: true,
  showPoints: true,
  showChartToggle: false,
  gradientBackground: false,
  dragCallToAction: 'Wie verorten Sie sich?',
};

export default OpinionLocator;
