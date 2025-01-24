<script setup>
import UserProfile from "./UserProfile.vue";
import RankComponent from "./RankComponent.vue";
import { getGameScoreByUser } from "@/services/game.service";
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
const handleGetGameScoreByUser = async (targetId) => {
  try {
    const data = await getGameScoreByUser(targetId);
    console.log(data);
    if (data) {
      // console.log(345);
    }
  } catch (err) {
    console.error(err);
  }
};

onBeforeMount(async () => {
  await handleGetGameScoreByUser("7dfc8ce0-9678-4b15-aace-54b57e052b12");
});
</script>
<template>
  <user-profile :user="user"></user-profile>
  <div class="space-y-3 mt-[74px]">
    <RankComponent name="플래피 버드" rank="1" playTime="360000" />
    <RankComponent name="슈팅게임" rank="5" playTime="3600000" />
    <RankComponent name="바운스 볼" rank="17" playTime="180000" />
    <RankComponent name="테트리스" rank="9" playTime="452684531" />
    <RankComponent name="지뢰찾기" rank="245" playTime="3321875" />
  </div>
</template>
<style scoped></style>
