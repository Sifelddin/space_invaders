import Phaser from 'phaser'
import Viewport from '../../constants/DisplayKeys'
import { IModal } from '../../types/IModal'
import Tweens from '../../effects/tweens'

export default class Modal extends Phaser.GameObjects.Container implements IModal
{
	scene: Phaser.Scene
	private panelTexture: string
	private shouldDisplay: boolean
	private positions: { hiddenX: number, hiddenY: number, openX: number, openY: number }
	// private backdrop: Phaser.GameObjects.Sprite
	private basePanel: Phaser.GameObjects.Sprite

	get isOpen()
	{
		return !this.shouldDisplay
	}

	constructor(scene: Phaser.Scene, panelKey: string, hideOnStart: boolean)
	{
    super(scene)
    this.scene = scene
		this.panelTexture = panelKey
		this.shouldDisplay = hideOnStart
		this.positions = { hiddenX: 0, hiddenY: Viewport.HEIGHT * 2, openX: 0, openY: 0 }
	//	this.backdrop = this.scene.add.sprite(Viewport.CENTER.x, Viewport.CENTER.y, this.).setOrigin(0.5)
		this.basePanel = this.scene.add.sprite(Viewport.CENTER.x, Viewport.CENTER.y, this.panelTexture).setOrigin(0.5)
		this.addModalToScene()
	}

 	addContentToModal(content: GuiContent | GuiContent[])
  {
	  this.add(content)
		this.scene.add.existing(this)
	  return this
  }

	setPositions(hiddenX: number, hiddenY: number, openX: number, openY: number)
	{
		this.positions = { hiddenX: hiddenX, hiddenY: hiddenY, openX: openX, openY: openY }
		return this
	}

	setPanelTexture(panelKey: string)
	{
		this.panelTexture = panelKey
		return this
	}

	toggleModal()
	{
		if (this.shouldDisplay)
		{
			this.handleModalEnter()
			this.shouldDisplay = false
			return
		}
		this.handleModalExit()
		this.shouldDisplay = true
		return
	}

	private addModalToScene()
	{
		this.add(this.basePanel)
		this.scene.add.existing(this)
		this.setPosition(this.positions.hiddenX, this.positions.hiddenY)
		this.toggleModal()
	}

	private handleModalExit()
	{
		Tweens.slideToPosition(this.scene, this, this.positions.hiddenX, this.positions.hiddenY)
		// this.backdrop.setVisible(false)
		this.shouldDisplay = true
	}

	private handleModalEnter()
	{
		Tweens.slideToPosition(this.scene, this, this.positions.openX, this.positions.openY)
		// this.backdrop.setVisible(true)
		this.shouldDisplay = false
	}
}
