const PageBackground = {
  NICO: {
    topLeft: 0x6C81E9, // rgba(108, 129, 233, 1) 0%
    endColor: 0xB3C0FF // rgba(179, 192, 255, 1) 100%
  },
  RACCOON: {
    startColor: 0x717790,
    endColor: 0xA0ADE2
  }
}

const DarkOverlay = {
  topLeft: 0x717790,
  topRight: 0x2C3751,
  bottomLeft: 0x2C3751,
  bottomRight: 0x717790
}

const GlassOverlay = {
  topLeft: 0xB3C0FF,
  topRight: 0xDFE7FF,
  bottomLeft: 0xC8D6FF,
  bottomRight: 0x6C81E9
}

const GradientKeys = {
  BACKGROUND: PageBackground,
  DARK_OVERLAY: DarkOverlay,
  GLASS_OVERLAY: GlassOverlay
}

export default GradientKeys
