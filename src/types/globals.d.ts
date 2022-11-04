declare type GuiContent =
  | Phaser.GameObjects.Image
  | Phaser.GameObjects.Sprite
  | Phaser.GameObjects.BitmapText;

declare type ObserverCallback = () => void;

declare interface SpriteWithDynamicBodyInterface
  extends Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
  isDestroyed: boolean;
  health: number;
}

declare interface RectangleInterface extends Phaser.GameObjects.Rectangle {
  health?: number;
}

declare interface GameObjectInterface extends Phaser.GameObjects.GameObject {
  x: number;
  y: number;
}
