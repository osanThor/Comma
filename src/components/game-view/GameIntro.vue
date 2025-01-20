<script>
import GameDescription from "../game-view/GameDescription.vue";
export default {
  name: "GameIntro",
  components: {
    GameDescription,
  },
};
</script>

<template>
  <div
    class="h-[108px] w-[287px] bg-main-600 text-sm text-white text-center pt-[27px] pr-[18px] pb-[19px] pl-[19px] items-center justify-center mb-[38px]"
  >
    플래피 버드는 단순하지만 중독성 있는 게임으로, 스페이스바를 통해 새를
    조작하여 장애물을 피하는 방식으로 진행됩니다.
  </div>
</template>
