<script>
import GameIntro from "../game-view/GameIntro.vue";
import GameDescription from "../game-view/GameDescription.vue";
export default {
  name: "GameDetail",
  components: {
    GameIntro,
    GameDescription,
  },
};
</script>

<template>
  <div
    class="mt-[160px] h-[565px] w-[325px] bg-main-700 rounded-2xl items-center justify-center flex flex-col px-[19px] relative"
  >
    <h2 class="font-dnf text-white text-2xl mt-[41px] mb-[8px]">게임 소개</h2>
    <GameIntro />
    <h2 class="font-dnf text-white text-2xl mb-[8px]">게임 설명</h2>
    <GameDescription />
    <img
      src="/assets/images/ghost.png"
      alt="ghost"
      class="absolute bottom-[33px] right-[7px] w-[92px] h-[63px] z-10"
    />
  </div>
</template>
