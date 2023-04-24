const ColoredLine = ({ color, height }) => {
  return (
    <hr
      style={{
        backgroundColor: color ? color : '#7998ff',
        height: height ? height : '2px',
      }}
    />
  );
};

export default ColoredLine;
