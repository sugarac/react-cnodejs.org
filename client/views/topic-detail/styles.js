export const topicDetailStyle = (theme) => {
  return {
    header: {
      padding: 20,
      borderBottom: '1px solid #dfdfdf',
      '& h3': {
        margin: 0,
      },
    },
    body: {
      padding: 20,
      '& img': {
        maxWidth: '100%',
      },
      '& ul, & ol': {
        paddingLeft: 30,
        '& li': {
          marginBottom: 7,
        },
      },
    },
    replyHeader: {
      padding: '10px 20px',
      backgroundColor: theme.palette.primary[500],
      color: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
    },
    replyBody: {
      padding: 20,
    },
    replies: {
      margin: '0 24px',
      marginBottom: 24,
    },
    notLoginButton: {
      textAlign: 'center',
      padding: '20px 0',
    },
    '@media screen and (max-width: 480px)': {
      replies: {
        margin: '0 10px',
        marginBottom: 24,
      },
    },
    replyEditor: {
      position: 'relative',
      padding: 24,
      borderBottom: '1px solid #dfdfdf',
      '& .CodeMirror': {
        height: 150,
        minHeight: 'auto',
        '& .CodeMirror-scroll': {
          minHeight: 'auto',
        },
      },
    },
    replyButton: {
      position: 'absolute',
      right: 40,
      bottom: 65,
      zIndex: 101,
      opacity: 0.1,
      transition: 'opacity .3s',
      '&:hover': {
        opacity: 1,
      },
    },
    loadingContainer: {
      padding: 40,
      display: 'flex',
      justifyContent: 'space-around',
    },
  }
}

export const replyStyle = {
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 0,
    borderBottom: '1px solid #dfdfdf',
  },
  left: {
    marginRight: 20,
  },
  right: {
    '& img': {
      maxWidth: '100%',
      display: 'block',
    },
  },
}
