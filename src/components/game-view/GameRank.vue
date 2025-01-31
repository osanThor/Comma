<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { getGameRanking } from "@/services/game.service";
import rank1st from "/assets/images/medal1.png";
import rank2nd from "/assets/images/medal2.png";
import rank3rd from "/assets/images/medal3.png";

// 라우트 정보 가져오기
const route = useRoute();

// 랭킹 데이터, 로딩 상태, 에러 상태 관리
const rankData = ref([]);
const isLoading = ref(true);
const error = ref(null);

// 게임 이름과 ID 매핑
const gameIdMap = {
  shooting: "84def04e-5b48-4ea4-ac2d-73ff8d4de2bc",
  bounceball: "93c1daf7-5b81-4763-b4d2-24fbaf5d8927",
  flappyboo: "ad2e1675-f09c-4f4d-95fe-97e9a009bd9f",
  tetris: "9ce4366d-7bd4-489e-a115-15988141af19",
  minesweeper: "3fee33bb-0a86-4c0a-b05b-f27038555b16",
};

// 랭킹 데이터 로드 함수
const loadRankingData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const displayName = route.params.gameName;
    const gameId = gameIdMap[displayName.toLowerCase()];

    if (!gameId) {
      throw new Error("유효하지 않은 게임입니다");
    }

    const data = await getGameRanking(gameId, "desc");
    rankData.value = data.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  } catch (error) {
    console.error("랭킹 데이터 로딩 실패:", error);
    error.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

// 컴포넌트가 마운트될 때 랭킹 데이터 로드
onMounted(() => {
  loadRankingData();
});

// route.params.gameName 변경 감지하여 랭킹 데이터 로드
watch(
  () => route.params.gameName,
  () => {
    loadRankingData();
  }
);

// 랭킹 이미지 가져오기 함수
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
    class="mt-[82px] pt-[29px] max-h-[874px] flex-1 max-w-[325px] bg-main-600 rounded-2xl flex flex-col items-center"
  >
    <h2 class="font-dnf text-white text-2xl mb-[8px] flex items-center gap-2">
      <img src="/assets/images/ranking.png?url" alt="ranking" class="w-6 h-6" />
      RANKING
    </h2>

    <!-- 로딩 상태 표시 -->
    <div v-if="isLoading" class="text-white"></div>
    <!-- 에러 상태 표시 -->
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <!-- 랭킹 리스트 표시 -->
    <div v-else class="mt-[20px] flex flex-col gap-[12px]">
      <router-link
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
          <!-- 랭킹 1, 2, 3등 이미지 표시 -->
          <template v-if="item.rank <= 3">
            <img
              :src="getRankImage(item.rank)"
              :alt="`${item.rank}st`"
              class="w-[42px] h-[39px] mr-[17px]"
            />
          </template>
          <!-- 나머지 랭킹 숫자 표시 -->
          <template v-else>
            <span
              class="font-dnf text-xl text-white flex items-center"
              :class="{
                'ml-[13px]': item.rank > 3,
                'ml-[8px]': item.rank === 10,
              }"
              >{{ item.rank }}</span
            >
          </template>
          <!-- 사용자 이름 표시 -->
          <span
            class="font-dnf text-base text-white block max-w-[80px] truncate overflow-hidden uppercase"
            :class="{
              'ml-[30px]': item.rank <= 3,
              'ml-[30px]': item.rank > 3 && item.rank !== 10,
              'ml-[24px]': item.rank === 10,
            }"
          >
            {{ item.user.name }}
          </span>
          <!-- 점수 표시 -->
          <div class="w-[60px] text-right">
            <span class="text-sm text-white">{{ item.score }}점</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>
