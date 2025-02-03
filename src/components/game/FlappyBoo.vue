<template>
  <div class="game-scene">
    <!-- 게임화면 렌더링 -->
    <canvas
      ref="gameCanvas"
      width="1300"
      height="750"
      style="width: 100%; height: 100%"
    ></canvas>
  </div>
</template>

<script setup>
import { makeBackground } from "@/classes/flappy/makeBackground.js";
import { makePlayer } from "@/classes/flappy/makePlayer.js";
import { SCALE_FACTOR } from "@/constants/flappy.js";
import { useTimer } from "@/hooks/useTimer.js";
import kaplay from "kaplay";
import { onBeforeUnmount, onMounted, ref } from "vue";

const emit = defineEmits(["open-game-over"]);
const gameCanvas = ref(null);
let audioEnabled = ref(true);
let isGameStarted = ref(false);
let audioContext = null;
let k = null;

const SCORE_LABEL_CONFIG = {
  font: "Pixel_NES",
  size: 32,
  styles: {
    bold: true,
    shadow: {
      color: k?.rgb(0, 0, 0),
      blur: 4,
      offset: k?.vec2(2, 2),
    },
  },
};

const { currentTime, start, stop, reset } = useTimer();

const setCanvasSize = () => {
  const canvas = gameCanvas.value;
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
};

const resumeAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  audioContext.resume().then(() => {
    console.log("Audio context resumed");
  });
};

const startGame = () => {
  isGameStarted.value = true;
  k.setGravity(2500);
  start();
};

onMounted(async () => {
  setCanvasSize();
  window.addEventListener("resize", setCanvasSize);

  const canvas = gameCanvas.value;
  k = kaplay({
    width: 1300,
    height: 750,
    letterbox: true,
    global: true,
    canvas: canvas,
  });

  await k.loadFont("Pixel_NES", "/assets/fonts/Pixel_NES.otf");

  k.loadSprite("sky", "/assets/images/game/flappy/2.png");
  k.loadSprite("field", "/assets/images/game/flappy/3.png");
  k.loadSprite("boo", "/assets/images/game/flappy/Boo.png");
  k.loadSprite("obstacles", "/assets/images/game/flappy/obstacles.png");
  k.loadSprite("playBtn", "/assets/images/game/flappy/playBtn.png");
  k.loadSprite("clouds", "/assets/images/game/flappy/clouds.png");
  k.loadSound("jump", "/assets/images/game/flappy/jump.wav");
  k.loadSound("hurt", "/assets/images/game/flappy/hurt.wav");
  k.loadSound("confirm", "/assets/images/game/flappy/poka02.mp3");

  // 시작 화면 씬
  k.scene("start", async () => {
    makeBackground(k);
    //배경 추가
    const map = k.add([k.pos(0, 0), k.scale(SCALE_FACTOR)]);
    const clouds = map.add([k.sprite("clouds"), k.pos(), { speed: 5 }]);
    clouds.onUpdate(() => {
      clouds.move(clouds.speed, 0);
      if (clouds.pos.x > 700) clouds.pos.x = -500;
    });

    map.add([k.sprite("obstacles"), k.pos(), k.area(), { speed: 100 }]);

    const player = makePlayer(k);
    player.pos = k.vec2(k.center().x - 350, k.center().y + 40);

    const playBtn = k.add([
      k.sprite("playBtn"),
      k.scale(0.35),
      k.area(),
      k.anchor("center"),
      k.pos(k.center().x + 20, k.center().y + 40),
    ]);

    const goToGame = () => {
      resumeAudioContext();

      if (audioEnabled) k.play("confirm");
      k.go("main");
    };

    playBtn.onClick(goToGame);
    k.onKeyPress("space", goToGame);
  });

  // 메인 게임 씬
  k.scene("main", async () => {
    // debug.inspect = true; // 디버깅 코드
    let score = 0;
    isGameStarted.value = false;
    makeBackground(k);

    const map = k.add([k.pos(0, 0), k.scale(SCALE_FACTOR)]);

    const scoreLabel = k.add([
      k.text(`Score: ${score}`, {
        ...SCORE_LABEL_CONFIG,
        size: SCORE_LABEL_CONFIG.size,
        font: SCORE_LABEL_CONFIG.font,
      }),
      k.pos(50, 50),
      k.fixed(),
      k.z(100),
      k.color(255, 255, 255),
      {
        updateScore: (newScore) => {
          scoreLabel.text = `Score: ${newScore}`;
        },
      },
    ]);

    const clouds = [];
    const cloudSpeed = 5;

    for (let i = 0; i < 2; i++) {
      const cloud = map.add([
        k.sprite("clouds"),
        k.pos(i * 900, 10),
        { speed: cloudSpeed },
      ]);
      clouds.push(cloud);
    }

    k.onUpdate(() => {
      if (isGameStarted.value) {
        clouds.forEach((cloud) => {
          cloud.move(cloud.speed, 0);

          if (cloud.pos.x > canvas.width) {
            cloud.pos.x = -cloud.width;
          }
        });
      }
    });

    const colliders = await (
      await fetch("/assets/images/game/flappy/collidersData.json")
    ).json();
    const collidersData = colliders.data;

    const IMAGE_WIDTH = 480 * SCALE_FACTOR;
    const obstaclesLayer = {
      speed: -100,
      parts: [
        k.add([
          k.sprite("obstacles"),
          k.pos(0, 0),
          k.area(),
          k.scale(SCALE_FACTOR),
        ]),
        k.add([
          k.sprite("obstacles"),
          k.pos(IMAGE_WIDTH, 0),
          k.area(),
          k.scale(SCALE_FACTOR),
        ]),
      ],
    };

    let lastUpdateTime = performance.now();
    k.onUpdate(() => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastUpdateTime) / 1000;
      lastUpdateTime = currentTime;

      if (isGameStarted.value) {
        for (let i = 0; i < obstaclesLayer.parts.length; i++) {
          const currentPart = obstaclesLayer.parts[i];
          const nextPart =
            obstaclesLayer.parts[(i + 1) % obstaclesLayer.parts.length];

          if (currentPart.pos.x < -IMAGE_WIDTH) {
            currentPart.pos.x = nextPart.pos.x + IMAGE_WIDTH;
          }
          currentPart.move(obstaclesLayer.speed * deltaTime * 60, 0);
        }
      }
      if (isGameStarted.value) {
        obstaclesLayer.speed -= 5 * deltaTime;
      }
    });

    k.loop(1, () => {
      if (isGameStarted.value && !player.isDead) {
        score += 50;
        scoreLabel.updateScore(score);
      }
    });

    for (const collider of collidersData) {
      for (const part of obstaclesLayer.parts) {
        part.add([
          k.area({
            shape: new k.Rect(k.vec2(0), collider.width, collider.height),
          }),
          k.body({ isStatic: true }),
          k.pos(collider.x, collider.y),
          "obstacle",
        ]);
      }
    }

    k.add([k.rect(k.width(), 50), k.pos(0, -50), k.area(), "obstacle"]);
    k.add([k.rect(k.width(), 50), k.pos(0, 1000), k.area(), "obstacle"]);

    k.onKeyPress("space", () => {
      if (!isGameStarted.value) {
        startGame();
      } else if (!player.isDead) {
        player.jump(400);
        if (audioEnabled.value) k.play("jump", { volume: 0.02 });
      }
    });

    const player = makePlayer(k);
    player.pos = k.vec2(k.center().x - 200, k.center().y);
    player.setControls();

    // 충돌한 후 게임 점수/타임 기록
    player.onCollide("obstacle", async () => {
      if (player.isDead) return;

      if (audioEnabled.value) k.play("hurt");
      player.isDead = true;
      player.disableControls();
      isGameStarted.value = false;
      obstaclesLayer.speed = 0;
      map.speed = 0;

      stop();

      emit("open-game-over", score, currentTime.value);
      reset();
    });

    k.setCamScale(k.vec2(1.2));
    player.onUpdate(() => {
      if (isGameStarted.value && !player.isDead) {
        k.setCamPos(player.pos.x + 100, 400);
      }
    });
  });

  // 게임 시작
  k.go("start");
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", setCanvasSize);

  if (audioContext && audioContext.state !== "closed") {
    audioContext.close();
    window.location.reload();
  }
});
</script>

<style scoped></style>
