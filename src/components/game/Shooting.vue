<script setup>
import { ref, onMounted } from "vue";
import { useTimer } from "@/hooks/useTimer.js";
import { useBackgroundMusic } from "@/classes/shooting/sound";
import { useRoute } from "vue-router";
import { Bullet } from "@/classes/shooting/bullet";
import { Enemy } from "@/classes/shooting/enemy";
import { formatPlayTime, generateRandomValue } from "@/classes/shooting/utils";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SPACESHIP_HEIGHT,
  SPACESHIP_INITIAL_X_OFFSET,
  ENEMY_GENERATION_INTERVALS,
  IMAGE_PATHS,
  SPACESHIP_WIDTH,
} from "@/constants/shooting";

const category = ref("");
const route = useRoute();

const emits = defineEmits(["open-game-over"]);
const canvas = ref(null);
let ctx;

let backgroundImage, spaceshipImage, bulletImage, enemyImage;
const score = ref(0);
const playButtonVisible = ref(true);

const spaceshipX = ref(0);
const spaceshipY = ref(0);

const keysDown = {};

const enemyIntervalId = ref(null);
const previousIntervalTime = ref(null);

const { currentTime, start, stop, reset } = useTimer();
const { playGameMusic, stopAllMusic, setMute } = useBackgroundMusic();

const isMuted = ref(false);

const requestId = ref(null);

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = IMAGE_PATHS.background;

  spaceshipImage = new Image();
  spaceshipImage.src = IMAGE_PATHS.spaceship;

  bulletImage = new Image();
  bulletImage.src = IMAGE_PATHS.bullet;

  enemyImage = new Image();
  enemyImage.src = IMAGE_PATHS.enemy;

  let imagesLoaded = 0;
  const totalImages = 2;

  backgroundImage.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
      renderInitialState();
    }
  };

  spaceshipImage.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
      renderInitialState();
    }
  };
}
function handleKeyDown(event) {
  keysDown[event.key] = true;
}

function handleKeyUp(event) {
  delete keysDown[event.key];
  if (event.key === " ") {
    createBullet();
  }
}

function setupKeyboardListener() {
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
}

function createBullet() {
  return new Bullet(spaceshipX.value, spaceshipY.value, Bullet.bulletList);
}

function createEnemy() {
  let intervalTime = ENEMY_GENERATION_INTERVALS.default;

  const updateEnemyInterval = () => {
    if (enemyIntervalId.value) {
      clearInterval(enemyIntervalId.value);
    }

    enemyIntervalId.value = setInterval(() => {
      new Enemy(generateRandomValue);
    }, intervalTime);
  };

  watch(score, (newScore) => {
    if (newScore >= 80) {
      intervalTime = ENEMY_GENERATION_INTERVALS.score80;
    } else if (newScore >= 60) {
      intervalTime = ENEMY_GENERATION_INTERVALS.score60;
    } else if (newScore >= 40) {
      intervalTime = ENEMY_GENERATION_INTERVALS.score40;
    } else if (newScore >= 30) {
      intervalTime = ENEMY_GENERATION_INTERVALS.score30;
    } else if (newScore >= 20) {
      intervalTime = ENEMY_GENERATION_INTERVALS.score20;
    } else {
      intervalTime = ENEMY_GENERATION_INTERVALS.default;
    }

    if (intervalTime !== previousIntervalTime.value) {
      previousIntervalTime.value = intervalTime;
      updateEnemyInterval();
    }
  });

  updateEnemyInterval();
}

function toggleMute() {
  isMuted.value = !isMuted.value;
  setMute(isMuted.value);
}

function update(deltaTime) {
  const spaceshipSpeed = 500; // 초당 200px 이동

  if ("ArrowRight" in keysDown) {
    spaceshipX.value += spaceshipSpeed * deltaTime; // deltaTime 적용
  }
  if ("ArrowLeft" in keysDown) {
    spaceshipX.value -= spaceshipSpeed * deltaTime;
  }

  // 화면 경계 체크
  if (spaceshipX.value <= 0) {
    spaceshipX.value = 0;
  }
  if (spaceshipX.value >= CANVAS_WIDTH - SPACESHIP_WIDTH) {
    spaceshipX.value = CANVAS_WIDTH - SPACESHIP_WIDTH;
  }

  // 총알 이동에 deltaTime 적용
  for (let bullet of Bullet.bulletList) {
    if (bullet.alive) {
      bullet.update(deltaTime);
      bullet.checkHit(Enemy.enemyList, score);
    }
  }

  // 적 이동에 deltaTime 적용
  for (let enemy of Enemy.enemyList) {
    enemy.update(deltaTime);
  }
}

function renderInitialState() {
  if (!ctx || !canvas.value) return;

  ctx.clearRect(0, 0, CANVAS_WIDTH, canvas.value.height);

  ctx.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, canvas.value.height);

  ctx.drawImage(
    spaceshipImage,
    CANVAS_WIDTH / 2 - SPACESHIP_WIDTH / 2,
    CANVAS_HEIGHT - SPACESHIP_HEIGHT
  );
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, canvas.value.height);
  ctx.drawImage(spaceshipImage, spaceshipX.value, spaceshipY.value);
  ctx.fillText(`PLAY TIME: ${formatPlayTime(currentTime.value)}`, 160, 20);
  ctx.fillText(`SCORE: ${score.value}`, 20, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px arial";

  for (let i = 0; i < Bullet.bulletList.length; i++) {
    if (Bullet.bulletList[i].alive) {
      ctx.drawImage(
        bulletImage,
        Bullet.bulletList[i].x,
        Bullet.bulletList[i].y
      );
    }
  }

  for (let i = 0; i < Enemy.enemyList.length; i++) {
    ctx.drawImage(enemyImage, Enemy.enemyList[i].x, Enemy.enemyList[i].y);
  }
}

let lastFrameTime = 0; // 이전 프레임의 시간 저장

function main(timestamp) {
  if (!lastFrameTime) lastFrameTime = timestamp;
  const deltaTime = (timestamp - lastFrameTime) / 1000; // 밀리초 → 초로 변환
  lastFrameTime = timestamp;

  if (!Enemy.isGameOver) {
    update(deltaTime);
    render();
    requestId.value = requestAnimationFrame(main);
  } else {
    stop();
    stopAllMusic();
    emits("open-game-over", score.value, currentTime.value);
    cancelAnimationFrame(requestId.value);
  }
}

function startGame() {
  playButtonVisible.value = false;
  playGameMusic();

  if (canvas.value) {
    spaceshipX.value = CANVAS_WIDTH / 2 - SPACESHIP_INITIAL_X_OFFSET;
    spaceshipY.value = CANVAS_HEIGHT - SPACESHIP_HEIGHT;

    loadImage();
    setupKeyboardListener();
    createEnemy();
    start();
    main();
  }
}

function resetGame() {
  score.value = 0;
  playButtonVisible.value = true;
  Enemy.isGameOver = false;
  Enemy.enemyList = [];
  Bullet.bulletList = [];

  spaceshipX.value = CANVAS_WIDTH / 2 - SPACESHIP_INITIAL_X_OFFSET;
  spaceshipY.value = CANVAS_HEIGHT - SPACESHIP_HEIGHT;

  stop();
  reset();
  stopAllMusic();

  if (ctx) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    renderInitialState();
  }
  clearInterval(enemyIntervalId.value);
  cancelAnimationFrame(requestId.value);
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("keyup", handleKeyUp);
}

watch(
  () => route.name,
  (newGameName) => {
    category.value = newGameName;
  },
  { immediate: true }
);

onMounted(() => {
  resetGame();
  if (canvas.value) {
    canvas.value.width = CANVAS_WIDTH;
    canvas.value.height = CANVAS_HEIGHT;
    ctx = canvas.value.getContext("2d");

    loadImage();
  }
});
onBeforeUnmount(() => {
  resetGame();
});
</script>
<template>
  <div
    class="relative w-full h-full bg-cover bg-center bg-[url(/assets/images/bg/shoot-bg.png)]"
  >
    <div
      class="relative w-[500px] h-[700px] mx-auto"
      :style="{
        boxShadow:
          '0 0 7px #fff, 0 0 10px rgb(0, 100, 200), 0 0 21px rgb(0, 100, 200)',
      }"
    >
      <canvas ref="canvas" class="w-full h-full"></canvas>
      <div
        v-if="playButtonVisible"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
      >
        <h1
          class="text-center text-6xl font-bold text-white font-pixelNes mb-8"
          style="
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.9),
              0 0 20px rgba(168, 85, 247, 0.8), 0 0 30px rgba(147, 51, 234, 0.6),
              0 0 40px rgba(168, 85, 247, 0.4), 2px 2px 2px rgba(0, 0, 0, 0.5);
          "
        >
          <span>SHOOT</span><br />
          <span>ALIENS</span>
        </h1>
        <button
          @click="startGame"
          class="w-[160px] h-[68px] overflow-hidden rounded-full transition-transform duration-200 hover:scale-105"
        >
          <img
            src="/assets/images/game/tetris/play.png"
            alt="play button image"
            class="mt-[-44px]"
          />
        </button>
      </div>
      <button
        @click="toggleMute"
        @keydown.space.prevent="(e) => e.target.blur"
        class="absolute top-0 right-1 focus:outline-none"
      >
        <img
          :src="
            isMuted
              ? '/assets/images/game/shooting/mute.png'
              : '/assets/images/game/shooting/sound.png'
          "
          alt="Sound Mute Button"
        />
      </button>
    </div>
  </div>
</template>
