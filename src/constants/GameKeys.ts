export const TextStyles: Phaser.Types.GameObjects.Text.TextStyle = {
  align: 'center',
  fontSize: '18px',
  color: '#FFF',
};

export const stones = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'];

export enum BonusType {
  LIVE = 'live',
  DOUBLE_BULLET = 'double bullet',
  SlOW_ENEMY = 'slow enemy',
  FAST_BULLET = 'fast bullet',
  RETREAT_ENEMY = 'enemy retreat',
  SHOOTER = 'shooter',
  SLOW_ENEMY_BULLET = 'bullet enemy slow',
}
