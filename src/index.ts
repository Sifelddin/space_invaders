import Phaser from 'phaser';
import { PhysicsConfig, ScaleConfig } from './constants/ConfigKeys';
import GameLevelScene from './scenes/GameLevelScene';
import GameOverScene from './scenes/GameOverScene';
import GameScene from './scenes/GameScene';
import WinnerScene from './scenes/winnerScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: ScaleConfig,
  // render: RenderConfig,
  physics: PhysicsConfig.GAME,
  dom: {
    createContainer: true,
  },
  // plugins: {},
  scene: [GameScene, GameOverScene, GameLevelScene, WinnerScene],
};

export default new Phaser.Game(config);
