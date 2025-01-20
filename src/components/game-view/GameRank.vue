<script setup>
import { ref } from "vue";
import rank1st from "/assets/images/rank_1st.png";
import rank2nd from "/assets/images/rank_2nd.png";
import rank3rd from "/assets/images/rank_3rd.png";

const rankData = ref([
  {
    id: "1",
    rank: 1,
    user_id: "싹싹이",
    game_id: "tetris",
    score: 9999,
    play_time: 300,
    total_play_time: 3600,
    create_at: "2024-01-20T12:00:00",
    updated_at: null,
  },
  {
    id: "2",
    rank: 2,
    user_id: "이준영",
    game_id: "tetris",
    score: 9900,
    play_time: 280,
    total_play_time: 3200,
    create_at: "2024-01-20T11:00:00",
    updated_at: null,
  },
  {
    id: "3",
    rank: 3,
    user_id: "e1a4",
    game_id: "tetris",
    score: 9900,
    play_time: 280,
    total_play_time: 3200,
    create_at: "2024-01-20T11:00:00",
    updated_at: null,
  },
  {
    id: "4",
    rank: 4,
    user_id: "gjwjdals96",
    game_id: "tetris",
    score: 8123,
    play_time: 200,
    total_play_time: 2400,
    create_at: "2024-01-20T10:00:00",
    updated_at: null,
  },
  {
    id: "5",
    rank: 5,
    user_id: "싹싹김치",
    game_id: "tetris",
    score: 7133,
    play_time: 200,
    total_play_time: 2400,
    create_at: "2024-01-20T10:00:00",
    updated_at: null,
  },
  {
    id: "6",
    rank: 6,
    user_id: "감자",
    game_id: "tetris",
    score: 6234,
    play_time: 200,
    total_play_time: 2400,
    create_at: "2024-01-20T10:00:00",
    updated_at: null,
  },
  {
    id: "7",
    rank: 7,
    user_id: "comma",
    game_id: "tetris",
    score: 5223,
    play_time: 200,
    total_play_time: 2400,
    create_at: "2024-01-20T10:00:00",
    updated_at: null,
  },
  {
    id: "8",
    rank: 8,
    user_id: "저녁메뉴추천좀",
    game_id: "tetris",
    score: 4897,
    play_time: 200,
    total_play_time: 2400,
    create_at: "2024-01-20T10:00:00",
    updated_at: null,
  },
  {
    id: "9",
    rank: 9,
    user_id: "랄랄라라라라라",
    game_id: "tetris",
    score: 1212,
    play_time: 200,
    total_play_time: 2400,
    create_at: "2024-01-20T10:00:00",
    updated_at: null,
  },
  {
    id: "10",
    rank: 10,
    user_id: "랄랄라",
    game_id: "tetris",
    score: 1089,
    play_time: 200,
    total_play_time: 2400,
    create_at: "2024-01-20T10:00:00",
    updated_at: null,
  },
]);
const getRankImage = (rank) => {
  switch (rank) {
    case 1:
      return rank1st;
    case 2:
      return rank2nd;
    case 3:
      return rank3rd;
    default:
      return null;
  }
};
</script>

<template>
  <div
    class="mt-[82px] pt-[29px] h-[874px] w-[325px] bg-main-600 rounded-2xl flex flex-col items-center"
  >
    <h2 class="font-dnf text-white text-2xl mb-[8px] flex items-center gap-2">
      <img src="/assets/images/ranking.png?url" alt="ranking" class="w-6 h-6" />
      RANKING
    </h2>
    <div class="mt-[20px] flex flex-col gap-[12px]">
      <RouterLink
        v-for="item in rankData"
        :key="item.id"
        :to="`/user/${item.user_id}`"
        class="block"
      >
        <div
          class="w-[272px] h-[65px] rounded-[12px] pl-[20px] pr-[19px] py-[13px] flex items-center justify-between"
          :class="{
            'bg-point-500': item.rank === 1,
            'bg-point-600': item.rank === 2,
            'bg-point-700': item.rank === 3,
            'bg-main-500': item.rank > 3,
          }"
        >
          <template v-if="item.rank <= 3">
            <img
              :src="getRankImage(item.rank)"
              :alt="`${item.rank}st`"
              class="w-[42px] h-[39px]"
            />
          </template>
          <template v-else>
            <span
              class="font-dnf text-xl text-white flex items-center"
              :class="{
                'ml-[13px]': item.rank > 3,
                'ml-[4.8px]': item.rank === 10,
              }"
              >{{ item.rank }}</span
            >
          </template>
          <span
            class="font-dnf text-base text-white block max-w-[80px] truncate overflow-hidden uppercase"
            :class="{
              'ml-[13px]': item.rank > 3,
              'ml-[6.8px]': item.rank === 10,
            }"
          >
            {{ item.user_id }}
          </span>
          <span class="text-sm text-white flex items-center"
            >{{ item.score }}점</span
          >
        </div>
      </RouterLink>
    </div>
  </div>
</template>
