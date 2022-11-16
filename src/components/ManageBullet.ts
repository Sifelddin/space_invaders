import GameScene from '~/scenes/GameScene';
import { explosionSound, saucerSound } from '~/sounds/sounds';
import { AnimationType } from './Animation';
import Bonus from './Bonus';

export default class ManageBullet {
  game: GameScene;
  constructor(gameScene: GameScene) {
    this.game = gameScene;
  }

  manageShipBullet(bullet: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    bullet.setVelocityY(this.game.shipBulletVelo);
    const i = setInterval(() => {
      this.game.enimies?.children.each((enemy) => {
        if (
          this.game.checkOverlap(
            bullet,
            enemy as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
          )
        ) {
          bullet.destroy();
          this.game.shootedBullets--;
          // @ts-ignore-
          if (enemy.health === 1) {
            enemy.destroy();
            this.game.explosions
              // @ts-ignore
              ?.create(enemy.x, enemy.y, 'explosion')
              .play(AnimationType.EXPLOSION)
              .on('animationcomplete', () => {
                this.game.explosions?.children.each((child) => child.destroy());
              });

            // @ts-ignore
            enemy.texture.key === 'alien'
              ? this.game.score++
              : (this.game.score += 2);
          } else {
            // @ts-ignore
            enemy.health = 1;
          }
          clearInterval(i);
          this.game.scoreText?.setText('Score: ' + this.game.score);
          explosionSound.play();
          this.game.nextLevel(i);
        }
      }, this);

      this.game.barriers.map((barrier) => {
        if (barrier.checkCollision(bullet)) {
          bullet.destroy();
          clearInterval(i);
          this.game.shootedBullets--;
          this.game.scoreText?.setText('Score: ' + this.game.score);
          explosionSound.play();
          this.game.nextLevel(i);
        }
      });

      this.game.saucers.map((saucer) => {
        if (this.game.checkOverlap(bullet, saucer)) {
          bullet.destroy();
          saucer.destroy();
          this.game.shootedBullets--;
          this.game.explosions
            ?.create(saucer.x, saucer.y, 'explosion')
            .play(AnimationType.EXPLOSION)
            .on('animationcomplete', () => {
              this.game.explosions?.children.each((child) => child.destroy());
            });

          clearInterval(i);
          saucer.isDestroyed = true;
          saucerSound.stop();
          this.game.score += 3;
          explosionSound.play();
          new Bonus(this.game);
          this.game.scoreText &&
            this.game.scoreText.setText('Score: ' + this.game.score);
          this.game.nextLevel(i);
        }
      });
    }, 10);
    this.game.bulletsIntervales.push(i);
    this.game.playerLava &&
      this.game.physics.add.overlap(bullet, this.game.playerLava, () => {
        bullet.destroy();
        clearInterval(i);
        explosionSound.play();
        this.game.shootedBullets--;
      });
  }

  manageEnemyBullet(
    bullet: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    enemy: Phaser.GameObjects.GameObject,
  ) {
    let angle =
      this.game.shooter &&
      Phaser.Math.Angle.BetweenPoints(
        enemy as Phaser.Types.Math.Vector2Like,
        this.game.shooter,
      );
    angle &&
      this.game.physics.velocityFromRotation(
        angle,
        this.game.enemyBulletVelo,
        bullet.body.velocity,
      );
    this.game.enemyBulletVelo += 2;
    let i = setInterval(() => {
      if (
        this.game.shooter &&
        this.game.checkOverlap(bullet, this.game.shooter)
      ) {
        bullet.destroy();
        clearInterval(i);
        this.game.lives--;
        this.game.livesText?.setText([
          'Lives: ' + this.game.lives,
          `Level: ${this.game.level}`,
        ]);
        explosionSound.play();
        if (this.game.lives == 0) {
          this.game.end();
          this.game.intervalIndex.map((inter) => clearInterval(inter));
          this.game.scene.start('GameOverScene', { score: this.game.score });
        }
      }
      if (
        this.game.bonusShip &&
        this.game.checkOverlap(bullet, this.game.bonusShip)
      ) {
        bullet.destroy();
        this.game.bonusShip.destroy();
        this.game.bonusShip = undefined;
        explosionSound.play();
        clearInterval(i);
      }
      this.game.barriers.map((barrier) => {
        if (barrier.checkCollision(bullet)) {
          bullet.destroy();
          clearInterval(i);
          // this.game.shootedBullets--;
          //  this.game.scoreText?.setText('Score: ' + this.game.score);
          explosionSound.play();
          this.game.nextLevel(i);
        }
      });
    }, 10);
    this.game.bulletsIntervales.push(i);
    this.game.enemyLava &&
      this.game.physics.add.overlap(bullet, this.game.enemyLava, () => {
        bullet.destroy();
        explosionSound.play();
        clearInterval(i);
      });
  }
}
