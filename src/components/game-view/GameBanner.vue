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
    class="w-[1075px] h-[404px] rounded-2xl mt-[160px] bg-main-500 flex flex-col relative"
    :style="{
      backgroundImage: `url(${currentBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <div class="absolute right-[0px]" :class="titleTopPosition">
      <h1
        class="text-6xl font-bold font-pixelNes text-white mb-[27px] w-[389px] whitespace-pre-line"
      >
        {{ localizedGameName }}
      </h1>
      <router-link
        :to="playPath"
        class="group rounded-[60px] w-[229px] h-[65px] bg-point-500 hover:bg-white flex items-center justify-center gap-[12px] mt-[27px] transition-transform hover:scale-105"
      >
        <svg
          width="18"
          height="25"
          viewBox="0 0 18 25"
          xmlns="http://www.w3.org/2000/svg"
          class="w-[18px] h-[25px]"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5.44253 1.66346L16.8125 10.2615C17.5576 10.7916 18 11.6495 18 12.564C18 13.4784 17.5576 14.3363 16.8125 14.8665L5.44253 24.2655C4.48065 25.0351 3.17405 25.2149 2.04002 24.7338C0.905987 24.2526 0.127405 23.188 0.0125275 21.9615L0.0125275 3.96146C0.129372 2.73601 0.908712 1.67329 2.04238 1.19351C3.17605 0.713741 4.4815 0.894174 5.44253 1.66346Z"
            class="fill-main-500 group-hover:fill-point-500"
          />
        </svg>
        <p class="font-dnf text-main-500 text-2xl group-hover:text-point-500">
          Play Game
        </p>
      </router-link>
    </div>
  </div>
</template>
