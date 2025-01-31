<script setup>
import { reactive, computed, onMounted, ref } from "vue";
import { useTimer } from "@/hooks/useTimer.js";

const { currentTime, start, stop, reset } = useTimer();
const account = reactive({
  score: 0,
  level: 0,
  lines: 0,
});

const isPlaying = ref(false);
const isGameOver = ref(false);
const time = ref(null);

const emits = defineEmits(["open-game-over"]);

const rows = 16;
const cols = 24;
const mineCount = 30;
const cells = reactive(
  Array.from({ length: rows * cols }, () => ({
    mine: false,
    revealed: false,
    flagged: false,
    adjacentMines: 0,
    isHovered: false,
  }))
);

const gridStyle = computed(() => ({
  gridTemplateRows: `repeat(${rows}, 1fr)`,
  gridTemplateColumns: `repeat(${cols}, 1fr)`,
}));

function resetGame() {
  reset();
  isPlaying.value = false;
  isGameOver.value = false;
  time.value = {
    start: performance.now(),
    elapsed: 0,
  };
  cells.splice(
    0,
    cells.length,
    ...Array.from({ length: rows * cols }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacentMines: 0,
      isHovered: false,
    }))
  );
  placeMines();
  calculateAdjacentMines();
}

function placeMines() {
  let placedMines = 0;
  while (placedMines < mineCount) {
    const index = Math.floor(Math.random() * (rows * cols));
    const row = Math.floor(index / cols);
    const col = index % cols;
    if (
      !cells[index].mine &&
      row >= 0 &&
      row < rows &&
      col >= 0 &&
      col < cols
    ) {
      cells[index].mine = true;
      placedMines++;
    }
  }
}

function validateMines() {
  cells.forEach((cell, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    if (row < 0 || row >= rows || col < 0 || col >= cols) {
      cell.mine = false;
    }
  });
}

function revealAllMines() {
  isGameOver.value = true;

  const mineCells = cells
    .map((cell, index) => ({ cell, index }))
    .filter(({ cell }) => cell.mine);
  mineCells.forEach(({ cell, index }, i) => {
    setTimeout(() => {
      cell.revealed = true;
    }, (2000 / mineCells.length) * i);
  });
}

function calculateAdjacentMines() {
  const directions = [
    -1,
    1,
    -cols,
    cols,
    -cols - 1,
    -cols + 1,
    cols - 1,
    cols + 1,
  ];
  cells.forEach((cell, index) => {
    if (cell.mine) return;
    let count = 0;
    directions.forEach((dir) => {
      const neighborIndex = index + dir;
      const neighborRow = Math.floor(neighborIndex / cols);
      const currentRow = Math.floor(index / cols);
      const neighborCol = neighborIndex % cols;
      const currentCol = index % cols;
      if (
        neighborIndex >= 0 &&
        neighborIndex < rows * cols &&
        Math.abs(neighborRow - currentRow) <= 1 &&
        Math.abs(neighborCol - currentCol) <= 1 &&
        cells[neighborIndex]?.mine
      ) {
        count++;
      }
    });
    cell.adjacentMines = count;
  });
}

function revealCell(index) {
  if (isGameOver.value || cells[index].flagged) return;
  if (!isPlaying.value) {
    start();
    isPlaying.value = true;
  }

  const cell = cells[index];
  cell.revealed = true;

  if (cell.mine) {
    isPlaying.value = false;
    stop();
    revealAllMines();
    console.log(
      account.score,
      currentTime.value,
      formatTime(currentTime.value)
    );
    setTimeout(() => emits("open-game-over"), 3000);
    return;
  }

  if (cell.adjacentMines === 0) {
    revealAdjacentCells(index);
  }
}

function revealAdjacentCells(index) {
  const directions = [
    -1,
    1,
    -cols,
    cols,
    -cols - 1,
    -cols + 1,
    cols - 1,
    cols + 1,
  ];
  directions.forEach((dir) => {
    const neighborIndex = index + dir;
    if (neighborIndex >= 0 && neighborIndex < rows * cols) {
      const neighbor = cells[neighborIndex];
      if (!neighbor.revealed && !neighbor.mine) {
        revealCell(neighborIndex);
      }
    }
  });
}

function toggleFlag(index) {
  if (isGameOver.value || cells[index].revealed) return;
  cells[index].flagged = !cells[index].flagged;
  checkVictory();
}

function checkVictory() {
  const allMinesFlagged = cells.every((cell) =>
    cell.mine ? cell.flagged : true
  );
  if (allMinesFlagged) {
    stop();
    alert("Victory!");
    account.score = 100000 - currentTime.value;
    console.log(
      account.score,
      currentTime.value,
      formatTime(currentTime.value)
    );
    setTimeout(() => emits("open-game-over"), 2000);
  }
}

function onHoverCell(index) {
  cells[index].isHovered = true;
}

function onLeaveCell(index) {
  cells[index].isHovered = false;
}

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

onMounted(() => {
  resetGame();
  validateMines();
});
</script>

<template>
  <div id="app" class="text-center mt-5">
    <h1 class="text-4xl font-bold mb-4 font-dnf text-point-500">
      COMMA Minesweeper
    </h1>
    <h2 class="text-white bg-point-500 border-2 text-right px-4 py-2">
      Play Time: <span id="time">{{ formatTime(currentTime) }}</span>
    </h2>

    <div class="grid mx-auto" :style="gridStyle">
      <div
        v-for="(cell, index) in cells"
        :key="index"
        :class="[
          'cell',
          {
            'bg-gray-200': cell.revealed && !cell.mine,
            'bg-red-400': cell.mine && cell.revealed,
            'bg-gray-400': !cell.revealed,
            'text-gray-800': cell.revealed && cell.adjacentMines > 0,
            'cursor-pointer': !cell.revealed,
            'cursor-default': cell.revealed,
            'bg-gray-700': cell.isHovered && !cell.revealed,
          },
        ]"
        @click="revealCell(index)"
        @contextmenu.prevent="toggleFlag(index)"
        @mouseover="onHoverCell(index)"
        @mouseleave="onLeaveCell(index)"
        class="flex items-center justify-center border border-gray-300"
      >
        <span v-if="cell.revealed && !cell.mine && cell.adjacentMines > 0">
          {{ cell.adjacentMines }}
        </span>
        <span v-if="cell.flagged && !cell.revealed">🚩</span>
        <span v-if="cell.mine && cell.revealed">💣</span>
      </div>
    </div>
    <button
      @click="play"
      class="mt-5 px-4 py-2 bg-point-500 text-white font-bold rounded-full hover:bg-point-600 mx-8"
    >
      PLAY
    </button>
    <button
      @click="resetGame"
      class="mt-5 px-4 py-2 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600"
    >
      Restart
    </button>
  </div>
</template>

<style>
.grid {
  display: grid;
  gap: 0rem;
  width: 30rem;
}
.cell {
  width: 100%;
  padding-top: 100%; /* This makes the cells square */
  position: relative;
  transition: background-color 0.2s ease;
}
.cell span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
