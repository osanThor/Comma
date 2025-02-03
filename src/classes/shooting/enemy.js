import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  ENEMY_BOX_PADDING,
  ENEMY_SPEED,
} from "@/constants/shooting";

export class Enemy {
  static enemyList = [];
  static isGameOver = false;

  constructor(
    generateRandomValue
    // stop,
    // stopAllMusic,
    // emits,
    // score,
    // currentTime
  ) {
    this.x = generateRandomValue(
      ENEMY_BOX_PADDING,
      CANVAS_WIDTH - ENEMY_WIDTH - ENEMY_BOX_PADDING
    );
    this.y = 0;
    // this.stop = stop;
    // this.stopAllMusic = stopAllMusic;
    // this.emits = emits;
    // this.score = score;
    // this.currentTime = currentTime;

    Enemy.enemyList.push(this);
  }

  async update() {
    this.y += ENEMY_SPEED;

    if (this.y >= CANVAS_HEIGHT - ENEMY_HEIGHT) {
      Enemy.isGameOver = true;
      // this.stop();
      // this.stopAllMusic();
      // this.emits("open-game-over", this.score, this.currentTime);
    }
  }
}
