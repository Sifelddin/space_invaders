import GameScene from '~/scenes/GameScene';
import { AnimationType } from './Animation';

export default class Bonus {
  bonusList = [
    //  'enemy-move-velo',
    'shoot-bullet-number',
    //  'shoot-bullet-velo',
    //  'enemy-bullet-velo',
    //  'enemy-y-position',
    //  'shooter-bonus',
    //  'ship-live',
  ];

  game: GameScene;
  constructor(gameScene: GameScene) {
    this.game = gameScene;
    this.manageBonus();
  }

  manageBonus() {
    let bonus =
      this.bonusList[Phaser.Math.Between(0, this.bonusList.length - 1)];
    console.log('manage Bonus : ' + bonus);
    switch (bonus) {
      case 'ship-live':
        this.game.lives++;
        this.game.livesText?.setText([
          'Lives: ' + this.game.lives,
          `Level: ${this.game.level}`,
        ]);
        break;
      case 'enemy-move-velo':
        this.game.enemyMoveVelo += 200;
        break;
      case 'enemy-bullet-velo':
        this.game.enemyBulletVelo -= 30;
        break;
      case 'enemy-y-position':
        this.game.enimies?.children.each((enemy) => {
          // @ts-ignore
          enemy.y -= 30;
        });
        break;
      case 'shoot-bullet-velo':
        this.game.shipBulletVelo = -600;
        let i = setTimeout(() => {
          this.game.shipBulletVelo = -400;
          clearTimeout(i);
        }, 15000);
        this.game.timeoutIndex.push(i);
        break;
      case 'shoot-bullet-number':
        this.game.canShootNum++;
        let f = setTimeout(() => {
          this.game.canShootNum--;
          clearTimeout(f);
        }, 15000);
        break;
      case 'shooter-bonus':
        this.game.bonusShip =
          this.game.shooter &&
          this.game.physics.add.sprite(
            this.game.shooter.x + 50,
            this.game.shooter.y,
            'ship',
            0,
          );
        this.game.bonusShip?.play(AnimationType.FLY);
        let j = setTimeout(() => {
          this.game.bonusShip?.destroy();
          this.game.bonusShip = undefined;
          clearTimeout(j);
        }, 15000);
        this.game.timeoutIndex.push(j);
        break;
      default:
        null;
    }
  }
}
