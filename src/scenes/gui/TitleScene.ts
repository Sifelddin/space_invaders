import Phaser from 'phaser'
import Viewport from '~/constants/DisplayKeys'

import SceneKeys from '~/constants/SceneKeys'
import TextureKeys from '~/constants/TextureKeys'
import FontKeys from '~/constants/FontKeys'

import CameraControls from '../../effects/CameraControls'

import { addRepeatingColumns } from '~/utils/GraphicUtils'
import { openExternalWindow } from '~/utils/PageUtils'

import Button from '../../entities/gui/Button'
import Modal from '../../entities/gui/Modal'

export default class TitleScene extends Phaser.Scene
{
	constructor()
	{
		super(SceneKeys.TITLE_SCENE)
	}

  init()
  {
		this.anims.createFromAseprite(TextureKeys.START_PROMPT)
  }

  preload()
  {

  }

	create()
	{
		addRepeatingColumns(this)

		const testModal = new Modal(this, TextureKeys.DIALOGUE_PANEL, false)

		const socialButton = new Button(
			this, 24, 24, TextureKeys.BUTTON_WHITE_FRAME, 'indigo-square-up','indigo-square-over','indigo-square-down'
		).setIcon(TextureKeys.SYSTEM_ICONS, 'info')

		socialButton.subscribe(() => {
			testModal.toggleModal()
		//	openExternalWindow('https://emhuo.itch.io/')
		})
		this.add.bitmapText(Viewport.CENTER.x, Viewport.HEIGHT * 0.4, FontKeys.BOLD_PLASTIC, 'Phaser Project Starter').setOrigin(0.5)
		this.add.sprite(Viewport.CENTER.x, Viewport.HEIGHT * 0.75, TextureKeys.START_PROMPT).setOrigin(0.5)
			.play({ key: 'pink-button', frameRate: 6, repeat: -1, repeatDelay: 800 })

		this.input.keyboard.once('keydown-ENTER', () => {
			CameraControls.FADE_OUT(this, SceneKeys.DEMO_SCENE)
		})
	}
}
