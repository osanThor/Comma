<script setup>
import { getGameByName, getGameRanking } from "@/services/game.service";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import AfterGameOverButton from "./AfterGameOverButton.vue";
import GameRankingItem from "./GameRankingItem.vue";
import GameShareModal from "./GameShareModal.vue";
import GameRankingItemLastPlace from "./GameRankingItemLastPlace.vue";
import html2canvas from "html2canvas";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const isGameOverModalOpen = ref(true);
const isGameShareModalOpen = ref(false);

const playTime = ref("00:00:00");
const score = ref(0);
const imageBlobs = ref([]);

const gameScoreData = ref(null);
const filteredRankings = ref([]);

const route = useRoute();

function formatPlayTime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const millis = milliseconds % 1000;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}:${millis.toString().padStart(2, "0")}`;
}

function getCurrentUserRanking(gameRankingData, userId) {
  const userRankings = gameRankingData.filter(
    (rank) => rank.user_id === userId
  );

  userRankings.sort(
    (a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
  );

  return userRankings.length > 0 ? userRankings[0] : null;
}

function filterRankingsForDisplay(rankings, latestRanking) {
  if (!latestRanking) return [];

  const rankMinusOne = rankings.find(
    (rank) => rank.rank === latestRanking.rank - 1
  );
  let rankPlusOne = rankings.find(
    (rank) => rank.rank === latestRanking.rank + 1
  );

  if (!rankPlusOne) {
    return [
      rankMinusOne,
      { ...latestRanking, isHighlighted: true },
      { isLastPlace: true },
    ].filter(Boolean);
  }

  return [
    rankMinusOne,
    { ...latestRanking, isHighlighted: true },
    rankPlusOne,
  ].filter(Boolean);
}
// 함수가 실행되면 게임 오버 화면이 캡쳐되고 GameShareModal이 열립니다.
function openGameShareModal() {
  const screenElement = document.querySelector(".capture");
  if (!screenElement) {
    console.error("캡처할 요소를 찾을 수 없습니다.");
    return;
  }

  html2canvas(screenElement, { useCORS: true, scale: 2, backgroundColor: null })
    .then((canvas) => {
      const imageData = canvas.toDataURL("image/png");

      canvas.toBlob((blob) => {
        if (blob) {
          const fileName = `capture-${Date.now()}.png`;
          const file = new File([blob], fileName, { type: blob.type });
          imageBlobs.value = [{ file, preview: imageData }];
          isGameOverModalOpen.value = false;
          isGameShareModalOpen.value = true;
        } else {
          console.error("Blob 생성 실패");
        }
      }, "image/png");
    })
    .catch((error) => {
      console.error("캡처 실패:", error);
    });
}

const handleUploadImage = (newFile) => {
  imageBlobs.value = [newFile];
};

const handleRemoveImage = () => {
  imageBlobs.value = [];
};

function closeGameOverModal() {
  isGameOverModalOpen.value = false;
}

function replayGame() {
  isGameOverModalOpen.value = false;
  window.location.reload();
}

onMounted(async () => {
  try {
    const gameId = await getGameByName(route.params.gameName);

    if (gameId.id) {
      const rankings = await getGameRanking(gameId.id);
      gameScoreData.value = rankings;

      const latestRanking = getCurrentUserRanking(rankings, user.value.id);

      if (latestRanking) {
        score.value = latestRanking.score;
        playTime.value = formatPlayTime(latestRanking.play_time);
        filteredRankings.value = filterRankingsForDisplay(
          rankings,
          latestRanking
        );
      }
    } else {
      console.error("게임 ID를 가져올 수 없습니다.");
    }
  } catch (error) {
    console.error("onMounted 실행 중 오류 발생:", error);
  }
});
</script>
<template>
  <div
    v-if="isGameOverModalOpen"
    class="relative w-[538px] h-[754px] border-4 border-white rounded-[28px] bg-main-500"
  >
    <button
      class="absolute top-[22px] right-[22px]"
      @click="closeGameOverModal"
    >
      <img src="/assets/images/icons/close-icon.svg" alt="닫기" />
    </button>
    <header class="mt-[64px] flex justify-center">
      <h1 class="text-[44px] text-point-500 font-dnf">!! GAME OVER !!</h1>
    </header>

    <main>
      <!-- TIME / SCORE -->
      <section class="mx-[82px] mt-7 flex flex-row justify-between">
        <article
          class="w-[174px] h-[122px] bg-main-700 text-white flex flex-col first-line:justify-center items-center rounded-xl"
        >
          <h2 class="font-dnf text-2xl mt-[22px]">TIME</h2>
          <p class="mt-3 font-pretendard font-medium text-xl opacity-80">
            {{ playTime }}
          </p>
        </article>
        <article
          class="w-[174px] h-[122px] bg-main-700 text-white flex flex-col first-line:justify-center items-center rounded-xl"
        >
          <h2 class="font-dnf text-2xl mt-[22px]">SCORE</h2>
          <p class="mt-3 font-pretendard font-medium text-xl opacity-80">
            {{ score }}점
          </p>
        </article>
      </section>
      <!-- RANKING -->
      <section class="h-[246px]">
        <h2 class="font-dnf text-2xl text-white flex justify-center mt-12">
          RANKING
        </h2>
        <div class="mt-[18px] space-y-[10px] flex flex-col items-center">
          <template v-for="(rankData, index) in filteredRankings" :key="index">
            <GameRankingItem
              v-if="!rankData.isLastPlace"
              :name="rankData.user.name"
              :score="rankData.score"
              :time="rankData.play_time"
              :rank="rankData.rank"
              :key="rankData.rank"
              :isHighlighted="rankData.isHighlighted"
            />
            <GameRankingItemLastPlace v-else />
          </template>
        </div>
      </section>
    </main>
    <footer class="flex justify-between mx-[82px] mt-[56px]">
      <AfterGameOverButton
        text="REPLAY"
        bg-color="bg-[#0A58CE]"
        @click="replayGame"
      />
      <AfterGameOverButton text="SHARE" @click="openGameShareModal" />
    </footer>
  </div>
  <div v-if="isGameShareModalOpen">
    <GameShareModal
      :imageBlobs="imageBlobs"
      :playTime="playTime"
      :score="score"
      @uploadImage="handleUploadImage"
      @removeImage="handleRemoveImage"
    />
  </div>
</template>
