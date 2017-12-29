const inputWidth = 300

export default () => {
  return {
    root: {
      padding: '60px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    input: {
      width: inputWidth,
      marginBottom: 20,
    },
    loginButton: {
      width: inputWidth,
    },
  }
}
