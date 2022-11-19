import GameScene from '~/scenes/GameScene';
import { AnimationType } from './Animation';
import { BonusType } from '~/constants/GameKeys';
export default class Bonus {
  bonusList = [
    BonusType.LIVE,
    BonusType.DOUBLE_BULLET,
    BonusType.FAST_BULLET,
    BonusType.RETREAT_ENEMY,
    BonusType.SHOOTER,
    BonusType.SLOW_ENEMY_BULLET,
    BonusType.SlOW_ENEMY,
  ];
  bonus = '';
  game: GameScene;
  constructor(gameScene: GameScene) {
    this.game = gameScene;
    this.manageBonus();
  }

  manageBonus() {
    this.bonus =
      this.bonusList[Phaser.Math.Between(0, this.bonusList.length - 1)];
    switch (this.bonus) {
      case BonusType.LIVE:
        this.game.lives++;
        this.game.livesText?.setText([
          'Lives: ' + this.game.lives,
          `Level: ${this.game.level}`,
        ]);
        break;
      case BonusType.SlOW_ENEMY:
        this.game.enemyMoveVelo += 200;
        break;
      case BonusType.SLOW_ENEMY_BULLET:
        this.game.enemyBulletVelo -= 30;
        break;
      case BonusType.RETREAT_ENEMY:
        if (
          // @ts-ignore
          !this.game.enimies?.children.entries.some((enemy) => enemy.y < 130)
        ) {
          this.game.enimies?.children.each((enemy) => {
            // @ts-ignore
            enemy.y -= 30;
          });
        } else {
          this.game.enimies?.children.each((enemy) => {
            // @ts-ignore
            enemy.y -= 15;
          });
        }

        break;
      case BonusType.FAST_BULLET:
        this.game.shipBulletVelo = -600;
        let i = setTimeout(() => {
          this.game.shipBulletVelo = -400;
          clearTimeout(i);
        }, 15000);
        this.game.timeoutIndex.push(i);
        break;
      case BonusType.DOUBLE_BULLET:
        this.game.canShootNum++;
        let f = setTimeout(() => {
          this.game.canShootNum--;
          clearTimeout(f);
        }, 15000);
        break;
      case BonusType.SHOOTER:
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
