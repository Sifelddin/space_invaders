export enum AnimationType {
  FLY = 'fly',
  EXPLOSION = 'explosion',
}

export default class SceneAnimation {
  constructor(private scene: Phaser.Scene) {
    this.init();
  }
  init() {
    this.scene.anims.create({
      key: AnimationType.FLY,
      frames: this.scene.anims.generateFrameNumbers('ship', {
        start: 1,
        end: 0,
      }),
      frameRate: 40,
      repeat: -1,
    });

    this.scene.anims.create({
      key: AnimationType.EXPLOSION,
      frames: this.scene.anims.generateFrameNumbers('explosion', {
        start: 1,
        end: -1,
      }),
      frameRate: 40,
      repeat: 0,
    });
  }
}
