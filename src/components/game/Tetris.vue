<script setup>
import {
  COLS,
  BLOCK_SIZE,
  ROWS,
  KEY,
  POINTS,
  LEVEL,
  ROTATION,
} from "@/constants/tetris.js";
import Board from "@/classes/tetris/board.js";
import Sound from "@/classes/tetris/sound.js";
import { useTimer } from "@/hooks/useTimer.js";
import { twMerge } from "tailwind-merge";

const emit = defineEmits(["open-game-over"]);

const { currentTime, start, stop, reset } = useTimer();

const account = reactive({
  score: 0,
  level: 0,
  lines: 0,
});

const isPlaying = ref(false);
const isPaused = ref(false);
const isGameOver = ref(false);

const requestId = ref(null);
const time = ref(null);

const ctx = ref(null);
const board = ref(null);
const moves = {
  [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: (p) => ({ ...p, x: p.x + 1 }),
  [KEY.DOWN]: (p) => ({ ...p, y: p.y + 1 }),
  [KEY.SPACE]: (p) => ({ ...p, y: p.y + 1 }),
  [KEY.UP]: (p) => board.value.rotate(p, ROTATION.RIGHT),
  [KEY.Q]: (p) => board.value.rotate(p, ROTATION.LEFT),
};

const sound = ref(null);
const backgroundSound = ref(null);
const movesSound = ref(null);
const dropSound = ref(null);
const pointsSound = ref(null);
const finishSound = ref(null);

function addEventListener() {
  document.removeEventListener("keydown", handleKeyPress);
  document.addEventListener("keydown", handleKeyPress);
}

function handleKeyPress(event) {
  if (event.keyCode === KEY.P) {
    pause();
  }
  if (event.keyCode === KEY.ESC) {
    gameOver();
  } else if (moves[event.keyCode]) {
    event.preventDefault();
    // Get new state
    let p = moves[event.keyCode](board.value.piece);
    if (event.keyCode === KEY.SPACE) {
      // Hard drop
      if (isPlaying.value) {
        dropSound.value.play();
      } else {
        return;
      }

      while (board.value.valid(p)) {
        account.score += POINTS.HARD_DROP;
        board.value.piece.move(p);
        p = moves[KEY.DOWN](board.value.piece);
      }
      board.value.piece.hardDrop();
    } else if (board.value.valid(p)) {
      if (isPlaying) {
        movesSound.value.play();
      }
      board.value.piece.move(p);
      if (event.keyCode === KEY.DOWN && isPlaying.value) {
        account.score += POINTS.SOFT_DROP;
      }
    }
  }
}
function resetGame() {
  account.score = 0;
  account.lines = 0;
  account.level = 0;
  board.value.reset();
  time.value = {
    start: performance.now(),
    elapsed: 0,
    level: LEVEL[account.level],
  };
}

const play = () => {
  addEventListener();
  if (!isPlaying.value && !isPaused.value) {
    resetGame();
    reset();
  }

  if (requestId.value) {
    cancelAnimationFrame(requestId.value);
  }

  animate();
  isPlaying.value = true;
  if (isPaused.value) isPaused.value = false;
  backgroundSound.value.play();
  start();
};

function animate(now = 0) {
  time.value.elapsed = now - time.value.start;
  if (time.value.elapsed > time.value.level) {
    time.value.start = now;
    if (!board.value.drop(moves, account, time, pointsSound)) {
      gameOver();
      return;
    }
  }

  // Clear board before drawing new state.
  ctx.value.clearRect(0, 0, ctx.value.canvas.width, ctx.value.canvas.height);

  board.value.draw();
  requestId.value = requestAnimationFrame(animate);
}

function gameOver() {
  cancelAnimationFrame(requestId.value);

  ctx.value.fillStyle = "black";
  ctx.value.fillRect(1.2, 3, 8, 1.2);
  ctx.value.font = "1px Pixel_NES";
  ctx.value.fillStyle = "red";
  ctx.value.fillText("GAME OVER", 1.8, 4);

  sound.value.pause();
  finishSound.value.play();
  stop();

  document.removeEventListener("keydown", handleKeyPress);

  isPlaying.value = false;
  isGameOver.value = true;
  emit("open-game-over", account.score, currentTime.value);
}

function pause() {
  if (!requestId || !requestId.value) {
    isPlaying.value = true;
    animate();
    backgroundSound.value.play();
    return;
  }

  cancelAnimationFrame(requestId.value);
  requestId.value = null;

  ctx.value.fillStyle = "rgb(29 23 63 / 0.8)";
  ctx.value.fillRect(0, 2.55, 10, 2.7);
  ctx.value.font = "1px Pixel_NES";
  ctx.value.fillStyle = "white";
  ctx.value.fillText("PAUSED", 2.7, 4.1);
  isPlaying.value = false;
  isPaused.value = true;
  sound.value.pause();
  stop();
}

const handleClickPlay = computed(() => (isPlaying.value ? pause() : play()));

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000); // 총 초
  const hours = Math.floor(totalSeconds / 3600); // 시간
  const minutes = Math.floor((totalSeconds % 3600) / 60); // 분
  const seconds = totalSeconds % 60; // 초
  const millis = Math.floor(milliseconds % 1000); // 밀리초

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}:${String(millis).padStart(3, "0")}`;
}

onMounted(() => {
  const canvas = document.getElementById("board");
  const ctxIns = canvas.getContext("2d");
  const canvasNext = document.getElementById("next");
  const ctxNext = canvasNext.getContext("2d");

  ctxIns.canvas.width = COLS * BLOCK_SIZE;
  ctxIns.canvas.height = ROWS * BLOCK_SIZE;
  ctxIns.scale(BLOCK_SIZE, BLOCK_SIZE);

  ctxNext.canvas.width = 4 * BLOCK_SIZE;
  ctxNext.canvas.height = 4 * BLOCK_SIZE;
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);

  const boardIns = new Board(ctxIns, ctxNext);
  ctx.value = ctxIns;
  board.value = boardIns;

  const soundEl = new Sound(document.querySelector("#sound-div"));
  (backgroundSound.value = soundEl.create(
    "/assets/sounds/Dungeon_Theme.mp3",
    "background_sound",
    true
  )),
    (movesSound.value = soundEl.create(
      "/assets/sounds/moves.mp3",
      "moves_sound"
    )),
    (dropSound.value = soundEl.create("/assets/sounds/drop.mp3", "drop_sound")),
    (pointsSound.value = soundEl.create(
      "/assets/sounds/points.mp3",
      "points_sound"
    )),
    (finishSound.value = soundEl.create(
      "/assets/sounds/finish.mp3",
      "finish_sound"
    ));
  soundEl.muteToggle();
  soundEl.soundSetting();
  sound.value = soundEl;
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyPress);
});
</script>
<template>
  <div
    class="w-full h-full bg-[url(/assets/images/bg/tetris-bg.jpg)] bg-cover bg-center bg-no-repeat py-4 px-10 font-pixelNes flex flex-col items-center gap-4"
  >
    <h2 class="font-pixelNes text-white text-3xl">TETRIS</h2>
    <div class="grid">
      <div class="left-column"></div>
      <div class="w-full flex flex-col items-center">
        <canvas
          id="board"
          class="game-board bg-main-500/50 backdrop-blur-sm"
        ></canvas>
      </div>
      <div class="right-column text-white">
        <div class="flex flex-col gap-3 text-xl pl-3">
          <p>
            Score:
            <span id="score" class="bg-main-500/80 p-1 rounded-lg">{{
              account.score
            }}</span>
          </p>
          <p>
            Lines:
            <span id="lines" class="bg-main-500/80 p-1 rounded-lg">{{
              account.lines
            }}</span>
          </p>
          <p>
            Level:
            <span id="level" class="bg-main-500/80 p-1 rounded-lg">{{
              account.level
            }}</span>
          </p>
          <p v-if="currentTime">
            PlayTime: <br />
            <span id="time" class="bg-main-500/80 p-1 rounded-lg">{{
              formatTime(currentTime)
            }}</span>
          </p>
          <div id="sound-div">
            <span class="sound-item" id="sound-speaker"></span>
            <span class="sound-item" id="sound-description"></span>
          </div>
          <canvas id="next" class="next"></canvas>
        </div>
        <div id="sound-div">
          <span class="sound-item" id="sound-speaker"></span>
          <span class="sound-item" id="sound-description"></span>
        </div>
        <button
          @click="handleClickPlay"
          :class="
            twMerge(
              'play-button text-white rounded-full bg-center bg-cover bg-no-repeat focus:outline-none',
              isPlaying
                ? 'bg-[url(/assets/images/game/tetris/pause.png)]'
                : 'bg-[url(/assets/images/game/tetris/play.png)]'
            )
          "
        >
          <span class="sr-only">play button</span>
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: 120px 400px 120px;
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
  border: solid 2px white;
  border-radius: 8px;
  box-shadow: 0 0 7px #fff, 0 0 10px #a5087d, 0 0 21px #a5087d;
}

.play-button {
  font-size: 16px;
  padding: 15px 1rem;
  height: 40px;
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
