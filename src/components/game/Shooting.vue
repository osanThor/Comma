<script setup>
import { ref, onMounted } from "vue";
import { useTimer } from "@/hooks/useTimer.js";
import { useBackgroundMusic } from "@/classes/shooting/sound";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SPACESHIP_HEIGHT,
  SPACESHIP_INITIAL_X_OFFSET,
  BULLET_X_OFFSET,
  BULLET_SPEED,
  ENEMY_WIDTH,
  ENEMY_HEIGHT,
  ENEMY_BOX_PADDING,
  ENEMY_GENERATION_INTERVALS,
  ENEMY_SPEED,
  HIT_BOX_PADDING,
  IMAGE_PATHS,
  SPACESHIP_WIDTH,
} from "@/constants/shooting";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const category = ref("");
const route = useRoute();

const emits = defineEmits(["open-game-over"]);

const canvas = ref(null);
let ctx;

let backgroundImage, spaceshipImage, bulletImage, enemyImage;
const gameOver = ref(false);
const score = ref(0);
const playButtonVisible = ref(true);

const spaceshipX = ref(0);
const spaceshipY = ref(0);

const keysDown = {};

const bulletList = [];
const enemyList = [];

const enemyIntervalId = ref(null);
const previousIntervalTime = ref(null);

const { currentTime, start, stop, reset } = useTimer();
const { playGameMusic, stopAllMusic, setMute } = useBackgroundMusic();

const isMuted = ref(false);

function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX.value + BULLET_X_OFFSET;
    this.y = spaceshipY.value;
    this.alive = true;

    bulletList.push(this);
  };
  this.update = function () {
    this.y -= BULLET_SPEED;

    if (this.y < 0) {
      this.alive = false;
    }
  };

  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x - HIT_BOX_PADDING &&
        this.x <= enemyList[i].x + HIT_BOX_PADDING
      ) {
        score.value++;
        this.alive = false;
        enemyList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = generateRandomValue(
      ENEMY_BOX_PADDING,
      CANVAS_WIDTH - ENEMY_WIDTH - ENEMY_BOX_PADDING
    );
    this.y = 0;
    enemyList.push(this);
  };
  this.update = async function () {
    this.y += ENEMY_SPEED;

    if (this.y >= CANVAS_HEIGHT - ENEMY_HEIGHT) {
      gameOver.value = true;
      stop();
      stopAllMusic();
      emits("open-game-over", score.value, currentTime.value);
    }
  };
}

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
  let b = new Bullet();
  b.init();
}

function createEnemy() {
  let intervalTime = ENEMY_GENERATION_INTERVALS.default;

  const updateEnemyInterval = () => {
    if (enemyIntervalId.value) {
      clearInterval(enemyIntervalId.value);
    }

    enemyIntervalId.value = setInterval(() => {
      let e = new Enemy();
      e.init();
    }, intervalTime);
  };

  // 점수 변화 감지
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

function formatPlayTime(milliseconds) {
  if (!milliseconds || isNaN(milliseconds)) {
    return "00:00:000";
  }
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const millis = milliseconds % 1000;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}:${millis.toString().padStart(3, "0")}`;
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

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
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

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  if (!gameOver.value) {
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
      class="font-dnf text-2xl text-white w-[160px] h-[64px] bg-main-400 hover:bg-point-500 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      PLAY
    </button>
    <button @click="toggleMute" class="absolute top-0 right-0">
      <img
        :src="
          isMuted
            ? '/assets/images/icons/mute.png'
            : '/assets/images/icons/sound.png'
        "
        alt="Sound Mute Button"
      />
    </button>
  </div>
  <div class="relative w-[500px] h-[700px] mx-auto">
    <canvas ref="canvas" class="w-full h-full"></canvas>
    <button
      v-if="playButtonVisible"
      @click="startGame"
      class="font-dnf text-2xl text-white w-[160px] h-[64px] bg-main-400 hover:bg-point-500 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      PLAY
    </button>
    <button @click="toggleMute" class="absolute top-0 right-0">
      <img
        :src="
          isMuted
            ? '/assets/images/icons/mute.png'
            : '/assets/images/icons/sound.png'
        "
        alt="Sound Mute Button"
      />
    </button>
  </div>
</template>
