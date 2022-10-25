import Phaser from 'phaser'

const ONE_SECOND = 1000
const BLACK = 0x000000

const fadeCamOut = (
  scene: Phaser.Scene, enterSceneKey: string, exitSceneKey?: string, fadeTime = ONE_SECOND * 0.8, fadeToColor = BLACK
) => {
  const fadeColorRgb = Phaser.Display.Color.IntegerToRGB(fadeToColor)
  scene.cameras.main.fadeOut(fadeTime, fadeColorRgb.r, fadeColorRgb.g, fadeColorRgb.b)
  scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
    scene.time.delayedCall(fadeTime * 0.5, () => {
      if (!exitSceneKey)
      {
        scene.scene.start(enterSceneKey)
        return
      }
      scene.scene.start(enterSceneKey)
      scene.scene.stop(exitSceneKey)
    })
  })
}

const fadeCamIn = (scene: Phaser.Scene, fadeTime = ONE_SECOND * 0.4, fadeFromColor = BLACK) =>
{
  const fadeColor = Phaser.Display.Color.IntegerToRGB(fadeFromColor)
  scene.cameras.main.fadeIn(fadeTime, fadeColor.r, fadeColor.g, fadeColor.b)
}

const CameraControls = {
  FADE_OUT: fadeCamOut,
  FADE_IN: fadeCamIn
}

export default CameraControls
