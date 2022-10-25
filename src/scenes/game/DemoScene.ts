import Phaser from 'phaser'
import Viewport from '~/constants/DisplayKeys'

import SceneKeys from '~/constants/SceneKeys'
import TextureKeys from '~/constants/TextureKeys'
import FontKeys from '~/constants/FontKeys'

import { addDitherGradient } from '../../utils/GraphicUtils'
import RepeatingBackground from '../../entities/background/RepeatingBackground'

export default class DemoScene extends Phaser.Scene
{
	constructor()
	{
		super(SceneKeys.DEMO_SCENE)
	}

  init()
  {
		this.scene.launch(SceneKeys.HUD_SCENE)
  }

  preload()
  {

  }

	create()
	{
		addDitherGradient(this)
		new RepeatingBackground(this, TextureKeys.PAW_TILE)
	}
}
