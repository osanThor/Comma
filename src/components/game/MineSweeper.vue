<script setup>
import { reactive, computed, onMounted, ref, watch } from "vue";
import { useTimer } from "@/hooks/useTimer.js";

const { currentTime, start, stop, reset } = useTimer();
const account = reactive({
  score: 0,
  level: 0,
  lines: 0,
});

const isPlaying = ref(false);
const isGameOver = ref(false);
const remainTime = ref(600000); // 10 minutes in milliseconds
const isBlinking = ref(false); // 🚀 깜빡이는 상태 저장
const showVictory = ref(false);

let timeOut = null;

const emits = defineEmits(["open-game-over"]);

const rows = 16;
const cols = 24;
const mineCount = 10;
const flagCount = ref(mineCount);
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

// 깜빡이는 효과를 위한 watch
watch(currentTime, (newTime) => {
  const targetTime = remainTime.value - newTime;
  if (targetTime <= 10000) {
    isBlinking.value = true;
    if (targetTime <= 0) {
      stop();
      account.score = 0;
      isGameOver.value = true;
      emits("open-game-over", account.score, currentTime.value);
    }
  } else {
    isBlinking.value = false;
  }
});

function resetGame() {
  reset();
  isPlaying.value = false;
  isGameOver.value = false;
  flagCount.value = mineCount;
  if (timeOut) {
    clearTimeout(timeOut);
    timeOut = null;
  }

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

function toggleHover(index, hoverState) {
  cells[index].isHovered = hoverState;
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
  if (showVictory.value && !isPlaying.value) return;
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

    account.score = 0;
    timeOut = setTimeout(
      () => emits("open-game-over", account.score, currentTime.value),
      3000
    );
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

  if (!cells[index].flagged) {
    // 깃발 추가
    if (flagCount.value > 0) {
      cells[index].flagged = true;
      flagCount.value--;
    }
  } else {
    // 깃발 제거
    cells[index].flagged = false;
    flagCount.value++;
  }
  checkVictory();
}

function checkVictory() {
  const allMinesFlagged = cells.every((cell) =>
    cell.mine ? cell.flagged : true
  );

  if (allMinesFlagged) {
    isPlaying.value = false;
    stop();

    account.score = Math.round(remainTime.value - currentTime.value);
    // 🚀 Victory 애니메이션
    showVictory.value = true;

    timeOut = setTimeout(() => {
      showVictory.value = false;
      emits("open-game-over", account.score, currentTime.value);
    }, 3000);
  }
}

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000); // 총 초
  const minutes = Math.floor((totalSeconds % 3600) / 60); // 분
  const seconds = totalSeconds % 60; // 초
  const millis = Math.floor(milliseconds % 1000); // 밀리초

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}:${String(millis).padStart(3, "0")}`;
}

onMounted(() => {
  resetGame();
});
onUnmounted(() => {
  stop();
  if (timeOut) {
    clearTimeout(timeOut);
    timeOut = null;
  }
});
</script>

<template>
  <div
    class="w-full h-full bg-[url(/assets/images/bg/mineSweeper-bg.jpg)] bg-cover bg-center bg-no-repeat font-pixelNes flex flex-col items-center"
  >
    <div id="app" class="text-center mt-20 w-[calc(full-60px)]">
      <div class="flex justify-between">
        <span class="text-white items-start">
          TIME :
          <span :class="{ blinking: isBlinking }" id="time">{{
            formatTime(remainTime - currentTime)
          }}</span>
        </span>
        <span class="text-white text-right items-end"
          >🚩 : &nbsp{{ flagCount }}</span
        >
      </div>

      <div class="flex justify-center items-start mt-4 w-full">
        <!-- 게임 보드 -->
        <div class="grid-container">
          <!-- <div class="border-s">123123</div> -->
          <div class="grid" :style="gridStyle">
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
                  'bg-gray-600': cell.isHovered && !cell.revealed,
                },
              ]"
              @click="revealCell(index)"
              @contextmenu.prevent="toggleFlag(index)"
              @mouseover="toggleHover(index, true)"
              @mouseleave="toggleHover(index, false)"
              class="flex items-center justify-center border border-gray-300"
            >
              <span
                v-if="cell.revealed && !cell.mine && cell.adjacentMines > 0"
              >
                {{ cell.adjacentMines }}
              </span>
              <span v-if="cell.flagged && !cell.revealed">🚩</span>
              <span v-if="cell.mine && cell.revealed">💣</span>
            </div>
          </div>
        </div>

        <!-- 오른쪽 정보 박스 -->
      </div>

      <!-- Restart 버튼 -->
      <button
        @click="resetGame"
        class="mt-8 px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-700 font-pixelNes text-xl w-40"
      >
        RESTART
      </button>
    </div>

    <transition name="fade">
      <div v-if="showVictory" class="victory-message">🎉 Victory! 🎉</div>
    </transition>
  </div>
</template>

<style scoped>
/* Grid 컨테이너 */
.grid-container {
  display: flex;
  align-items: center;
}

.grid {
  display: grid;
  width: 40rem;
  height: 26rem;
}

.cell {
  width: 26px;
  height: 26px;
  position: relative;
  border-color: white;
}

.cell span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.blinking {
  animation: blink 1s infinite;
}

.victory-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  font-weight: bold;
  color: gold;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px 40px;
  border-radius: 10px;

  text-align: center;
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
