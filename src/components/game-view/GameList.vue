<script>
import CommentIcon from "@/components/common/icons/CommentIcon.vue";
import PlayIcon from "@/components/common/icons/PlayIcon.vue";

export default {
  name: "GameList",
  components: {
    CommentIcon,
    PlayIcon,
  },
  data() {
    return {
      games: [
        {
          id: 1,
          name: "테트리스",
          route: "tetris",
          bestScore: 999,
        },
        {
          id: 2,
          name: "슈팅게임",
          route: "shooting",
          bestScore: 800,
        },
        {
          id: 3,
          name: "지뢰찾기",
          route: "minesweeper",
          bestScore: 750,
        },
        {
          id: 4,
          name: "바운스볼",
          route: "bounce-ball",
          bestScore: 600,
        },
      ],
    };
  },
};
</script>

<template>
  <div class="mt-[31px] w-[1075px] flex justify-between">
    <RouterLink
      v-for="game in games"
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
