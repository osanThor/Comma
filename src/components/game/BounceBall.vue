<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useTimer } from "@/hooks/useTimer.js";

const emits = defineEmits(["open-game-over"]);

const GAME_WIDTH = 500;
const GAME_HEIGHT = 700;

const paddlePosition = ref(200); // (500/2 - 100/2)
const ballX = ref(250); // 공 초기 X 위치 (500/2)
const ballY = ref(50); // 공 초기 Y 위치
const ballSpeed = 6;
const speedIncrease = 0.4;
const ballSize = 20;

// 공의 이동 방향 (-1 ~ 1 사이의 랜덤한 X방향, Y방향은 항상 아래로)
const ballDx = ref((Math.random() * 2 - 1) * ballSpeed);
const ballDy = ref(ballSpeed);

const isPlaying = ref(false);
const isGameOver = ref(false);
const score = ref(0);

const { currentTime, start, stop, reset } = useTimer();

let animationFrameId = null;

// 사운드 객체 생성 및 최적화
const ballSound = new Audio("/assets/sounds/ball.mp3");
const paddleSound = new Audio("/assets/sounds/paddle.mp3");

// 사운드 미리 로드
ballSound.preload = "auto";
paddleSound.preload = "auto";

// 사운드 버퍼 준비
onMounted(() => {
  ballSound.load();
  paddleSound.load();
});

const gameContainerRef = ref(null); // template ref 추가

const resetGame = () => {
  cleanupGame();
  score.value = 0;
  ballX.value = 250;
  ballY.value = 50;
  ballDx.value = (Math.random() * 2 - 1) * ballSpeed;
  ballDy.value = ballSpeed;
  paddlePosition.value = 200;
  isGameOver.value = false;
  reset();
};

const updateBall = () => {
  if (!isPlaying.value) return;

  ballX.value += ballDx.value;
  ballY.value += ballDy.value;

  // 게임 오버 체크
  if (ballY.value >= GAME_HEIGHT) {
    isGameOver.value = true;
    isPlaying.value = false;
    stop(); // 타이머 중지
    emits("open-game-over", score.value, currentTime.value); // GameOverModal 호출
    return;
  }

  // 좌우 벽 충돌
  if (ballX.value <= 0) {
    ballX.value = 0; // 왼쪽 벽에서 위치 보정
    ballDx.value = -ballDx.value;
  } else if (ballX.value >= GAME_WIDTH - ballSize) {
    ballX.value = GAME_WIDTH - ballSize; // 오른쪽 벽에서 위치 보정
    ballDx.value = -ballDx.value;
  }

  // 상단 벽 충돌
  if (ballY.value <= 0) {
    ballDy.value = -ballDy.value;
  }

  // 패들 충돌
  if (
    ballY.value >= GAME_HEIGHT - 85 && // 약간 더 높은 위치부터 검사
    ballY.value <= GAME_HEIGHT - 55 && // 충돌 범위 확장
    ballX.value + ballSize >= paddlePosition.value && // 공의 크기 고려
    ballX.value <= paddlePosition.value + 100 // 패들 끝부분
  ) {
    ballSound.currentTime = 0;
    ballSound.play().catch((e) => console.log("sound play error:", e));
    score.value += 50;
    // 현재 속도 계산
    const currentSpeed = Math.sqrt(ballDx.value ** 2 + ballDy.value ** 2);
    // 속도 증가
    const newSpeed = currentSpeed + speedIncrease;

    // 랜덤 각도 추가 (-30도 ~ +30도)
    const randomAngle = ((Math.random() - 0.5) * Math.PI) / 3;

    // 반사 각도 계산
    let angle = Math.atan2(-ballDy.value, ballDx.value) + randomAngle;

    // 20도 미만인 경우 보정 (약 0.35 라디안)
    const minAngle = Math.PI / 9; // 20도
    if (Math.abs(angle) < minAngle) {
      angle = angle >= 0 ? minAngle : -minAngle;
    }
    if (Math.abs(Math.PI - Math.abs(angle)) < minAngle) {
      angle = angle >= 0 ? Math.PI - minAngle : -Math.PI + minAngle;
    }

    // 새로운 방향과 증가된 속도 설정
    ballDx.value = Math.cos(angle) * newSpeed;
    ballDy.value = -Math.abs(Math.sin(angle) * newSpeed);
  }

  animationFrameId = requestAnimationFrame(updateBall);
};

const handleMouseMove = (e) => {
  if (!isPlaying.value) return; // 게임이 진행 중일 때만 동작하도록
  const rect = gameContainerRef.value.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  paddlePosition.value = Math.max(0, Math.min(mouseX - 50, GAME_WIDTH - 100));
};

const cleanupGame = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  stop();
  isPlaying.value = false;
};

const togglePlay = () => {
  if (isPlaying.value) {
    cleanupGame();
  } else {
    isPlaying.value = true;
    animationFrameId = requestAnimationFrame(updateBall);
    start();
  }
};

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

onMounted(() => {
  if (gameContainerRef.value) {
    gameContainerRef.value.addEventListener("mousemove", handleMouseMove);
  }
});

onUnmounted(() => {
  cleanupGame();
  if (gameContainerRef.value) {
    gameContainerRef.value.removeEventListener("mousemove", handleMouseMove);
  }
});
</script>

<template>
  <div
    class="w-full h-full bg-[url(/assets/images/bg/bounceBallBg.jpg)] bg-cover bg-center bg-no-repeat py-4 px-10 flex items-center justify-center"
  >
    <div
      ref="gameContainerRef"
      class="game-container w-[500px] h-[700px] relative bg-[url(/assets/images/game/bounceBall/bg/bounceBallBg.png)] backdrop-blur-sm rounded-lg"
      :style="{
        boxShadow:
          '0 0 7px #fff, 0 0 10px rgb(0, 100, 200), 0 0 21px rgb(0, 100, 200)',
      }"
    >
      <!-- 타임 -->
      <div class="absolute top-6 left-4">
        <div v-if="currentTime" class="text-[20px] font-pixelNes text-white">
          {{ formatTime(currentTime) }}
        </div>
      </div>

      <!-- 스코어  -->
      <div class="absolute top-6 right-4">
        <div class="text-[20px] font-pixelNes text-white">
          {{ score }}
        </div>
      </div>
      <div
        class="absolute w-[20px] h-[20px]"
        :style="{
          left: `${ballX}px`,
          top: `${ballY}px`,
          backgroundImage: 'url(/assets/images/game/bounceBall/sprites.png)',
          backgroundPosition: '-115px -15px',
          backgroundSize: '250px 150px',
          imageRendering: 'pixelated',
          boxShadow:
            '0 0 15px 5px rgba(255, 255, 0, 0.3), 0 0 30px 10px rgba(255, 200, 0, 0.2)',
          borderRadius: '50%',
        }"
      ></div>
      <div
        class="absolute bottom-[50px] w-[100px] h-[10px]"
        :style="{
          left: `${paddlePosition}px`,
          backgroundImage: 'url(/assets/images/game/bounceBall/sprites.png)',
          backgroundPosition: '-125px -120px',
          backgroundSize: '250px 150px',
          boxShadow:
            '0 0 15px 5px rgba(147, 51, 234, 0.3), 0 0 30px 10px rgba(168, 85, 247, 0.2)',
          imageRendering: 'pixelated',
          borderRadius: '5px',
        }"
      ></div>
      <!-- 게임 시작 버튼 -->
      <div
        v-if="!isPlaying && !isGameOver"
        class="absolute inset-0 flex flex-col items-center justify-center bg-black/50"
      >
        <div class="flex flex-col items-center mt-24">
          <h1
            class="flex flex-col items-center text-6xl font-bold text-white font-pixelNes gap-0"
            style="
              text-shadow: 0 0 10px rgba(255, 255, 255, 0.9),
                0 0 20px rgba(168, 85, 247, 0.8),
                0 0 30px rgba(147, 51, 234, 0.6),
                0 0 40px rgba(168, 85, 247, 0.4), 2px 2px 2px rgba(0, 0, 0, 0.5);
            "
          >
            <span>BOUNCE</span>
            <span class="-mt-2">BALL</span>
          </h1>
          <button
            @click="togglePlay"
            class="w-[150px] h-[150px] transition-transform duration-200 hover:scale-105"
          >
            <img
              src="/assets/images/game/tetris/play.png"
              alt="게임 시작"
              class="w-full h-full object-contain"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
