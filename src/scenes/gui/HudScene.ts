import Phaser from 'phaser'
import Viewport from '~/constants/DisplayKeys'

import SceneKeys from '~/constants/SceneKeys'
import TextureKeys from '~/constants/TextureKeys'
import FontKeys from '~/constants/FontKeys'

export default class HudScene extends Phaser.Scene
{
	constructor()
	{
		super(SceneKeys.HUD_SCENE)
	}

  init()
  {

  }

  preload()
  {

  }

	create()
	{
		this.add.bitmapText(Viewport.CENTER.x, Viewport.CENTER.y, FontKeys.CLEAN_PLATE, 'Demo Scene')
			.setOrigin(0.5)
		}
}
