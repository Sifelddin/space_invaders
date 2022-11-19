import { EnemyInfo } from '~/constants/Enemies';
import GameScene from '~/scenes/GameScene';

export default class EnemiesManager {
  enemyInfo = { ...EnemyInfo };

  game: GameScene;
  constructor(game: GameScene) {
    this.game = game;
  }
  initEnemies() {
    let randomCol = Phaser.Math.Between(0, 8);
    let randomRow = Phaser.Math.Between(0, 4);
    let randomEnemy = Phaser.Math.Between(0, 2);
    let enemies = ['red', 'yellow', 'blue'];
    for (let c = 0; c < this.enemyInfo.count.col; c++) {
      for (let r = 0; r < this.enemyInfo.count.row; r++) {
        let enemyX =
          c * (this.enemyInfo.width + this.enemyInfo.padding) +
          this.enemyInfo.offset.left;
        let enemyY =
          r * (this.enemyInfo.height + this.enemyInfo.padding) +
          this.enemyInfo.offset.top;
        if (this.game.level % 3 === 0 && this.game.level < 10) {
          this.game.enimies?.create(
            enemyX,
            enemyY,
            c === randomCol ? enemies[randomEnemy] : 'green',
          );
        } else if (this.game.level % 2 === 0 && this.game.level < 10) {
          this.game.enimies?.create(
            enemyX,
            enemyY,
            r === randomRow ? enemies[randomEnemy] : 'green',
          );
        } else {
          this.enemiesLevelManager(enemyX, enemyY);
        }
      }
    }
    this.AddFaculty();
  }

  enemiesLevelManager(enemyX: number, enemyY: number) {
    let list = [...this.randomEnemiesList()];

    if (this.game.level > 1) {
      this.game.level < 19
        ? list.splice(list.length - this.game.level, this.game.level)
        : list.splice(list.length - 19, 19);
      console.log(list);

      this.game.enimies?.create(
        enemyX,
        enemyY,
        this.randomEnemiesList()[Phaser.Math.Between(0, list.length - 1)],
      );
    } else {
      this.game.enimies?.create(enemyX, enemyY, 'green');
    }
  }
  randomEnemiesList() {
    let enemies = ['red', 'yellow', 'blue'];
    for (let i = 0; i < 20; i++) {
      enemies.push('green');
    }
    return enemies;
  }

  AddFaculty() {
    this.game.enimies?.children.each((enemy) => {
      // @ts-ignore
      if (enemy.texture.key === 'green' || enemy.texture.key === 'yellow') {
        // @ts-ignore
        enemy.health = 1;
      } else {
        // @ts-ignore
        enemy.health = 2;
      }
      // @ts-ignore
      if (enemy.texture.key === 'yellow' || enemy.texture.key === 'red') {
        // @ts-ignore
        enemy.bulletVelo = 100;
      } else {
        // @ts-ignore
        enemy.bulletVelo = 0;
      }
    });
  }
}
