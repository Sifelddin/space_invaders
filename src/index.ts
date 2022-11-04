import Phaser from 'phaser';
import { PhysicsConfig, ScaleConfig } from './constants/ConfigKeys';
import GameScene from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: ScaleConfig,
  // render: RenderConfig,
  physics: PhysicsConfig.GAME,
  dom: {
    createContainer: true,
  },
  // plugins: {},
  scene: [GameScene],
};

export default new Phaser.Game(config);
