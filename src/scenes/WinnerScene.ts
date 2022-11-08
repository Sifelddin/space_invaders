import { TextStyles } from '~/constants/GameKeys';
import { initDataProp } from '~/types/types';

export default class WinnerScene extends Phaser.Scene {
  background?: Phaser.GameObjects.TileSprite;
  startText?: Phaser.GameObjects.Text;
  score? = 0;
  constructor() {
    super('WinnerScene');
  }
  init(data: initDataProp) {
    this.score = data.score || 0;
  }
  preload() {
    this.load.image('space', 'assets/space4.png');
  }
  create() {
    this.background = this.add.tileSprite(400, 300, 0, 0, 'space');
    this.startText = this.add
      .text(
        400,
        300,
        [
          'Congratulation! ',
          '',
          `score: ${this.score}`,
          '',
          'Click to Play or press Enter to Restart',
        ],
        {
          fontSize: '1.2rem',
          color: '#FFF',
        },
      )
      .setOrigin(0.5);
    this.input.on('pointerdown', this.restart, this);
    this.input.keyboard.on('keydown-ENTER', this.restart, this);
  }
  update() {
    if (this.background) {
      this.background.tilePositionY -= 1;
    }
  }
  restart() {
    this.scene.start('GameScene', { message: 'restart' });
  }
}
