import Phaser from 'phaser';
import SceneAnimation, { AnimationType } from '~/components/Animation';
import Barrier from '~/components/Barrier';
import { EnemyInfo } from '~/constants/Enemies';
import ManageBullet from '~/components/ManageBullet';
import { TextStyles } from '~/constants/GameKeys';
import { explosionSound, saucerSound, shootSound, move } from '~/sounds/sounds';
import { initDataProp } from '~/types/types';
import SoundVolumeManager from '~/components/ManageSoundVolume';

export default class GameScene extends Phaser.Scene {
  enemyMoveVelo = 1000;
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
    this.load.image('alien', 'assets/alien.png');
    this.load.image('alien2', 'assets/alien2.png');
    this.load.image('enemy-bullet', 'assets/enemy_bullet.png');
    this.load.image('ship-bullet', 'assets/bullet.png');
    this.load.image('saucer', 'assets/saucer.png');
    this.load.image('volume', 'assets/volume.png');
    this.load.image('volume-off', 'assets/volume-off.png');
    this.load.spritesheet('ship', 'assets/vaisseau.png', {
      frameWidth: 52,
      frameHeight: 66,
    });
    this.load.spritesheet('explosion', 'assets/explosion.png', {
      frameWidth: 63,
    });
    this.load.spritesheet('stone', 'assets/space_stone.png', {
      frameWidth: 38,
      frameHeight: 28,
    });
  }
  create() {
    console.log('scene', this.scene.scene);

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
    this.volumeImg = this.add.image(25, 40, 'volume');
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
    if (this.level !== 3) {
      this.barriers.push(new Barrier(this, 90, 450));
      this.barriers.push(new Barrier(this, 370, 450));
      this.barriers.push(new Barrier(this, 650, 450));
    }

    this.input.on('pointerdown', this.pauseAndStart, this);
    this.input.keyboard.on('keydown-ENTER', this.pauseAndStart, this);
    this.initEnemys();
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
      console.log('test');

      new SoundVolumeManager(this);
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

        switch (this.level) {
          case 2:
            this.enimies
              ?.create(enemyX, enemyY, r === 0 ? 'alien2' : 'alien')
              .setOrigin(0.5);
            break;
          case 3:
            this.enimies
              ?.create(enemyX, enemyY, r === 0 || r === 1 ? 'alien2' : 'alien')
              .setOrigin(0.5);
            break;
          default:
            this.enimies?.create(enemyX, enemyY, 'alien').setOrigin(0.5);
        }
      }
    }
    this.enimies?.children.each((enemy) =>
      // @ts-ignore
      enemy.texture.key === 'alien' ? (enemy.health = 1) : (enemy.health = 2),
    );
  }

  pauseAndStart() {
    this.isStarted = !this.isStarted;
    if (this.isStarted) {
      this.startText?.destroy();
      let saucerIn = setInterval(() => this.makeSaucer(), 20000);
      let enemyIn = setInterval(
        () => this.moveEnimies(enemyIn),
        this.enemyMoveVelo,
      );
      let fireIn = setInterval(() => this.enemyFire(), 3000);
      let destroyIn = setInterval(() => {
        this.saucers.map((saucer, i) => {
          saucer.isDestroyed
            ? this.saucers.splice(i, 1)
            : new ManageBullet(this).manageEnemyBullet(
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
        this.physics.add.sprite(enemy.x, enemy.y, 'enemy-bullet'),
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
    console.log(this.scene.scene);

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
      if (this.level > 3) {
        this.scene.start('WinnerScene', { score: this.score });
      }
      this.enemyMoveVelo = 1000;
      this.direction = 'right';
      this.lives++;
      this.intervalIndex = [];
      this.bulletsIntervales = [];
      this.timeoutIndex = [];
      this.bonusShip?.destroy();
      this.bonusShip = undefined;
      this.isStarted = false;
      this.yTimes = 0;
      this.xTimes = 0;
      this.barriers = [];
      this.enemyBulletVelo -= 100;
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
