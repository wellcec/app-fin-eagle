const fontFamily = ['Poppins', 'sans-serif'].join(',')

const textStyle = {
  fontFamily,
  fontWeight: 600
}

const textStyleTitle = {
  fontFamily,
  fontWeight: 400
}

const typographyConfig = {
  fontFamily,
  h1: textStyle,
  h2: textStyle,
  h3: textStyle,
  h4: { ...textStyle, fontWeight: 500 },
  h5: textStyleTitle,
  h6: textStyleTitle,
  subtitle1: {
    fontFamily
  },
  subtitle2: {
    fontFamily
  },
  body1: {
    fontFamily,
    fontSize: window.innerWidth < 1200 ? '.75rem' : '.85rem'
  },
  body2: {
    fontWeight: 300,
    fontSize: window.innerWidth < 1200 ? '.75rem' : '.85rem'
  }
}

export default typographyConfig
