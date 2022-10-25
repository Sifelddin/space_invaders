import Viewport from './DisplayKeys'

enum ElementKeys
{
  GAME_CONTAINER = 'game-container',
  PAGE = 'page'
}

const PhysicsConfig = {
  GAME: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  DEBUG: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  }
}

const RenderConfig: Phaser.Types.Core.RenderConfig = {
  antialias: false,
  antialiasGL: false,
  pixelArt: true,
  roundPixels: true,
  // clearBeforeRender: false, /* clear canvas bt each frame; disable if have full-screen bg or obj */
  transparent: true
}

const ScaleConfig: Phaser.Types.Core.ScaleConfig = {
	parent: ElementKeys.GAME_CONTAINER,
  // expandParent: false,   /* Adjust CSS height property of parent and/or document body to 100% */
  width: Viewport.WIDTH,
  height: Viewport.HEIGHT,
  mode: Phaser.Scale.FIT,
  autoRound: true,
  autoCenter: Phaser.Scale.CENTER_BOTH
}

export {
  ElementKeys,
  PhysicsConfig,
  RenderConfig,
  ScaleConfig
}
