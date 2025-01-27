<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useTimer } from "@/hooks/useTimer.js";

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

const resetGame = () => {
  score.value = 0;
  ballX.value = 250;
  ballY.value = 50;
  ballDx.value = (Math.random() * 2 - 1) * ballSpeed;
  ballDy.value = ballSpeed;
  paddlePosition.value = 200;
  isPlaying.value = false;
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
    stop(); // 타이머 중지 추가
    emits("open-game-over", score.value, currentTime.value);
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
  const container = e.currentTarget;
  const rect = container.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  paddlePosition.value = Math.max(0, Math.min(mouseX - 50, GAME_WIDTH - 100));
};

const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    animationFrameId = requestAnimationFrame(updateBall);
    start();
  } else {
    stop();
  }
};

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const millis = Math.floor(milliseconds % 1000);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}:${String(millis).padStart(3, "0")}`;
};

onMounted(() => {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  const gameContainer = document.querySelector(".game-container");
  gameContainer.removeEventListener("mousemove", handleMouseMove);
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <div
      class="game-container w-[500px] h-[700px] relative"
      :style="{
        backgroundImage: 'url(/assets/bounceBall/bounceBallBg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <!-- 스코어와 플레이타임을 함께 표시 -->
      <div class="absolute top-6 left-4 flex flex-col gap-2">
        <div class="text-3xl font-dnf text-white opacity-30">
          {{ score }}
        </div>
        <div v-if="currentTime" class="text-xl font-dnf text-white opacity-30">
          {{ formatTime(currentTime) }}
        </div>
      </div>
      <div
        class="absolute w-[20px] h-[20px]"
        :style="{
          left: `${ballX}px`,
          top: `${ballY}px`,
          backgroundImage: 'url(/assets/bounceBall/sprites.png)',
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
          backgroundImage: 'url(/assets/bounceBall/sprites.png)',
          backgroundPosition: '-125px -70px',
          backgroundSize: '250px 150px',
          boxShadow:
            '0 0 15px 5px rgba(0, 255, 0, 0.3), 0 0 30px 10px rgba(0, 200, 0, 0.2)',
          imageRendering: 'pixelated',
          borderRadius: '5px',
        }"
      ></div>
      <!-- 게임 시작 버튼 -->
      <div
        v-if="!isPlaying && !isGameOver"
        class="absolute inset-0 flex items-center justify-center bg-black/50"
      >
        <button
          @click="togglePlay"
          class="px-8 py-4 bg-point-500 text-white font-dnf text-2xl rounded-xl hover:bg-point-600"
        >
          게임 시작
        </button>
      </div>
      <!-- 게임 오버 화면 -->
      <div
        v-if="isGameOver"
        class="absolute inset-0 flex items-center justify-center bg-black/50"
      >
        <div class="text-center">
          <p class="text-4xl font-bold font-dnf text-white mb-4">GAME OVER</p>
          <button
            @click="resetGame"
            class="px-8 py-4 bg-point-500 text-white font-dnf text-2xl rounded-xl hover:bg-point-600"
          >
            다시 시작
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
