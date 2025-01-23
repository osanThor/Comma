<script setup>
import {
  COLS,
  BLOCK_SIZE,
  ROWS,
  NO_OF_HIGH_SCORES,
  KEY,
  POINTS,
  LEVEL,
  ROTATION,
} from "@/constants/tetris.js";
import Board from "@/classes/tetris/board.js";

const boardIns = ref(null);
// peice

// main
const play = () => {
  boardIns.value.reset();
};

onMounted(() => {
  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");
  const canvasNext = document.getElementById("next");
  const ctxNext = canvasNext.getContext("2d");

  ctx.canvas.width = COLS * BLOCK_SIZE;
  ctx.canvas.height = ROWS * BLOCK_SIZE;

  ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

  const board = new Board(ctx, ctxNext);
  boardIns.value = board;
});
</script>
<template>
  <div class="grid bg-white p-10 font-dnf">
    <canvas id="board" class="game-board"></canvas>
    <div class="right-column">
      <div>
        <h2 class="text-2xl mb-4">TETRIS</h2>
        <p>Score: <span id="score">0</span></p>
        <p>Lines: <span id="lines">0</span></p>
        <p>Level: <span id="level">0</span></p>
        <canvas id="next" class="next"></canvas>
      </div>
      <div id="sound-div">
        <span class="sound-item" id="sound-speaker"></span>
        <span class="sound-item" id="sound-description"></span>
      </div>
      <button
        @click="play"
        class="play-button text-white bg-point-500 rounded-full"
      >
        Play
      </button>
    </div>
  </div>
</template>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: 350px 120px;
}

.left-column {
  display: flex;
  flex-direction: column;
}

.right-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.game-board {
  border: solid 2px;
}

.play-button {
  font-size: 16px;
  padding: 15px 30px;
  cursor: pointer;
}

#pause-btn {
  display: none;
}

#sound-speaker {
  font-size: 30px;
}

.sound-item {
  cursor: pointer;
}
</style>
