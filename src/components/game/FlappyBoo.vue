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
import { useTimer } from "@/hooks/useTimer.js";
import kaplay from "kaplay";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { makeBackground } from "../../classes/flappy/makeBackground.js";
import { makePlayer } from "../../classes/flappy/makePlayer.js";
import { SCALE_FACTOR } from "../../constants/flappy.js";

const emit = defineEmits(["open-game-over"]);
const gameCanvas = ref(null);
let audioEnabled = ref(true);
let isGameStarted = ref(false);
let audioContext = null;
let k = null;

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

  k.loadSprite("sky", "/assets/flappy/2.png");
  k.loadSprite("field", "/assets/flappy/3.png");
  k.loadSprite("boo", "/assets/flappy/Boo.png");
  k.loadSprite("obstacles", "/assets/flappy/obstacles.png");
  k.loadSprite("playBtn", "/assets/flappy/playBtn.png");
  k.loadSprite("clouds", "/assets/flappy/clouds.png");
  k.loadSound("jump", "/assets/flappy/jump.wav");
  k.loadSound("hurt", "/assets/flappy/hurt.wav");
  k.loadSound("confirm", "/assets/flappy/poka02.mp3");

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
      k.text(`Score: ${score}`, { size: 32 }),
      k.pos(600, 620), 
      k.color(255, 255, 255),
      { updateScore: (newScore) => (scoreLabel.text = `Score: ${newScore}`) },
    ]);

    const clouds = map.add([k.sprite("clouds"), k.pos(), { speed: 5 }]);
    clouds.onUpdate(() => {
      if (isGameStarted.value) {
        clouds.move(clouds.speed, 0);
        if (clouds.pos.x > 500) {
          clouds.pos.x = -100;
        }
      }
    });

    const colliders = await (
      await fetch("/assets/flappy/collidersData.json")
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

    k.onUpdate(() => {
      if (!isGameStarted.value) return;

      for (let i = 0; i < obstaclesLayer.parts.length; i++) {
        const currentPart = obstaclesLayer.parts[i];
        const nextPart =
          obstaclesLayer.parts[(i + 1) % obstaclesLayer.parts.length];

        if (currentPart.pos.x < -IMAGE_WIDTH) {
          currentPart.pos.x = nextPart.pos.x + IMAGE_WIDTH;
        }

        currentPart.move(obstaclesLayer.speed, 0);
      }
      if (isGameStarted.value) {
        obstaclesLayer.speed -= 0.1;
      }
    });

    k.loop(1, () => {
      score += 1;
      scoreLabel.updateScore(score);
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
      isGameStarted.value = false;
      player.disableControls();
      obstaclesLayer.speed = 0;
      map.speed = 0;

      stop();
      console.log(score, currentTime.value);
      player.isDead = true;

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
});
</script>

<style scoped>
.game-scene {
  position: relative;
}

.score-label {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32px;
  color: white;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
}
</style>
