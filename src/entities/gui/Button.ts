import Phaser from 'phaser'

const CLEAR_TINT = 0xFFFFFF
const DISABLED_TINT = 0x999999

export default class Button extends Phaser.GameObjects.Container
{
  scene: Phaser.Scene
  private texture: { key: string, upFrame: string, overFrame: string, downFrame: string, disabledFrame: string }
  private buttonBase: Phaser.GameObjects.Sprite

  private buttonIcon?: Phaser.GameObjects.Sprite
  private buttonText?: Phaser.GameObjects.BitmapText

  private buttonContent: GuiContent[] = []
  private observers: ObserverCallback[] = []
  private contentDownY = 1

	constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string, upFrame: string, overFrame: string, downFrame: string, disabledFrame?: string)
	{
    super(scene, x, y)
    this.scene = scene
    this.texture = { key: textureKey, upFrame: upFrame, overFrame: overFrame, downFrame: downFrame, disabledFrame: disabledFrame ?? upFrame }
    this.buttonBase = this.scene.add.sprite(0, 0, this.texture.key, this.texture.upFrame).setOrigin(0.5)
    this.buttonBase.setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleUp, this)
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, this.handleOut, this)
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handleDown, this)
      .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, this.handleOver, this)
    this.add(this.buttonBase)
    this.scene.add.existing(this)
	}

  subscribe(listener: ObserverCallback)
  {
    this.observers.push(listener)
  }

  unsubscribe(listener: ObserverCallback)
  {
    this.observers = this.observers.filter(subscriber => subscriber!== listener)
  }

  enableButton(shouldEnable: boolean)
  {
    if (shouldEnable)
    {
      this.buttonBase.setInteractive()
      this.buttonBase.setFrame(this.texture.upFrame)
      this.tintButton(CLEAR_TINT)

      return this
    }
    this.buttonBase.disableInteractive()
    this.buttonBase.setFrame(this.texture.disabledFrame)
    this.tintButton(DISABLED_TINT)
    return this
  }

  displayButton(shouldDisplay: boolean)
  {
    this.buttonBase.setVisible(shouldDisplay)
    if (!this.buttonContent.length)
    {
      return this
    }
    this.buttonContent.forEach( element => element.setVisible(shouldDisplay))
    return this
  }

  destroyButton()
  {
    this.destroy()
  }

  setBaseTexture(textureKey: string, upFrame: string, overFrame: string, downFrame: string, disabledFrame?: string)
  {
    this.texture = {
      key: textureKey,
      upFrame: upFrame,
      overFrame: overFrame,
      downFrame: downFrame,
      disabledFrame: disabledFrame ?? upFrame
    }
    return this
  }

  setIcon(key: string, frame: string | number, xPos = 0, yPos = 0)
  {
    if (!this.buttonIcon)
    {
      this.buttonIcon = this.scene.add.sprite(xPos, yPos, key, frame).setOrigin(0.5)
      this.addContent(this.buttonIcon)
      return this
    }
    this.buttonIcon.setPosition(xPos, yPos)
    this.buttonIcon.setTexture(key, frame)
    return this
  }

  setIconFrame(frame: string | number)
  {
    if (!this.buttonIcon) { return this }
    this.buttonIcon.setFrame(frame)
    return this
  }

  setText(fontKey: string, text: string, xPos = 0, yPos = 0)
  {
    if (!this.buttonText)
    {
      this.buttonText = this.scene.add.bitmapText(xPos, yPos, fontKey, text).setOrigin(0.5)
      this.addContent(this.buttonText)
      return this
    }
    this.buttonText.setPosition(xPos, yPos)
    this.buttonText.setFont(fontKey)
    this.buttonText.setText(text)
    return this
  }

  setContentDownY(downY: number)
  {
    this.contentDownY = downY
    return this
  }

  setDisplayDelay(delayTime = 1600)
  {
    this.displayButton(false)
    this.scene.time.delayedCall(delayTime, () => { this.displayButton(true) })
    return this
  }

  private addContent(content: GuiContent)
  {
    this.buttonContent.push(content)
    this.add(content)
    this.scene.add.existing(this)
  }

  private shiftContentDown(shouldShift: boolean)
  {
    if (!this.buttonContent.length) { return this }
    if (!shouldShift)
    {
      this.buttonContent.forEach( element => element.setY(element.y - this.contentDownY))
      return this
    }
    this.buttonContent.forEach( element => element.setY(element.y + this.contentDownY))
    return this
  }

  private tintButton(color: number)
  {
    this.buttonBase.setTint(color)
    if (!this.buttonContent.length) { return this }
    this.buttonContent.forEach( element => element.setTint(color))
    return this
  }

  private broadcast()
  {
    this.observers.forEach(subscriber => subscriber())
  }

	private handleUp()
	{
		this.handleOver()
    this.shiftContentDown(false)
	}

	private handleOut()
	{
    this.buttonBase.setFrame(this.texture.upFrame)
	}

	private handleDown()
	{
    this.buttonBase.setFrame(this.texture.downFrame)
    this.broadcast()
    this.shiftContentDown(true)
	}

	private handleOver()
	{
    this.buttonBase.setFrame(this.texture.overFrame)
	}
}
