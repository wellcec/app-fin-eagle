const fontRoboto = ['Roboto', 'sans-serif'].join(',')
const fontPoppins = ['Poppins', 'sans-serif'].join(',')

const textStyle = {
  fontFamily: fontPoppins,
  fontWeight: 600,
  //color: '#3F4159',
}

const textStyleTitle = {
  fontFamily: fontPoppins,
  fontWeight: 400,
  //color: '#3F4159',
}

const typographyConfig = {
  fontFamily: fontPoppins,
  h1: textStyle,
  h2: textStyle,
  h3: textStyle,
  h4: { ...textStyle, fontWeight: 500 },
  h5: textStyleTitle,
  h6: textStyleTitle,
  subtitle1: {
    fontFamily: fontPoppins,
  },
  subtitle2: {
    fontFamily: fontPoppins,
  },
  body1: {
    fontFamily: fontPoppins,
    fontSize: window.innerWidth < 1200 ? '.75rem' : '.85rem',
  },
  body2: {
    // fontFamily: fontRoboto,
    fontWeight: 300,
    fontSize: window.innerWidth < 1200 ? '.75rem' : '.85rem',
  }
}

export default typographyConfig

// const font = ['Montserrat', 'sans-serif'].join(',')

// export const textStyle = {
//   fontFamily: font,
//   fontWeight: 600,
//   color: '#3F4159',
// }

// const typographyConfig = {
//   fontFamily: ['Poppins', 'sans-serif'].join(','),
//   h1: textStyle,
//   h2: textStyle,
//   h3: textStyle,
//   h4: textStyle,
//   h5: textStyle,
//   h6: textStyle,
//   subtitle1: {
//     fontFamily: font,
//   },
//   subtitle2: {
//     fontFamily: font,
//   },
//   body2: {
//     fontSize: window.innerWidth < 1200 ? '.75rem' : '.85rem',
//   },
// }

// export default typographyConfig

