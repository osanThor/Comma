<script>
export default {
  name: "GameBanner",
};
</script>

<template>
  <div
    class="w-[1075px] h-[404px] rounded-2xl mt-[160px] bg-main-500 flex flex-col relative"
  >
    <div class="absolute right-[56px] top-[126px]">
      <h1 class="text-6xl font-bold font-dnf text-white mb-10">Flappy Bird</h1>
      <div class="rounded-[60px] w-[229px] h-[65px] bg-point-500 mt-[27px]">
        <RouterLink
          to="/game/play"
          class="group rounded-[60px] w-[229px] h-[65px] bg-point-500 flex items-center justify-center gap-[12px]"
        >
          <img
            src="/assets/images/icons/play-icon.svg"
            alt="play icon"
            class="w-[18px] h-[25px]"
          />
          <p class="font-dnf text-white text-2xl group-hover:text-main-500">
            Play Game
          </p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
