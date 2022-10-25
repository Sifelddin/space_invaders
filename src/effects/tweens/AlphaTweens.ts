const fadeInOut = (scene: Phaser.Scene, target: Phaser.GameObjects.GameObject, fadeDuration: number, minAlpha: number, maxAlpha: number) => {
  scene.tweens.add({
      targets: target,
      alpha: { from: minAlpha, to: maxAlpha, duration: fadeDuration, ease: 'Power1' },
      yoyo: true,
      loop: -1
  })
}

const scaleFadeInOut = (scene: Phaser.Scene, target: Phaser.GameObjects.GameObject, fadeTime: number, minAlpha = 0.4, maxAlpha = 0.6, minScale = 1.5, maxScale = 2) => {
  scene.tweens.add({
      targets: target,
      props: {
        alpha: { from: minAlpha, to: maxAlpha, duration: fadeTime, ease: 'Power1' },
        scale: { from: minScale, to: maxScale, duration: fadeTime, ease: 'Power1'  },
      },
      yoyo: true,
      loop: -1
  })
}

export {
  fadeInOut,
  scaleFadeInOut
}
