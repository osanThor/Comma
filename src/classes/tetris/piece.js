import { COLORS, SHAPES } from "@/constants/tetris.js";
export default class Piece {
  x;
  y;
  color;
  shape;
  ctx;

  constructor(ctx) {
    this.ctx = ctx;
    this.spawn();
  }

  spawn() {
    this.typeId = this.randomizeTetrominoType(COLORS.length - 1);
    this.shape = SHAPES[this.typeId];
    this.color = COLORS[this.typeId];
    this.x = 0;
    this.y = 0;
    this.hardDropped = false;
  }

  // draw() {
  //   this.ctx.fillStyle = this.color;
  //   this.shape.forEach((row, y) => {
  //     row.forEach((value, x) => {
  //       if (value > 0) {
  //         this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
  //       }
  //     });
  //   });
  // }
  draw() {
    this.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          const px = this.x + x;
          const py = this.y + y;
          const blockSize = 1;

          this.ctx.fillStyle = this.color;
          this.ctx.fillRect(px, py, blockSize, blockSize);

          this.ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
          this.ctx.shadowBlur = 4;
          this.ctx.shadowOffsetX = 2;
          this.ctx.shadowOffsetY = 2;

          this.ctx.fillStyle = this.lightenColor(this.color, 80);
          this.ctx.fillRect(px, py, blockSize * 0.1, blockSize);
          this.ctx.fillStyle = this.lightenColor(this.color, 100);
          this.ctx.fillRect(px, py, blockSize, blockSize * 0.1);

          this.ctx.fillStyle = this.darkenColor(this.color, 100);
          this.ctx.fillRect(
            px + blockSize * 0.9,
            py,
            blockSize * 0.1,
            blockSize
          );
          this.ctx.fillRect(
            px,
            py + blockSize * 0.9,
            blockSize,
            blockSize * 0.1
          );

          this.ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          this.ctx.fillRect(px, py, blockSize * 0.15, blockSize * 0.15);

          this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
          this.ctx.fillRect(
            px + blockSize * 0.85,
            py + blockSize * 0.85,
            blockSize * 0.15,
            blockSize * 0.15
          );
        }
      });
    });
  }

  lightenColor(color, percent) {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const r = (num >> 16) + amt;
    const g = ((num >> 8) & 0x00ff) + amt;
    const b = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (r < 255 ? r : 255) * 0x10000 +
      (g < 255 ? g : 255) * 0x100 +
      (b < 255 ? b : 255)
    )
      .toString(16)
      .slice(1)}`;
  }

  darkenColor(color, percent) {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const r = (num >> 16) - amt;
    const g = ((num >> 8) & 0x00ff) - amt;
    const b = (num & 0x0000ff) - amt;
    return `#${(
      0x1000000 +
      (r > 80 ? r : 80) * 0x10000 +
      (g > 80 ? g : 80) * 0x100 +
      (b > 80 ? b : 80)
    )
      .toString(16)
      .slice(1)}`;
  }

  move(p) {
    if (!this.hardDropped) {
      this.x = p.x;
      this.y = p.y;
    }
    this.shape = p.shape;
  }

  hardDrop() {
    this.hardDropped = true;
  }

  setStartingPosition() {
    this.x = this.typeId === 4 ? 4 : 3;
  }

  randomizeTetrominoType(noOfTypes) {
    return Math.floor(Math.random() * noOfTypes + 1);
  }
}
