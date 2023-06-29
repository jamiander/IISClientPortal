export const ProgressBar = (props: { bgcolor: any; completed: any; }) => {
    const { bgcolor, completed } = props;
  
    const containerStyles = {
      height: 20,
      width: '75%',
      backgroundColor: "#c7c7c4",
      borderRadius: 50,
    }
  
    const fillerStyles = {
      height: 20,
      width: `${completed}%`,
      backgroundColor: bgcolor,
      borderRadius: "inherit",
    }
  
    const labelStyles = {
      padding: 5,
      color: 'white',
      fontWeight: 'bold'
    }
  
    return (
      <div style={containerStyles}>
        <div style={fillerStyles}>
            <span style={labelStyles}>{`${completed}%`}</span>
        </div>
      </div>
    );
  };
