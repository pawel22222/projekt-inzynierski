const ColoredLine = ({ color, height }) => {
    return (
        <hr
            style={ {
                backgroundColor: color ? color : '#d1d1d1',
                height: height ? height : '1px',
            } }
        />
    )
}

export default ColoredLine