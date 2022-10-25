import Viewport from '../constants/DisplayKeys'
import GradientKeys from '~/constants/colors/GradientKeys'

const SKY_COLOR = 0x5C6FCC
const GRADIENT = GradientKeys.GLASS_OVERLAY

const makeDitherRow = (scene: Phaser.Scene, startY: number, rowHeight: number, rowColor: number) => {
  const squareSize = Viewport.SCALE
  const solidRow = scene.add.rectangle(0, startY + rowHeight * 0.5, Viewport.WIDTH * 2, rowHeight, rowColor)
  const ditherRow = scene.add.grid(0, startY, Viewport.WIDTH * 2, rowHeight, squareSize, squareSize, rowColor, 0)
    .setOutlineStyle().setAltFillStyle(rowColor)
  return { solidRow, ditherRow }
}

export const addDitherGradient = (scene: Phaser.Scene, startColor = SKY_COLOR, brightenFactor = 4, numRows = 8) => {
  const colorObj = Phaser.Display.Color.IntegerToColor(startColor)
  const rowHeight = Viewport.HEIGHT / numRows
  const stripeContainer = scene.add.container(0, 0)

  for (let i = 0; i < numRows + 1; i++)
  {
    const ditherGroup = makeDitherRow(scene, rowHeight * i, rowHeight, colorObj.color)
    colorObj.brighten(brightenFactor)
    stripeContainer.add([ditherGroup.ditherRow, ditherGroup.solidRow])
  }
}

export const addGradientOverlay = (
  scene: Phaser.Scene,
  topL = GRADIENT.topLeft, topR = GRADIENT.topRight,
  bottomL = GRADIENT.bottomLeft,bottomR = GRADIENT.bottomRight,
  alpha = 0.5 ) => {
  const gradient = scene.add.graphics()
    .fillGradientStyle(topL, topR, bottomL, bottomR, alpha)
    .fillRect(0, 0, Viewport.WIDTH, Viewport.HEIGHT)
  return gradient
}

export const addRepeatingColumns = (scene: Phaser.Scene, numColumns = 9, colorA = 0xB3C0FF, colorB = 0xC8D6FF) => {
  const stripeWidth = Viewport.WIDTH / numColumns
  scene.add.grid(Viewport.CENTER.x, Viewport.CENTER.y, Viewport.WIDTH, Viewport.HEIGHT, stripeWidth, Viewport.HEIGHT)
    .setFillStyle(colorA).setAltFillStyle(colorB).setOutlineStyle()
}
