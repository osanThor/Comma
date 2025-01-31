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

const { currentTime, start, stop } = useTimer();
const { playGameMusic, stopAllMusic, setMute } = useBackgroundMusic();

const isMuted = ref(false);

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

function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {
    keysDown[event.key] = true;
  });
  document.addEventListener("keyup", function (event) {
    delete keysDown[event.key];

    if (event.key === " ") {
      createBullet();
    }
  });
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
      new Enemy(
        generateRandomValue,
        stop,
        stopAllMusic,
        emits,
        score.value,
        currentTime.value
      );
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

function update() {
  if ("ArrowRight" in keysDown) {
    spaceshipX.value += 4;
  }
  if ("ArrowLeft" in keysDown) {
    spaceshipX.value -= 4;
  }
  if (spaceshipX.value <= 0) {
    spaceshipX.value = 0;
  }
  if (spaceshipX.value >= CANVAS_WIDTH - SPACESHIP_WIDTH) {
    spaceshipX.value = CANVAS_WIDTH - SPACESHIP_WIDTH;
  }

  for (let i = 0; i < Bullet.bulletList.length; i++) {
    if (Bullet.bulletList[i].alive) {
      Bullet.bulletList[i].update();
      Bullet.bulletList[i].checkHit(Enemy.enemyList, score);
    }
  }

  for (let i = 0; i < Enemy.enemyList.length; i++) {
    Enemy.enemyList[i].update();
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

function main() {
  if (!Enemy.isGameOver) {
    update();
    render();
    requestAnimationFrame(main);
  } else console.log("game over");
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

watch(
  () => route.name,
  (newGameName) => {
    category.value = newGameName;
  },
  { immediate: true }
);

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = CANVAS_WIDTH;
    canvas.value.height = CANVAS_HEIGHT;
    ctx = canvas.value.getContext("2d");

    loadImage();
  }
});
</script>
<template>
  <div class="relative w-[500px] h-[700px] mx-auto">
    <canvas ref="canvas" class="w-full h-full"></canvas>
    <button
      v-if="playButtonVisible"
      @click="startGame"
      class="w-[172px] h-[80px] overflow-hidden rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <img
        src="/assets/images/game/tetris/play.png"
        alt="play button image"
        class="mt-[-44px]"
      />
    </button>
    <button
      @click="toggleMute"
      @keydown.space.prevent="(e) => e.target.blur"
      class="absolute top-0 right-0 focus:outline-none"
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
</template>
