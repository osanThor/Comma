<script setup>
import Avatar from "@/components/common/Avatar.vue";
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import { getUserById } from "@/services/user.service";
const router = useRouter();
const authStore = useAuthStore();
const { user: userInfo } = storeToRefs(authStore);
import { getGameRanking, getGameScoreByUser } from "@/services/game.service";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

function navigateToEdit() {
  router.push("/user/edit"); // Navigate to /user/edit
}

const formatedBio = computed(
  () =>
    props.user.bio ||
    "아직 자기소개를 작성하지 않으셨습니다. 자기소개를 작성해주세요"
);

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
  await handleGetGameScoreByUser(props.user.id);
});

const playTime = ref(0);

const fetchRankings = async () => {
  try {
    const data = await Promise.all(
      userGames.value.map((game) => getGameRanking(game.game_id))
    );
    const ranks = data.map((rankingArr) =>
      rankingArr.find((ranking) => ranking.user_id === props.user.id)
    );
    ranks.forEach((rank) => {
      playTime.value = playTime.value + rank.total_play_time;
    });
  } catch (err) {
    console.error(err);
  }
};
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000); // 총 초
  const hours = Math.floor(totalSeconds / 3600); // 시간
  const minutes = Math.floor((totalSeconds % 3600) / 60); // 분
  const seconds = totalSeconds % 60; // 초
  const millis = Math.floor(milliseconds % 1000); // 밀리초

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}:${String(millis).padStart(3, "0")}`;
}

watch(userGames, async () => {
  await fetchRankings();
});

const totalPlayTime = computed(() => formatTime(playTime.value));
</script>
<template>
  <!-- Profile Section -->
  <div class="flex items-center">
    <div class="relative mr-[78px]">
      <avatar :src="user.profile_image" size="xl"></avatar>
      <div
        v-if="userInfo.id === user.id"
        class="absolute bottom-[7px] right-[6px] bg-point-500 rounded-full w-[39px] h-[39px] flex items-center justify-center overflow-hidden cursor-pointer transform transition-transform duration-100 ease-in-out hover:scale-125"
        @click="navigateToEdit"
      >
        <img
          class="w-[16px] hover:color-main-500"
          src="/assets/images/icons/editProfile-icon.svg"
          alt="수정"
        />
      </div>
    </div>
    <div class="flex flex-col items-start">
      <div class="flex flex-wrap">
        <h2 class="text-white font-bold font-dnf text-[30px] mr-[8px]">
          {{ user.name }}
        </h2>
        <span class="text-gray-400 self-end mb-1 text-sm">{{
          user.email
        }}</span>
      </div>
      <h2 class="text-gray-300 text-[16px] h-8 mt-[5px] mb-3">
        {{ formatedBio }}
      </h2>
      <div
        class="mt-2 bg-point-500/40 text-white min-h-[38px] px-3.5 py-1 rounded-xl text-base font-semibold flex items-center justify-center text-center"
      >
        총 플레이 시간 | {{ totalPlayTime }}
      </div>
    </div>
  </div>
</template>
<style scoped></style>
