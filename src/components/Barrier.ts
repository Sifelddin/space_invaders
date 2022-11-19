import { stones } from '~/constants/GameKeys';
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
    let randomRow = scene.level > 1 ? Phaser.Math.Between(1, 3) : 3;
    let randomِCol = scene.level > 1 ? Phaser.Math.Between(1, 3) : 3;
    //let rows = scene.level === 2 ? 2 : 3;
    for (let r = 0; r < randomRow; r++) {
      for (let c = 0; c < randomِCol; c++) {
        this.child = scene.physics.add.sprite(
          this.x,
          this.y,
          stones[Phaser.Math.Between(0, stones.length - 1)],
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
    if (scene.level === 1) {
      this.children[this.children.length - 2].destroy();
      this.children.splice(this.children.length - 2, 1);
    }
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
