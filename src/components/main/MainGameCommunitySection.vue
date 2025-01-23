<script setup>
import TitleLeft from "@/components/common/icons/TitleLeft.vue";
import TitleRight from "@/components/common/icons/TitleRight.vue";
import PlayIcon from "@/components/common/icons/PlayIcon.vue";
import CommentIcon from "@/components/common/icons/CommentIcon.vue";
import { useGameStore } from "@/stores/test-game";
import { getPostsByCategory } from "@/services/post.service";

const gameStore = useGameStore();
const { games, gameTopRankers } = storeToRefs(gameStore);

const postCounts = ref({
  bounceBall: 0,
  mineSweeper: 0,
  flappyBird: 0,
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
  // 각 게임별 게시글 수 로드
  await Promise.all(
    Object.keys(postCounts.value).map((name) => getPostCount(name))
  );
});
</script>
<template>
  <section
    class="w-[calc(100%-40px)] max-w-[1440px] flex flex-col items-center"
  >
    <h2
      class="flex flex-col items-center text-5xl font-dnf text-point-500 relative mb-[62px]"
    >
      <title-left
        class="w-[184px] h-10 absolute right-[calc(100%+28px)] bottom-0"
      ></title-left>
      <span class="text-4xl">GAME</span>
      COMMUNITY
      <title-right
        class="w-[184px] h-10 absolute left-[calc(100%+28px)] bottom-0"
      ></title-right>
    </h2>
    <ul class="w-full flex items-center gap-[18px] mb-[95px]">
      <li
        v-for="game in games"
        :key="game.id"
        class="flex-1 w-full max-w-[19%]"
      >
        <router-link
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
              <comment-icon></comment-icon>
              {{ postCounts[game.name] > 999 ? "999+" : postCounts[game.name] }}
            </div>
            <play-icon></play-icon>
          </div>
        </router-link>
      </li>
    </ul>
  </section>
</template>
<style scoped></style>
