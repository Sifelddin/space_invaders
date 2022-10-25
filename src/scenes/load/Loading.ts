import Phaser from 'phaser'

import SceneKeys from '~/constants/SceneKeys'
import Viewport from '~/constants/DisplayKeys'

import Tweens from '../../effects/tweens'
import { addGradientOverlay } from '../../utils/GraphicUtils'

export default class Loading extends Phaser.Scene
{
	constructor()
	{
		super(SceneKeys.LOADING)
	}

	create()
	{
		addGradientOverlay(this)
    Tweens.playLoadingEllipses(this)
	}
}
