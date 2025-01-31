<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const gameNameMap = {
  mineSweeper: ["MINE", "SWEEPER"],
  tetris: ["TETRIS"],
  bounceBall: ["BOUNCE", "BALL"],
  flappyBoo: ["FLAPPY", "BOO"],
  shooting: ["SHOOT", "ALIENS"],
};

const route = useRoute();
const localizedGameName = computed(() => {
  const name = gameNameMap[route.params.gameName];
  return name ? name.join("\n") : route.params.gameName;
});

const playPath = computed(() => `/game/play/${route.params.gameName}`);

const gameBackgrounds = {
  mineSweeper: "/assets/images/banner/mineSweeperBanner.png",
  tetris: "/assets/images/banner/tetrisBanner.png",
  bounceBall: "/assets/images/banner/bounceBallBanner.png",
  flappyBoo: "/assets/images/banner/flappyBooBanner.png",
  shooting: "/assets/images/banner/shootingBanner.png",
};

const currentBackground = computed(() => {
  return gameBackgrounds[route.params.gameName] || "";
});

const titleTopPosition = computed(() => {
  return route.params.gameName === "tetris" ? "top-[126px]" : "top-[96px]";
});
</script>

<template>
  <div
    class="w-full max-w-[1075px] h-[404px] rounded-2xl mt-[160px] bg-main-500 flex flex-col relative"
    :style="{
      backgroundImage: `url(${currentBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <div
      class="absolute right-[0px] flex flex-col items-start gap-5 top-1/2 translate-y-5"
      :class="titleTopPosition"
    >
      <h1
        class="text-6xl font-bold font-pixelNes text-white w-[367px] whitespace-pre-line"
      >
        {{ localizedGameName }}
      </h1>
      <router-link
        :to="playPath"
        class="group rounded-[60px] text-main-500 hover:text-point-500 bg-point-500 px-5 py-3 relative -translate-x-1 hover:bg-white flex items-center justify-center gap-[6px] transition-transform hover:scale-105"
      >
        <svg
          width="15"
          height="18"
          viewBox="0 0 15 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.9294 0.549587L13.7789 6.97893C14.3588 7.37539 14.7031 8.0169 14.7031 8.70067C14.7031 9.38445 14.3588 10.026 13.7789 10.4224L4.9294 17.4507C4.18075 18.0262 3.1638 18.1607 2.28116 17.8009C1.39852 17.4411 0.792538 16.645 0.703125 15.7279L0.703125 2.26797C0.794068 1.35161 1.40064 0.556933 2.283 0.198172C3.16535 -0.160589 4.18141 -0.0256664 4.9294 0.549587Z"
            fill="currentColor"
          />
        </svg>
        <p class="font-dnf text-lg">PLAY GAME</p>
      </router-link>
    </div>
  </div>
</template>
