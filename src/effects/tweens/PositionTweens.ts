const hoverUpDown = (scene: Phaser.Scene, target: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[], floatTime: number, endY: number) => {
  scene.tweens.add({
    targets: target,
      y: endY,
      duration: floatTime,
      yoyo: true,
      repeat: -1,
  })
}

const slideToPosition = (scene: Phaser.Scene, targetObjs: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[], targetX: number, targetY: number) => {
  scene.tweens.add({
    targets: targetObjs,
    x: targetX,
    y: targetY,
    duration: 500,
    ease: Phaser.Math.Easing.Bounce.InOut
  })
}

export {
  hoverUpDown,
  slideToPosition
}
