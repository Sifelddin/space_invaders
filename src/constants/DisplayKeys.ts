/*
const ASPECT_RATIO = { w: 4, h: 3 }
const BASE_SIZE = 64

const globalScale = 1
const width = ASPECT_RATIO.w * globalScale * BASE_SIZE // * 10
const height = ASPECT_RATIO.h * globalScale * BASE_SIZE // * 10
*/
const width = 240
const height = 200
const centerPos = {
  x: width / 2,
  y: height / 2
}

const Viewport = {
  WIDTH: width,
  HEIGHT: height,
  CENTER: centerPos
}
export default Viewport
