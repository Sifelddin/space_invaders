import Phaser from 'phaser'
import { PhysicsConfig, RenderConfig, ScaleConfig } from './constants/ConfigKeys'

import Preload from './scenes/load/Preload'
import Loading from './scenes/load/Loading'
import TitleScene from './scenes/gui/TitleScene'
import DemoScene from './scenes/game/DemoScene'
import HudScene from './scenes/gui/HudScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: ScaleConfig,
  render: RenderConfig,
	physics: PhysicsConfig.DEBUG,
  dom: {
    createContainer: true,
  },
  // plugins: {},
  scene: [ Preload, Loading, TitleScene, DemoScene, HudScene ]
}

export default new Phaser.Game(config)
