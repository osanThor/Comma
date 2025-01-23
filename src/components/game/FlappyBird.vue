<template>
  <div class="game-scene">
    <!-- 게임화면 렌더링 -->
    <canvas ref="gameCanvas" width="1300" height="700"></canvas>
  </div>
</template>

<script>
import kaplay from "kaplay";
import { useGameStore } from "../../stores/gameStore.js";
import { SCALE_FACTOR } from "./flappyBird/utils/constants.js";
import { makeBackground } from "./flappyBird/utils/makeBackground.js";
import { makePlayer } from "./flappyBird/utils/makePlayer.js";
import { makeScoreBox } from "./flappyBird/utils/makeScoreBox.js";
import { saveSystem } from "./flappyBird/utils/save.js";

export default {
  name: "GameScene",
  async mounted() {
    if (window.__kaplayInitialized) {
      console.warn("KAPLAY already initialized!");
      return;
    }
    window.__kaplayInitialized = true;

    const k = kaplay({
      width: 1300,
      height: 700,
      letterbox: true,
      global: true,
      background: "#BFE8FF",
    });
    console.log("KAPLAY initialized:", k);

    let audioEnabled = true;
    const gameStore = useGameStore();
    let isGameStarted = false;

    k.loadSprite("kriby", "/assets/flappy/kriby.png");
    k.loadSprite("background", "/assets/flappy/background.png");
    k.loadSprite("obstacle", "/assets/flappy/obstacles.png");
    k.loadSprite("clouds", "/assets/flappy/clouds.png");
    k.loadSound("jump", "/assets/flappy/jump.wav");
    k.loadSound("hurt", "/assets/flappy/hurt.wav");
    k.loadSound("confirm", "/assets/flappy/poka02.mp3");

    let audioContext;

    const resumeAudioContext = () => {
      if (!audioContext) {
        audioContext = new AudioContext();
      }
      audioContext.resume().then(() => {
        console.log("Audio context resumed");
      });
    };

    let score = 0;
    let playTime = 0;

    // 시작 화면 씬
    k.scene("start", () => {
      makeBackground(k, SCALE_FACTOR);

      const playBtn = k.add([
        k.rect(200, 50, { radius: 100 }), 
        k.color(k.Color.fromHex("#14638e")),
        k.area(),
        k.anchor("center"),
        k.pos(k.center().x + 30, k.center().y - 0), 
      ]);

      playBtn.add([
        k.text("Play", { size: 24 }), 
        k.color(k.Color.fromHex("#d7f2f7")),
        k.area(),
        k.anchor("center"),
      ]);

      const goToGame = () => {
        resumeAudioContext();

        if (audioEnabled) k.play("confirm");
        k.go("main");
      };

      playBtn.onClick(goToGame);
      k.onKeyPress("space", goToGame);
    });

    function startGame() {
      isGameStarted = true;
      k.setGravity(2500);
    }

    // 메인 게임 씬
    k.scene("main", async () => {
      debug.inspect = true;

      let score = 0;

      const colliders = await (
        await fetch("/assets/flappy/collidersData.json")
      ).json();
      const collidersData = colliders.data;

      makeBackground(k, SCALE_FACTOR);

      const player = makePlayer(k);
      player.pos = k.vec2(0, 350); 
      player.setControls();

      k.onKeyPress("space", () => {
        if (!isGameStarted) {
          startGame();
        } else if (!player.isDead) {
          player.jump(400);
          if (audioEnabled) k.play("jump", { volume: 0.02 });
        }
      });

      const clouds = k.add([k.sprite("clouds"), k.pos(), { speed: 5 }]);
      clouds.scale = SCALE_FACTOR;

      clouds.onUpdate(() => {
        clouds.move(clouds.speed, 0);
        if (clouds.pos.x > 700) clouds.pos.x = -500;
      });

      const platforms = [];

      for (const collider of collidersData) {
        const platform = k.add([
          k.sprite("obstacle"),
          k.scale(SCALE_FACTOR),
          k.pos(collider.x * SCALE_FACTOR, collider.y * SCALE_FACTOR),
          k.area({
            shape: new k.Rect(
              k.vec2(0),
              collider.width * SCALE_FACTOR,
              collider.height * SCALE_FACTOR
            ),
          }),
          k.body({ isStatic: true }),
          { speed: 100 },
          "obstacle",
        ]);
        platforms.push(platform);
      }

      k.loop(1, () => {
        score += 1;
      });

      platforms.forEach((platform) => {
        if (platform.onUpdate) {
          platform.onUpdate(() => {
            if (!isGameStarted) return;

            platform.move(-platform.speed, 0);

            if (platform.pos.x < -1300) {
              platform.pos.x = 1300;
              platform.speed += 30;
            }
          });
        } else {
          console.error("Platform does not have an onUpdate method:", platform);
        }
      });

      // 충돌
      player.onCollide("obstacle", async (obstacle) => {
        if (!obstacle) {
          console.error("Invalid obstacle:", obstacle);
          return;
        }

        // 디버깅: 충돌 발생 확인
        console.log("충돌 발생!", {
          playerPosition: player.pos,
          obstaclePosition: obstacle.pos,
          obstacleSpeed: obstacle.speed,
        });

        if (player.isDead) return;
        if (audioEnabled) k.play("hurt");

        // 게임 상태 업데이트
        platforms.forEach((platform) => {
          platform.speed = 0;
        });
        player.isDead = true;
        player.disableControls();

        makeScoreBox(k, k.center(), score);

        // 최고 점수 갱신 및 저장
        gameStore.updateMaxScore(score);

        // 점수 저장
        await saveSystem.load();
        if (score > saveSystem.data.maxScore) {
          saveSystem.data.maxScore = score;
          await saveSystem.save();
        }

        // 서버로 데이터 저장
        gameStore.saveDataToServer();
      });
      k.setCamScale(k.vec2(1.2));
      player.onUpdate(() => {
        if (isGameStarted) {
          k.setCamPos(player.pos.x, 400);
        }
      });
    });

    // 게임 시작
    k.go("start");
    console.log("Start scene loaded");
  },
};
</script>
