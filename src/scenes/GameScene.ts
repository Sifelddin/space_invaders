import Phaser from 'phaser';
import SceneAnimation, { AnimationType } from '~/components/Animation';
import Barrier from '~/components/Barrier';
import { EnemyInfo } from '~/constants/Enemies';
import ManageBullet from '~/components/ManageBullet';
import { stones, TextStyles } from '~/constants/GameKeys';
import { explosionSound, saucerSound, shootSound, move } from '~/sounds/sounds';
import { initDataProp } from '~/types/types';
import SoundVolumeManager from '~/components/ManageSoundVolume';
import EnemiesManager from '~/components/EnemiesManager';

export default class GameScene extends Phaser.Scene {
  enemyFireInterval = 3000;
  enemyMoveVelo = 1000;
  saucerInterval = 22000;
  level = 1;
  enemyInfo = { ...EnemyInfo };
  volumeAvrage = 1;
  score = 0;
  lives = 3;
  xTimes = 0;
  yTimes = 0;
  direction = 'right';
  isStarted = false;
  barriers: Barrier[] = [];
  enemyBulletVelo = 200;
  intervalIndex: number[] = [];
  timeoutIndex: number[] = [];
  saucers: SpriteWithDynamicBodyInterface[] = [];
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  keyQ?: Phaser.Input.Keyboard.Key;
  keyD?: Phaser.Input.Keyboard.Key;
  keyM?: Phaser.Input.Keyboard.Key;
  keyL?: Phaser.Input.Keyboard.Key;

  shootedBullets = 0;
  canShootNum = 1;
  soundOn = true;
  enimies?: Phaser.Physics.Arcade.StaticGroup;
  explosions?: Phaser.Physics.Arcade.StaticGroup;
  volumeBars?: Phaser.GameObjects.Rectangle[] = [];
  playerLava?: Phaser.GameObjects.Rectangle;
  enemyLava?: Phaser.GameObjects.Rectangle;
  saucerLava?: Phaser.GameObjects.Rectangle;
  shooter?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  scoreText?: Phaser.GameObjects.Text;
  livesText?: Phaser.GameObjects.Text;
  startText?: Phaser.GameObjects.Text;
  background?: Phaser.GameObjects.TileSprite;
  explosion?: Phaser.GameObjects.Sprite;
  shipBulletVelo = -400;
  bonusShip?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  volumeImg?: Phaser.GameObjects.Image;
  bulletsIntervales: number[] = [];

  constructor() {
    super('GameScene');
  }

  init(data: initDataProp) {
    if (data.message === 'restart') {
      location.reload();
    }
  }
  preload() {
    this.load.image('space', 'assets/space4.png');
    this.load.image('green', 'assets/green-alien.png');
    this.load.image('yellow', 'assets/yellow-alien.png');
    this.load.image('blue', 'assets/blue-alien.png');
    this.load.image('red', 'assets/red-alien.png');
    this.load.image('saucer-bullet', 'assets/saucer_bullet.png');
    this.load.image('green-bullet', 'assets/green_bullet.png');
    this.load.image('red-bullet', 'assets/red_bullet.png');
    this.load.image('yellow-bullet', 'assets/yellow_bullet.png');
    this.load.image('blue-bullet', 'assets/blue_bullet.png');
    this.load.image('ship-bullet', 'assets/bullet.png');
    this.load.image('saucer', 'assets/saucer.png');
    this.load.image('volume', 'assets/volume.png');
    this.load.image('volume-off', 'assets/volume-off.png');
    this.load.spritesheet('ship', 'assets/vaisseau.png', {
      frameWidth: 52,
      frameHeight: 66,
    });
    for (let i = 0; i < stones.length; i++) {
      this.load.spritesheet(`${stones[i]}`, `assets/stones/${stones[i]}.png`, {
        frameWidth: 38,
        frameHeight: 38,
      });
    }
    this.load.spritesheet('explosion', 'assets/explosion.png', {
      frameWidth: 63,
    });
  }
  create() {
    this.background = this.add.tileSprite(400, 300, 0, 0, 'space');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
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
    this.shooter = this.physics.add.sprite(400, 560, 'ship', 0);
    this.shooter.setCollideWorldBounds(true);
    this.shooter.play(AnimationType.FLY);
    this.scoreText = this.add.text(16, 16, 'Score: ' + this.score, TextStyles);
    this.volumeImg = this.add.image(
      25,
      40,
      this.soundOn ? 'volume' : 'volume-off',
    );
    this.livesText = this.add.text(
      696,
      16,
      ['Lives: ' + this.lives, `Level: ${this.level}`],
      { ...TextStyles, align: 'start' },
    );
    this.startText = this.add
      .text(400, 300, 'Click to Play or press Enter', TextStyles)
      .setOrigin(0.5);
    this.input.keyboard.on('keydown-SPACE', this.shoot, this);

    this.barriers.push(new Barrier(this, 90, 430));
    this.barriers.push(new Barrier(this, 370, 430));
    this.barriers.push(new Barrier(this, 640, 430));

    this.input.on('pointerdown', this.pauseAndStart, this);
    this.input.keyboard.on('keydown-ENTER', this.pauseAndStart, this);
    new EnemiesManager(this).initEnemies();
  }

  update() {
    if (this.background) {
      this.background.tilePositionY -= 1;
    }
    if (this.isStarted == true) {
      if (this.cursors?.left.isDown || this.keyQ?.isDown) {
        this.shooter?.setVelocityX(-160);
        if (this.bonusShip) {
          this.bonusShip?.setVelocityX(-160);
        }
      } else if (this.cursors?.right.isDown || this.keyD?.isDown) {
        this.shooter?.setVelocityX(160);
        if (this.bonusShip) {
          this.bonusShip?.setVelocityX(160);
        }
      } else {
        this.shooter?.setVelocityX(0);
        if (this.bonusShip) {
          this.bonusShip?.setVelocityX(0);
        }
      }
    }
    if (
      this.keyM?.isDown ||
      this.keyL?.isDown ||
      this.cursors?.up.isDown ||
      this.cursors?.down.isDown
    ) {
      new SoundVolumeManager(this);
    }
  }
  // create enemies
  pause() {
    this.scene.pause();
  }
  pauseAndStart() {
    this.isStarted = !this.isStarted;
    if (this.isStarted) {
      this.startText?.destroy();
      let saucerIn = setInterval(() => this.makeSaucer(), this.saucerInterval);
      let enemyIn = setInterval(
        () => this.moveEnimies(enemyIn),
        this.enemyMoveVelo,
      );
      let fireIn = setInterval(() => this.enemyFire(), this.enemyFireInterval);
      let destroyIn = setInterval(() => {
        this.saucers.map((saucer, i) => {
          saucer.isDestroyed
            ? this.saucers.splice(i, 1)
            : new ManageBullet(this).manageEnemyBullet(
                this.physics.add.sprite(saucer.x, saucer.y, 'saucer-bullet'),
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
  // change the enemies position x y
  moveEnimies(interval: number) {
    let yTimes = this.yTimes;
    move.play();

    if (this.xTimes === 20) {
      this.enemiesMoveToBottom();
      this.yTimes++;
      if (this.direction === 'right') {
        this.direction = 'left';
        this.xTimes = 0;
      } else {
        this.direction = 'right';
        this.xTimes = 0;
      }
    }
    if (this.direction === 'right') {
      this.enimies?.children.each((enemy) => {
        // @ts-ignore
        enemy.x += 10;
      });
      this.xTimes++;
    } else {
      this.enimies?.children.each((enemy) => {
        // @ts-ignore
        enemy.x -= 10;
      });
      this.xTimes++;
    }
    if (yTimes + 1 === this.yTimes && this.yTimes >= 3) {
      clearInterval(interval);
      if (this.enemyMoveVelo > 500) {
        this.enemyMoveVelo -= 100;
      }
      let index = setInterval(
        () => this.moveEnimies(index),
        this.enemyMoveVelo,
      );
      this.intervalIndex.push(index);
    }
  }
  enemyFire() {
    let enemy =
      this.enimies?.children.entries[
        Phaser.Math.Between(0, this.enimies.children.entries.length - 1)
      ];

    enemy &&
      new ManageBullet(this).manageEnemyBullet(
        // @ts-ignore
        this.physics.add.sprite(
          // @ts-ignore
          enemy.x,
          // @ts-ignore
          enemy.y,
          // @ts-ignore
          enemy.texture.key === 'red'
            ? 'red-bullet'
            : // @ts-ignore
            enemy.texture.key === 'yellow'
            ? 'yellow-bullet'
            : // @ts-ignore
            enemy.texture.key === 'blue'
            ? 'blue-bullet'
            : 'green-bullet',
        ),
        enemy,
      );
  }

  shoot() {
    if (this.isStarted == true) {
      if (this.shootedBullets < this.canShootNum && this.shooter) {
        new ManageBullet(this).manageShipBullet(
          this.physics.add.sprite(
            this.shooter.x,
            this.shooter.y,
            'ship-bullet',
          ),
        );
        this.bonusShip &&
          new ManageBullet(this).manageShipBullet(
            this.physics.add.sprite(
              this.bonusShip.x,
              this.bonusShip.y,
              'ship-bullet',
            ),
          );

        this.shootedBullets++;
        shootSound.play();
      }
    }
  }

  checkOverlap(
    spriteA: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    spriteB: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    let boundsA = spriteA.getBounds();
    let boundsB = spriteB.getBounds();

    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
  }
  end() {
    explosionSound.stop();
    saucerSound.stop();
    shootSound.stop();
    move.stop();
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
  nextLevel(indexIntervale: number) {
    if (this.enimies?.children.entries.length === 0) {
      this.end();
      this.level++;
      this.intervalIndex.map((inter) => clearInterval(inter));
      clearInterval(indexIntervale);
      this.timeoutIndex.map((timeout) => clearTimeout(timeout));
      this.bulletsIntervales.map((i) => clearInterval(i));
      this.enemyMoveVelo = 1000;
      if (this.enemyFireInterval > 2000) {
        this.enemyFireInterval -= 50;
      }
      if (this.saucerInterval > 10000) {
        this.saucerInterval -= 100;
      }
      this.direction = 'right';
      this.lives++;
      this.shipBulletVelo = -400;
      this.shootedBullets = 0;
      this.intervalIndex = [];
      this.bulletsIntervales = [];
      this.timeoutIndex = [];
      this.saucers = [];
      this.bonusShip?.destroy();
      this.bonusShip = undefined;
      this.isStarted = false;
      this.yTimes = 0;
      this.xTimes = 0;
      this.barriers = [];
      this.enemyBulletVelo -= 80;
      this.scene.start('GameLevelScene', {
        level: this.level,
      });
    }
  }
  enemiesMoveToBottom() {
    this.enimies?.children.each((enemy) => {
      // @ts-ignore
      enemy.y += 15;
    });
  }
}
