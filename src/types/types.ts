import Phaser from 'phaser';

export interface SpriteWithDynamicBodyInterface
  extends Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
  isDestroyed: boolean;
}
