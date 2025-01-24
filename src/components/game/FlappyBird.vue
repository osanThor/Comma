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
    });

    let audioEnabled = true;
    const gameStore = useGameStore();
    let isGameStarted = false;

    k.loadSprite("sky", "/assets/flappy/2.png");
    k.loadSprite("field", "/assets/flappy/3.png");

    k.loadSprite("kriby", "/assets/flappy/kriby.png");
    k.loadSprite("obstacles", "/assets/flappy/obstacles.png");
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

      await saveSystem.load();
      if (!saveSystem.data.maxScore) {
        saveSystem.data.maxScore = 0;
        await saveSystem.save();
      }

      const player = makePlayer(k);
      player.pos = k.vec2(k.center().x - 350, k.center().y + 65); // 0,350

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
      debug.inspect = true; // 디버깅 코드
      let score = 0;
      let playTime = 0;

      isGameStarted = false;

      makeBackground(k);

      const map = k.add([k.pos(0, 0), k.scale(SCALE_FACTOR)]);

      const clouds = map.add([k.sprite("clouds"), k.pos(), { speed: 5 }]);
      clouds.onUpdate(() => {
        if (isGameStarted) {
          clouds.move(clouds.speed, 0);
          if (clouds.pos.x > 700) {
            clouds.pos.x = -500;
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
        if (!isGameStarted) return;

        for (let i = 0; i < obstaclesLayer.parts.length; i++) {
          const currentPart = obstaclesLayer.parts[i];
          const nextPart =
            obstaclesLayer.parts[(i + 1) % obstaclesLayer.parts.length];

          if (currentPart.pos.x < -IMAGE_WIDTH) {
            currentPart.pos.x = nextPart.pos.x + IMAGE_WIDTH;
          }

          currentPart.move(obstaclesLayer.speed, 0);
        }
        if (isGameStarted) {
          obstaclesLayer.speed -= 0.1;
        }
      });

      k.loop(1, () => {
        score += 1;
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
        if (!isGameStarted) {
          startGame();
        } else if (!player.isDead) {
          player.jump(400);
          if (audioEnabled) k.play("jump", { volume: 0.02 });
        }
      });

      const player = makePlayer(k);
      player.pos = k.vec2(k.center().x - 100, k.center().y);
      player.setControls();

      // 충돌
      player.onCollide("obstacle", async () => {
        if (player.isDead) return;
        if (audioEnabled) k.play("hurt");

        isGameStarted = false;

        obstaclesLayer.speed = 0;
        map.speed = 0;
        player.disableControls();
        makeScoreBox(k, k.center(), score);
        player.isDead = true;

        // 최고 점수 갱신 및 저장
        gameStore.updateMaxScore(score);

        // 점수 저장
        try {
          gameStore.updateMaxScore(score);
          await saveSystem.load();
          if (score > saveSystem.data.maxScore) {
            saveSystem.data.maxScore = score;
            await saveSystem.save();
          }
          gameStore.saveDataToServer();
        } catch (error) {
          console.error("Error saving score:", error);
        }
      });

      k.setCamScale(k.vec2(1.2));
      player.onUpdate(() => {
        if (isGameStarted && !player.isDead) {
          k.setCamPos(player.pos.x + 100, 400);
        }
      });
    });

    // 게임 시작
    k.go("start");
  },
};
</script>
