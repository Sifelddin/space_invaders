import GameScene from '~/scenes/GameScene';
import { explosionSound, move, saucerSound, shootSound } from '~/sounds/sounds';

export default class SoundVolumeManager {
  game: GameScene;
  constructor(gameScene: GameScene) {
    this.game = gameScene;
    this.keysEventListeners();
  }

  keysEventListeners() {
    if (this.game.cursors?.up.isDown && this.game.volumeAvrage < 10) {
      let volumeBar = this.VolumeBar(this.game.volumeAvrage);
      this.game.volumeBars?.push(volumeBar);
      this.adjustSound(this.game.volumeAvrage);
      if (this.game.volumeImg?.texture.key === 'volume-off') {
        this.game.soundOn = true;
        this.game.volumeImg?.destroy();
        this.game.volumeImg = this.game.add.image(25, 40, 'volume');
      }
      this.game.volumeAvrage++;
    }
    if (this.game.cursors?.down.isDown && this.game.volumeAvrage > 0) {
      this.game.volumeBars?.pop()?.destroy();
      this.adjustSound(this.game.volumeAvrage);
      this.game.volumeAvrage--;
    }
    if (this.game.keyM?.isDown && this.game.soundOn) {
      this.game.soundOn = false;
      this.game.volumeAvrage = 0;
      this.game.volumeImg?.destroy();
      this.game.volumeImg = this.game.add.image(25, 40, 'volume-off');
      this.game.volumeBars?.map((bar) => bar.destroy());
      this.game.volumeBars = [];
      this.adjustSound(this.game.volumeAvrage);
    }
    if (this.game.keyL?.isDown && !this.game.soundOn) {
      this.game.soundOn = true;
      this.game.volumeAvrage = 5;
      this.game.volumeImg?.destroy();
      this.game.volumeImg = this.game.add.image(25, 40, 'volume');
      let i = 0;
      while (i < this.game.volumeAvrage) {
        let volumeBar = this.VolumeBar(i);
        this.game.volumeBars?.push(volumeBar);
        i++;
      }
      this.adjustSound(this.game.volumeAvrage);
    }
  }

  adjustSound(volumeAvrage: number) {
    move.volume(volumeAvrage / 10);
    explosionSound.volume(volumeAvrage / 10);
    saucerSound.volume(volumeAvrage / 100);
    shootSound.volume(volumeAvrage / 10);
  }
  VolumeBar(volumeAvrage: number) {
    return this.game.physics.add.existing(
      this.game.add
        .rectangle(35 + volumeAvrage * 5, 45, 2, 1 + volumeAvrage, 0xffffff)
        .setOrigin(0.5, 1),
    );
  }
}
