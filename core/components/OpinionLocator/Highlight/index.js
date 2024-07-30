import styled from 'styled-components';

const Wrapper = styled('div')`
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  position: absolute;
  cursor: ${(props) => (props.isVisible ? 'move' : 'default')};
  text-align: center;
  user-select: none;
  padding: 0 0 0 5px;
  text-align: left;
`;

const Dot = styled('div')`
  left: -2px;
  top: -2px;
  position: absolute;
  width: 4px;
  height: 4px;
  background: ${(props) => props.color || '#222'};
  border-radius: 50%;
  box-shadow: 0 0 4px white, 0 0 4px white;
`;

const Name = styled('div')`
  font-size: 10px;
  font-weight: bold;
  line-height: 1;
  color: ${(props) => props.color || '#222'};
  text-shadow: 0 0 4px white, 0 0 4px white;
  letter-spacing: 0.03em;
  text-align: ${(props) => (props.alignX === 'left' ? 'right' : 'left')};
  position: absolute;
  left: ${(props) => (props.alignX === 'left' ? 'auto' : '4px')};
  right: ${(props) => (props.alignX === 'left' ? '8px' : 'auto')};
  top: 0px;
  width: ${(props) => props.width || '10em'};

  small {
    font-size: 8px;
    font-weight: normal;
    letter-spacing: 0.06em;
  }
`;

const Highlight = ({x, y, name, color, alignX, width}) => {
  return (
    <Wrapper x={x} y={y}>
      <Dot color={color} />
      <Name
        alignX={alignX}
        width={width}
        color={color}
        dangerouslySetInnerHTML={{__html: name}}
      />
    </Wrapper>
  );
};

export default Highlight;
