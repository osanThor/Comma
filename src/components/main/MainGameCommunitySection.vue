<script setup>
import TitleLeft from "@/components/common/icons/TitleLeft.vue";
import TitleRight from "@/components/common/icons/TitleRight.vue";
import PlayIcon from "@/components/common/icons/PlayIcon.vue";
import CommentIcon from "@/components/common/icons/CommentIcon.vue";
import { useGameStore } from "@/stores/test-game";

const gameStore = useGameStore();
const { games, gameTopRankers } = storeToRefs(gameStore);
</script>
<template>
  <section
    class="w-[calc(100%-40px)] max-w-[1440px] flex flex-col items-center"
  >
    <h2
      class="flex flex-col items-center text-5xl font-dnf text-point-500 relative mb-[62px]"
    >
      <TitleLeft
        class="w-[184px] h-10 absolute right-[calc(100%+28px)] bottom-0"
      />
      <span class="text-4xl">GAME</span>
      COMMUNITY
      <TitleRight
        class="w-[184px] h-10 absolute left-[calc(100%+28px)] bottom-0"
      />
    </h2>
    <ul class="w-full flex items-center gap-[18px] mb-[95px]">
      <li
        v-for="game in games"
        :key="game.id"
        class="flex-1 w-full max-w-[19%]"
      >
        <RouterLink
          :to="`/game/${game.name}`"
          class="flex flex-col flex-1 px-[30px] pt-[26px] pb-[19px] rounded-2xl transition-all bg-main-500 text-point-500 hover:bg-point-500 hover:text-main-500"
        >
          <div class="font-dnf text-2xl mb-1 truncate">
            {{ game.display_name }}
          </div>
          <div class="font-semibold text-sm">
            BEST SCORE : {{ gameTopRankers[game.name]?.score || 0 }}점
          </div>
          <div class="flex items-end justify-between">
            <div class="text-xs flex items-center gap-1">
              <CommentIcon />999+
            </div>
            <PlayIcon />
          </div>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
<style scoped></style>
