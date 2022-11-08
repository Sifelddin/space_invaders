import { TextStyles } from '~/constants/GameKeys';
import { initDataProp } from '~/types/types';

export default class GameLevelScene extends Phaser.Scene {
  background?: Phaser.GameObjects.TileSprite;
  startText?: Phaser.GameObjects.Text;
  level? = 0;

  constructor() {
    super('GameLevelScene');
  }
  init(data: initDataProp) {
    this.level = data.level;
  }
  preload() {
    this.load.image('space', 'assets/space4.png');
  }
  create() {
    this.background = this.add.tileSprite(400, 300, 0, 0, 'space');
    this.startText = this.add
      .text(400, 300, `Level ${this.level}`, {
        fontSize: '2rem',
        color: '#FFF',
      })
      .setOrigin(0.5);
    setTimeout(() => {
      this.scene.start('GameScene');
    }, 6000);
  }
  update() {
    if (this.background) {
      this.background.tilePositionY -= 1;
    }
  }
}
