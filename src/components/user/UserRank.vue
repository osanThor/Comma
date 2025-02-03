<script setup>
import UserProfile from "./UserProfile.vue";
import RankComponent from "./RankComponent.vue";
import { getGameRanking, getGameScoreByUser } from "@/services/game.service";

const props = defineProps({
  userId: {
    type: String,
    default: "",
  },
  user: {
    type: Object,
    required: true,
  },
});

const userGames = ref([]);

const handleGetGameScoreByUser = async (userId) => {
  try {
    const data = await getGameScoreByUser(userId);
    if (data) {
      userGames.value = data;
    }
  } catch (err) {
    console.error(err);
  }
};

onBeforeMount(async () => {
  await handleGetGameScoreByUser(props.userId);
});

const rankings = ref([]);

const fetchRankings = async () => {
  try {
    const data = await Promise.all(
      userGames.value.map((game) => getGameRanking(game.game_id))
    );
    rankings.value = data.map((rankingArr) =>
      rankingArr.find((ranking) => ranking.user_id === props.userId)
    );
  } catch (err) {
    console.error(err);
  }
};

watch(userGames, async () => {
  await fetchRankings();
});
</script>
<template>
  <user-profile :user="user"></user-profile>
  <div
    v-if="!rankings.length"
    class="w-full flex items-center justify-center py-[200px] text-white/50 text-2xl font-bold"
  >
    플레이된 게임이 없습니다.
  </div>
  <div v-else class="flex-grow space-y-3 mt-[64px]">
    <rank-component v-for="item in rankings" :item="item"></rank-component>
  </div>
</template>
<style scoped></style>
