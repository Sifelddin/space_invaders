import Phaser from 'phaser';
import SceneAnimation, { AnimationType } from '~/components/Animation';
import Barrier from '~/components/Barrier';
import { EnemyInfo } from '~/components/Enemies';
import { TextStyles } from '~/constants/GameKeys';
import { explosionSound, saucerSound, shootSound, move } from '~/sounds/sounds';

export default class GameScene extends Phaser.Scene {
  enemyInfo = { ...EnemyInfo };
  score = 0;
  lives = 3;
  xTimes = 0;
  direction = 'right';
  isStarted = false;
  barriers: Barrier[] = [];
  ufoCount = 0;
  animation?: SceneAnimation;
  enemyBulletVelo = 200;
  intervalIndex: number[] = [];
  saucers: SpriteWithDynamicBodyInterface[] = [];
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  keyQ?: Phaser.Input.Keyboard.Key;
  keyD?: Phaser.Input.Keyboard.Key;
  isShooting = false;
  enimies?: Phaser.Physics.Arcade.StaticGroup;
  explosions?: Phaser.Physics.Arcade.StaticGroup;
  playerLava?: Phaser.GameObjects.Rectangle;
  enemyLava?: Phaser.GameObjects.Rectangle;
  saucerLava?: Phaser.GameObjects.Rectangle;
  shooter?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  scoreText?: Phaser.GameObjects.Text;
  livesText?: Phaser.GameObjects.Text;
  startText?: Phaser.GameObjects.Text;
  background?: Phaser.GameObjects.TileSprite;
  explosion?: Phaser.GameObjects.Sprite;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('space', 'assets/space4.png');
    this.load.image('alien', 'assets/alien.png');
    this.load.image('enemy-bullet', 'assets/enemy_bullet.png');
    this.load.image('ship-bullet', 'assets/bullet.png');
    this.load.image('saucer', 'assets/saucer.png');
    this.load.spritesheet('ship', 'assets/vaisseau.png', {
      frameWidth: 75,
      frameHeight: 68,
    });
    this.load.spritesheet('explosion', 'assets/explosion.png', {
      frameWidth: 63,
    });
    this.load.spritesheet('stone', 'assets/space_stone.png', {
      frameWidth: 40,
      frameHeight: 30,
    });
  }
  create() {
    this.background = this.add.tileSprite(400, 300, 0, 0, 'space');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.input.keyboard.addCapture('SPACE');
    this.enimies = this.physics.add.staticGroup();
    this.explosions = this.physics.add.staticGroup();
    this.playerLava = this.add.rectangle(0, 0, 800, 10, 0x00).setOrigin(0);
    this.enemyLava = this.add.rectangle(0, 590, 800, 10, 0x000).setOrigin(0);
    this.saucerLava = this.add.rectangle(790, 0, 10, 600, 0x000).setOrigin(0);
    this.physics.add.existing(this.playerLava);
    this.physics.add.existing(this.enemyLava);
    this.physics.add.existing(this.saucerLava);
    new SceneAnimation(this);

    this.shooter = this.physics.add.sprite(400, 560, 'ship');
    this.shooter.setCollideWorldBounds(true);
    this.shooter.play(AnimationType.FLY);
    this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, TextStyles);
    this.livesText = this.add.text(696, 16, 'Lives: ' + this.lives, TextStyles);
    this.startText = this.add
      .text(400, 300, 'Click to Play or press Enter', TextStyles)
      .setOrigin(0.5);
    this.input.keyboard.on('keydown-SPACE', this.shoot, this);
    this.barriers.push(new Barrier(this, 90, 450));
    this.barriers.push(new Barrier(this, 370, 450));
    this.barriers.push(new Barrier(this, 650, 450));

    this.input.on('pointerdown', this.pauseAndStart, this);
    this.input.keyboard.on('keydown-ENTER', this.pauseAndStart, this);

    this.initEnemys();
  }

  update() {
    if (this.background) {
      this.background.tilePositionY -= 1;
    }
    if (this.isStarted == true) {
      if (
        (this.cursors && this.cursors.left.isDown) ||
        (this.keyQ && this.keyQ.isDown)
      ) {
        this.shooter && this.shooter.setVelocityX(-160);
      } else if (
        (this.cursors && this.cursors.right.isDown) ||
        (this.keyD && this.keyD.isDown)
      ) {
        this.shooter && this.shooter.setVelocityX(160);
      } else {
        this.shooter && this.shooter.setVelocityX(0);
      }
    }
  }
  initEnemys() {
    for (let c = 0; c < this.enemyInfo.count.col; c++) {
      for (let r = 0; r < this.enemyInfo.count.row; r++) {
        let enemyX =
          c * (this.enemyInfo.width + this.enemyInfo.padding) +
          this.enemyInfo.offset.left;
        let enemyY =
          r * (this.enemyInfo.height + this.enemyInfo.padding) +
          this.enemyInfo.offset.top;
        this.enimies &&
          this.enimies.create(enemyX, enemyY, 'alien').setOrigin(0.5);
      }
    }
  }

  pauseAndStart() {
    this.isStarted = !this.isStarted;
    if (this.isStarted) {
      this.startText?.destroy();
      let saucerIn = setInterval(() => this.makeSaucer(), 15000);
      let enemyIn = setInterval(() => this.moveEnimies(), 1000);
      let fireIn = setInterval(() => this.enemyFire(), 3000);
      let destroyIn = setInterval(() => {
        this.saucers.map((saucer, i) => {
          saucer.isDestroyed
            ? this.saucers.splice(i, 1)
            : this.manageEnemyBullet(
                this.physics.add.sprite(saucer.x, saucer.y, 'enemy-bullet'),
                saucer,
              );
        });
      }, 2000);
      this.intervalIndex = [saucerIn, enemyIn, fireIn, destroyIn];
    } else {
      this.startText = this.add
        .text(400, 300, 'Click to Play or press Enter', TextStyles)
        .setOrigin(0.5);
      saucerSound.stop();
      move.stop();
      this.intervalIndex.map((index) => clearInterval(index));
      this.intervalIndex = [];
    }
  }
  //
  moveEnimies() {
    move.play();
    if (this.xTimes === 20) {
      if (this.direction === 'right') {
        this.direction = 'left';
        this.xTimes = 0;
      } else {
        this.direction = 'right';
        this.xTimes = 0;
      }
    }
    if (this.direction === 'right') {
      this.enimies &&
        this.enimies.children.each((enemy) => {
          enemy.x = enemy.x + 10;
        });

      this.xTimes++;
    } else {
      this.enimies &&
        this.enimies.children.each((enemy) => {
          enemy.x = enemy.x - 10;
        });
      this.xTimes++;
    }
  }
  enemyFire() {
    let enemy =
      this.enimies &&
      this.enimies.children.entries[
        Phaser.Math.Between(0, this.enimies.children.entries.length - 1)
      ];

    enemy &&
      this.manageEnemyBullet(
        this.physics.add.sprite(enemy.x, enemy.y, 'enemy-bullet'),
        enemy,
      );
  }

  shoot() {
    if (this.isStarted == true) {
      if (this.isShooting === false && this.shooter) {
        this.manageBullet(
          this.physics.add.sprite(
            this.shooter.x,
            this.shooter.y,
            'ship-bullet',
          ),
        );
        this.isShooting = true;
        shootSound.play();
      }
    }
  }
  manageBullet(bullet: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    bullet.setVelocityY(-400);
    const i = setInterval(() => {
      console.log(this.ufoCount);
      this.enimies &&
        this.enimies.children.each((enemy) => {
          if (
            this.checkOverlap(
              bullet,
              enemy as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
            )
          ) {
            bullet.destroy();
            enemy.destroy();
            this.isShooting = false;
            this.explosions
              ?.create(enemy.x, enemy.y, 'explosion')
              .play(AnimationType.EXPLOSION)
              .on('animationcomplete', () => {
                this.explosions?.children.each((child) => child.destroy());
              });
            clearInterval(i);
            this.score++;
            this.scoreText && this.scoreText.setText('Score: ' + this.score);
            explosionSound.play();
            if (
              this.score - this.ufoCount ===
              this.enemyInfo.count.col * this.enemyInfo.count.row
            ) {
              this.end('Win');
            }
          }
        }, this);

      this.barriers.map((barrier) => {
        if (barrier.checkCollision(bullet)) {
          bullet.destroy();
          clearInterval(i);
          this.isShooting = false;
          this.scoreText && this.scoreText.setText('Score: ' + this.score);
          explosionSound.play();
          if (
            this.score - this.ufoCount ===
            this.enemyInfo.count.col * this.enemyInfo.count.row
          ) {
            this.end('Win');
          }
        }
      });

      this.saucers.map((saucer) => {
        if (this.checkOverlap(bullet, saucer)) {
          bullet.destroy();
          this.isShooting = false;
          saucer.destroy();
          this.explosion = this.physics.add
            .sprite(saucer.x, saucer.y, 'explosion')
            .play(AnimationType.EXPLOSION);
          this.explosion.on('animationcomplete', () => {
            this.explosion?.destroy();
          });
          clearInterval(i);
          saucer.isDestroyed = true;
          saucerSound.stop();
          this.score++;
          this.ufoCount++;
          explosionSound.play();
          this.scoreText && this.scoreText.setText('Score: ' + this.score);
          if (
            this.score - this.ufoCount ===
            this.enemyInfo.count.col * this.enemyInfo.count.row
          ) {
            this.end('Win');
          }
        }
      });
    }, 10);

    this.playerLava &&
      this.physics.add.overlap(bullet, this.playerLava, () => {
        bullet.destroy();
        clearInterval(i);
        explosionSound.play();
        this.isShooting = false;
      });
  }
  manageEnemyBullet(
    bullet: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    enemy: Phaser.GameObjects.GameObject,
  ) {
    let angle =
      this.shooter &&
      Phaser.Math.Angle.BetweenPoints(
        enemy as Phaser.Types.Math.Vector2Like,
        this.shooter,
      );
    angle &&
      this.physics.velocityFromRotation(
        angle,
        this.enemyBulletVelo,
        bullet.body.velocity,
      );
    this.enemyBulletVelo = this.enemyBulletVelo + 2;
    let i = setInterval(() => {
      if (this.shooter && this.checkOverlap(bullet, this.shooter)) {
        bullet.destroy();
        clearInterval(i);
        this.lives--;
        this.livesText && this.livesText.setText('Lives: ' + this.lives);
        explosionSound.play();

        if (this.lives == 0) {
          this.end('Lose');
        }
      }
      this.barriers.map((barrier) => {
        if (barrier.checkCollision(bullet)) {
          bullet.destroy();
          clearInterval(i);
          this.isShooting = false;
          this.scoreText && this.scoreText.setText('Score: ' + this.score);
          explosionSound.play();
          if (
            this.score ===
            this.enemyInfo.count.col * this.enemyInfo.count.row
          ) {
            this.end('Win');
          }
        }
      });
    }, 10);
    this.enemyLava &&
      this.physics.add.overlap(bullet, this.enemyLava, () => {
        bullet.destroy();
        explosionSound.play();
        clearInterval(i);
      });
  }
  checkOverlap(
    spriteA: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    spriteB: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    let boundsA = spriteA.getBounds();
    let boundsB = spriteB.getBounds();

    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
  }
  end(con: string) {
    explosionSound.stop();
    saucerSound.stop();
    shootSound.stop();
    move.stop();

    alert(`You ${con}! Score: ` + this.score);
    location.reload();
  }
  makeSaucer() {
    if (this.isStarted == true) {
      this.manageSaucer(
        this.physics.add.sprite(
          0,
          60,
          'saucer',
        ) as SpriteWithDynamicBodyInterface,
      );
    }
  }
  manageSaucer(saucer: SpriteWithDynamicBodyInterface) {
    this.saucers.push(saucer);
    saucer.isDestroyed = false;
    saucer.setVelocityX(100);
    this.saucerLava &&
      this.physics.add.overlap(saucer, this.saucerLava, () => {
        saucer.destroy();
        saucer.isDestroyed = true;
        saucerSound.stop();
      });

    saucerSound.play();
  }
}
