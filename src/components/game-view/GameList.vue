<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGameStore } from "@/stores/test-game";
import CommentIcon from "@/components/common/icons/CommentIcon.vue";
import PlayIcon from "@/components/common/icons/PlayIcon.vue";

const gameNameMap = {
  mineSweeper: "지뢰 찾기",
  tetris: "테트리스",
  bounceBall: "바운스 볼",
  flappyBird: "플래피 버드",
  shooting: "슈팅게임",
};

const route = useRoute();
const gameStore = useGameStore();

onMounted(async () => {
  await gameStore.getGamesData();
  await gameStore.getGameTopRankers();
});

const games = computed(() => {
  return gameStore.games.map((game) => ({
    id: game.id,
    name: gameNameMap[game.name] || game.name,
    route: game.name,
    bestScore: gameStore.gameTopRankers[game.name]?.score || 0,
  }));
});

const filteredGames = computed(() => {
  return games.value.filter((game) => game.route !== route.params.gameName);
});
</script>

<template>
  <div class="mt-[31px] w-[1075px] flex justify-between">
    <RouterLink
      v-for="game in filteredGames"
      :key="game.id"
      :to="`/game/${game.route}`"
      class="w-[244.8px] h-[129px] flex flex-col px-[30px] pt-[23.4px] pb-[17.1px] pl-[27px] pr-[19.8px] rounded-2xl transition-all bg-main-500 text-point-500 hover:bg-point-500 hover:text-main-500"
    >
      <div class="font-dnf text-[21.6px] mb-[4.1px] truncate">
        {{ game.name }}
      </div>
      <div class="font-semibold text-[12.6px]">
        BEST SCORE : {{ game.bestScore }}점
      </div>
      <div class="flex items-end justify-between">
        <div class="text-[10.8px] flex items-center gap-1">
          <CommentIcon />999+
        </div>
        <PlayIcon class="w-[38.7px] h-[38.7px]" />
      </div>
    </RouterLink>
  </div>
</template>
