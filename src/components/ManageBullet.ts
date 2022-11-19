import { TextStyles } from '~/constants/GameKeys';
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
          clearInterval(i);
          if (this.game.shootedBullets > 0) {
            this.game.shootedBullets--;
          }
          // @ts-ignore-
          if (enemy.health === 1) {
            enemy.destroy();
            this.createExplosions(enemy);
            // @ts-ignore
            enemy.texture.key === 'green'
              ? this.game.score++
              : (this.game.score += 2);
          } else {
            // @ts-ignore
            enemy.health = 1;
          }
          this.game.scoreText?.setText('Score: ' + this.game.score);
          explosionSound.play();
          this.game.nextLevel(i);
          return;
        }
      });

      this.game.barriers.map((barrier) => {
        if (barrier.checkCollision(bullet)) {
          bullet.destroy();
          clearInterval(i);
          if (this.game.shootedBullets > 0) {
            this.game.shootedBullets--;
          }
          this.game.scoreText?.setText('Score: ' + this.game.score);
          explosionSound.play();
          this.game.nextLevel(i);
          return;
        }
      });

      this.game.saucers.map((saucer) => {
        if (this.game.checkOverlap(bullet, saucer)) {
          bullet.destroy();
          clearInterval(i);
          saucer.destroy();
          if (this.game.shootedBullets > 0) {
            this.game.shootedBullets--;
          }
          this.createExplosions(saucer);
          explosionSound.play();
          saucerSound.stop();
          saucer.isDestroyed = true;
          this.game.score += 5;
          let bonus = new Bonus(this.game);
          let bonusText = this.game.add.text(saucer.x, saucer.y, bonus.bonus, {
            fontSize: '12px',
            color: 'rgb(254, 246, 216)',
          });
          setTimeout(() => bonusText.destroy(), 1500);
          this.game.scoreText?.setText('Score: ' + this.game.score);
          this.game.nextLevel(i);
          return;
        }
      });
    }, 10);
    this.game.bulletsIntervales.push(i);
    this.game.playerLava &&
      this.game.physics.add.overlap(bullet, this.game.playerLava, () => {
        bullet.destroy();
        clearInterval(i);
        if (this.game.shootedBullets > 0) {
          this.game.shootedBullets--;
        }
        explosionSound.play();
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
        // @ts-ignore
        enemy.bulletVelo
          ? // @ts-ignore
            this.game.enemyBulletVelo + enemy.bulletVelo
          : this.game.enemyBulletVelo,
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
        if (this.game.lives === 0) {
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

  createExplosions(enemy: Phaser.GameObjects.GameObject) {
    this.game.explosions
      // @ts-ignore
      ?.create(enemy.x, enemy.y, 'explosion')
      .play(AnimationType.EXPLOSION);
    this.game.explosions?.children.each((explosion) =>
      explosion.on('animationcomplete', () => {
        explosion.destroy();
      }),
    );
  }
}
