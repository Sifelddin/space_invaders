import Phaser from 'phaser';

export interface SpriteWithDynamicBodyInterface
  extends Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
  isDestroyed: boolean;
}

export type initDataProp = {
  message?: string;
  score?: number;
  level?: number;
};
