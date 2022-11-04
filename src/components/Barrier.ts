import GameScene from '~/scenes/GameScene';

export default class Barrier {
  children: SpriteWithDynamicBodyInterface[] = [];
  x = 0;
  y = 0;
  scene?: GameScene;
  child?: SpriteWithDynamicBodyInterface;
  constructor(scene: GameScene, gx: number, y: number) {
    this.x = gx;
    this.y = y;
    this.scene = scene;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        this.child = scene.physics.add.sprite(
          this.x,
          this.y,
          'stone',
        ) as SpriteWithDynamicBodyInterface;
        this.child.health = 2;
        this.children.push(this.child);
        this.x += this.child.displayWidth;
      }
      this.x = gx;
      if (this.child) {
        this.y += this.child.displayHeight;
      }
    }

    this.children[this.children.length - 2].destroy();
    this.children.splice(this.children.length - 2, 1);
  }
  checkCollision(sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
    let isTouching = false;
    this.children.map((child, i) => {
      if (this.scene && this.scene.checkOverlap(sprite, child)) {
        isTouching = true;
        if (child.health === 1) {
          child.destroy();
          this.children.splice(i, 1);
        } else {
          child.health = 1;
        }
      }
    });
    return isTouching;
  }
}
