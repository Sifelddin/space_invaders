import Viewport from '~/constants/DisplayKeys'

export default class RepeatingBackground extends Phaser.GameObjects.TileSprite
{
  scene: Phaser.Scene
  private scrollFactor: { x: number, y: number }
  private speed: number
  private shouldAutoScroll = true

  constructor(scene: Phaser.Scene, textureKey: string, scrollX = -1.5, scrollY = 1, speed = 0.5)
  {
    super(scene, 0, 0, Viewport.WIDTH, Viewport.HEIGHT, textureKey)
    this.scene = scene
    this.scrollFactor = { x: scrollX, y: scrollY}
    this.speed = speed

    this.setOrigin(0) 
    this.scene.add.existing(this)

    this.scene.events.on(Phaser.Scenes.Events.POST_UPDATE, this.updateBackground, this)
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.events.off(Phaser.Scenes.Events.POST_UPDATE, this.updateBackground, this)
      this.destroy()
    })
  }

  setScrollFactor(scrollX: number, scrollY: number)
  {
    this.scrollFactor = { x: scrollX, y: scrollY }
    return this
  }

  setSpeed(speed: number)
  {
    this.speed = speed
    return this
  }

  enableAutoScroll(shouldAutoScroll: boolean)
  {
    this.shouldAutoScroll = shouldAutoScroll
    return this
  }

  private updateBackground()
  {
    if (!this.shouldAutoScroll)
    {
      this.setTilePosition(this.scene.cameras.main.scrollX * this.scrollFactor.x, this.scene.cameras.main.scrollY * this.scrollFactor.y)
      return
    }
    this.tilePositionX += this.scrollFactor.x * this.speed
    this.tilePositionY += this.scrollFactor.y * this.speed
  }
}
