import Phaser from 'phaser'
import Viewport from '~/constants/DisplayKeys'

enum TweenTime
{
  TOTAL = 400,
  DOT_OFFSET = 300,
  FADE_OUT = 100,
}

const createDots = (scene: Phaser.Scene, dotSize: number, dotColor: number) => {
  let dots = [] as Phaser.GameObjects.Arc[]
  const dotsRadius = dotSize / 2
  const dotsGap = dotSize * 2

  for (let i = 0; i < 3; ++i)
  {
    const dot = scene.add.circle(i * dotsGap, 0, dotsRadius, dotColor, 1)
    dots.push(dot)
  }
  return dots
}

const createTweenTimeline = (scene: Phaser.Scene, dots: Phaser.GameObjects.Arc[] = []) => {

  const tweenTimeline = scene.tweens.timeline({ loop: -1 })

  let offset = 0

  /*** TO DO: replace with stagger? ***/
  for (let i = 0; i < dots.length; ++i)
  {
    const dot = dots[i]
    dot.setAlpha(0)

    const fadeInTween = {
      targets: dot,
      alpha: 1,
      duration: TweenTime.TOTAL,
      ease: Phaser.Math.Easing.Sine.In,
      offset
    }

    tweenTimeline.add(fadeInTween)
    offset += TweenTime.DOT_OFFSET
  }

  const fadeOutTween = {
    targets: dots,
    alpha: 0,
    duration: TweenTime.FADE_OUT
  }
  tweenTimeline.add(fadeOutTween)

  return tweenTimeline
}

const getEllipsesOffset = (dotSize: number) => {
  const ellipsesLength = dotSize * 5
  const offset = ellipsesLength / 3
  return offset
}

export const playLoadingEllipses = (scene: Phaser.Scene, x = Viewport.CENTER.x, y = Viewport.CENTER.y, dotSize = 8, dotColor = 0xFFFFFF) => {
  const dots = createDots(scene, dotSize, dotColor)

  const dotsTween = createTweenTimeline(scene, dots)
  dotsTween.play()

  const offsetX = getEllipsesOffset(dotSize)
  scene.add.container(x - offsetX, y, dots)
}
