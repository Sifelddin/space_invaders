import { Howl } from 'howler';

export const move = new Howl({
  src: ['assets/move.mp3'],
  volume: 0.1,
});
export const shootSound = new Howl({
  src: ['assets/shoot.mp3'],
  volume: 0.1,
});

export const explosionSound = new Howl({
  src: ['assets/explosion.mp3'],
  volume: 0.1,
});

export const saucerSound = new Howl({
  src: ['assets/saucer.mp3'],
  loop: true,
  volume: 0.01,
});
