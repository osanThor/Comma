import {
  COLS,
  ROWS,
  BLOCK_SIZE,
  LINES_PER_LEVEL,
  COLORS,
  KEY,
  POINTS,
  LEVEL,
  ROTATION,
} from "@/constants/tetris.js";
import Piece from "./piece";

export default class Board {
  constructor(ctx, ctxNext) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
    this.init();
  }
  init() {
    // Calculate size of canvas from constants.
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;

    // Scale so we don't need to give size on every draw.
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  // 새 게임이 시작되면 보드를 초기화한다.
  reset() {
    this.grid = this.getEmptyGrid();
    this.piece = new Piece(this.ctx);
    this.piece.setStartingPosition();
    this.getNewPiece();
  }

  getNewPiece() {
    const { width, height } = this.ctxNext.canvas;
    this.next = new Piece(this.ctxNext);
    this.ctxNext.clearRect(0, 0, width, height);
    this.next.draw();
  }

  draw() {
    this.piece.draw();
    this.drawBoard();
  }

  drop(moves, account, time, pointsSound) {
    let p = moves[KEY.DOWN](this.piece);
    if (this.valid(p)) {
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines(account, time, pointsSound);
      if (this.piece.y === 0) {
        // Game over
        return false;
      }
      this.piece = this.next;
      this.piece.ctx = this.ctx;
      this.piece.setStartingPosition();
      this.getNewPiece();
    }
    return true;
  }
  clearLines(account, time, pointsSound) {
    let lines = 0;

    this.grid.forEach((row, y) => {
      // If every value is greater than zero then we have a full row.
      if (row.every((value) => value > 0)) {
        lines++;

        // Remove the row.
        this.grid.splice(y, 1);

        // Add zero filled row at the top.
        this.grid.unshift(Array(COLS).fill(0));
      }
    });

    if (lines > 0) {
      // Calculate points from cleared lines and level.

      account.score += this.getLinesClearedPoints(lines, account, pointsSound);
      account.lines += lines;

      // If we have reached the lines for next level
      if (account.lines >= LINES_PER_LEVEL) {
        // Goto next level
        account.level++;

        // Remove lines so we start working for the next level
        account.lines -= LINES_PER_LEVEL;

        // Increase speed of game
        time.value.level = LEVEL[account.level];
      }
    }
  }

  valid(p) {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (
          value === 0 || (this.isInsideWalls(x, y) && this.notOccupied(x, y))
        );
      });
    });
  }

  freeze() {
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          // ✨ 도형의 typeId를 저장하여 색상을 유지
          this.grid[y + this.piece.y][x + this.piece.x] = this.piece.typeId;
        }
      });
    });
  }

  drawBoard() {
    this.grid.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          // 0보다 크면 블록이 존재하는 것
          const px = x;
          const py = y;
          const blockSize = 1;
          const color = COLORS[value];
          if (!color) return;

          this.ctx.fillStyle = color;
          this.ctx.fillRect(px, py, blockSize, blockSize);

          this.ctx.strokeStyle = this.darkenColor(color, 50);
          this.ctx.lineWidth = 0.05;
          this.ctx.strokeRect(px, py, blockSize, blockSize);

          this.ctx.fillStyle = this.lightenColor(color, 70);
          this.ctx.fillRect(px, py, blockSize * 0.1, blockSize);
          this.ctx.fillStyle = this.lightenColor(color, 100);
          this.ctx.fillRect(px, py, blockSize, blockSize * 0.1);

          this.ctx.fillStyle = this.darkenColor(color, 50);
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

  // drawBoard() {
  //   this.grid.forEach((row, y) => {
  //     row.forEach((value, x) => {
  //       if (value > 0) {
  //         this.ctx.fillStyle = COLORS[value];
  //         this.ctx.fillRect(x, y, 1, 1);
  //       }
  //     });
  //   });
  // }

  // 0으로 채워진 행렬을 얻는다.
  getEmptyGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  isInsideWalls(x, y) {
    return x >= 0 && x < COLS && y <= ROWS;
  }

  notOccupied(x, y) {
    return this.grid[y] && this.grid[y][x] === 0;
  }

  rotate(piece, direction) {
    // Clone with JSON for immutability.
    let p = JSON.parse(JSON.stringify(piece));
    if (!piece.hardDropped) {
      // Transpose matrix
      for (let y = 0; y < p.shape.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
        }
      }
      // Reverse the order of the columns.
      if (direction === ROTATION.RIGHT) {
        p.shape.forEach((row) => row.reverse());
      } else if (direction === ROTATION.LEFT) {
        p.shape.reverse();
      }
    }

    return p;
  }
  getLinesClearedPoints(lines, account, pointsSound) {
    const lineClearPoints =
      lines === 1
        ? POINTS.SINGLE
        : lines === 2
        ? POINTS.DOUBLE
        : lines === 3
        ? POINTS.TRIPLE
        : lines === 4
        ? POINTS.TETRIS
        : 0;
    pointsSound.value.play();
    return (account.level + 1) * lineClearPoints;
  }
}
