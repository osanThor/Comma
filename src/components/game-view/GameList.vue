<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useGameStore } from "@/stores/test-game";
import { getPostsByCategory } from "@/services/post.service";
import CommentIcon from "@/components/common/icons/CommentIcon.vue";
import PlayIcon from "@/components/common/icons/PlayIcon.vue";

const route = useRoute();
const gameStore = useGameStore();

const postCounts = ref({
  bounceBall: 0,
  mineSweeper: 0,
  flappyBoo: 0,
  tetris: 0,
  shooting: 0,
});

const getPostCount = async (category) => {
  try {
    const data = await getPostsByCategory(category, "desc", 1, 1);
    if (data) {
      postCounts.value[category] = data.totalCount;
    }
  } catch (err) {
    console.error(`${category} 게시글 수 로딩 실패:`, err);
  }
};

onMounted(async () => {
  await gameStore.getGamesData();
  await gameStore.getGameTopRankers();
  // 각 게임별 게시글 수 로드
  await Promise.all([
    getPostCount("bounceBall"),
    getPostCount("mineSweeper"),
    getPostCount("flappyBoo"),
    getPostCount("tetris"),
    getPostCount("shooting"),
  ]);
});

const games = computed(() => {
  return gameStore.games.map((game) => ({
    id: game.id,
    name: game.display_name || game.name,
    route: game.name,
    bestScore: gameStore.gameTopRankers[game.name]?.score || 0,
  }));
});

const filteredGames = computed(() => {
  return games.value.filter((game) => game.route !== route.params.gameName);
});
const formatedScore = (score) => {
  return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>

<template>
  <div class="mt-[31px] w-full max-w-[1075px] flex justify-between gap-8">
    <router-link
      v-for="game in filteredGames"
      :key="game.id"
      :to="`/game/${game.route}`"
      class="flex-1 h-[129px] flex flex-col px-[30px] pt-[23.4px] pb-[17.1px] pl-[27px] pr-[19.8px] rounded-2xl transition-all bg-main-500 text-point-500 hover:bg-point-500 hover:text-main-500"
    >
      <div class="font-dnf text-[21.6px] mb-[4.1px] truncate">
        {{ game.name }}
      </div>
      <div class="font-semibold text-[12.6px]">
        BEST SCORE : {{ formatedScore(game.bestScore) }}점
      </div>
      <div class="flex items-end justify-between">
        <div class="text-[10.8px] flex items-center gap-1">
          <comment-icon></comment-icon>{{ postCounts[game.route] }}
        </div>
        <play-icon class="w-[38.7px] h-[38.7px]"></play-icon>
      </div>
    </router-link>
  </div>
</template>
