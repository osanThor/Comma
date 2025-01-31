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
import { formatPlayTime } from "@/classes/shooting/utils";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const isGameOverModalOpen = ref(true);
const isGameShareModalOpen = ref(false);
const imageBlobs = ref([]);

const gameScoreData = ref(null);
const filteredRankings = ref([]);

const route = useRoute();

const props = defineProps({
  playTime: {
    type: Number,
    required: true,
    default: 0,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  gameResult: {
    type: String,
  },
});

const localPlayTime = ref(props.playTime);
const localScore = ref(props.score);

const formattedPlayTime = computed(() => formatPlayTime(localPlayTime.value));
const formattedScore = computed(() => `${localScore.value}점`);

const getCurrentUserRanking = (gameRankingData, userId) => {
  const userRankings = gameRankingData.filter(
    (rank) => rank.user_id === userId
  );

  userRankings.sort(
    (a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
  );

  return userRankings.length > 0 ? userRankings[0] : null;
};

const filterRankingsForDisplay = (rankings, latestRanking) => {
  if (!latestRanking) return [];

  const rankMinusOne = rankings.find(
    (rank) => rank.rank === latestRanking.rank - 1
  );
  const rankPlusOne = rankings.find(
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
};
// 함수가 실행되면 게임 오버 화면이 캡쳐되고 GameShareModal이 열립니다.
const openGameShareModal = () => {
  const screenElement = document.querySelector(".capture");
  if (!screenElement) {
    console.error("캡처할 요소를 찾을 수 없습니다.");
    return;
  }

  html2canvas(screenElement, { useCORS: true, scale: 2, backgroundColor: null })
    .then((canvas) => {
      const imageData = canvas.toDataURL("image/jpeg");

      canvas.toBlob((blob) => {
        if (blob) {
          const fileName = `capture-${Date.now()}.jpeg`;
          const file = new File([blob], fileName, { type: blob.type });
          imageBlobs.value = [{ file, preview: imageData }];
          isGameOverModalOpen.value = false;
          isGameShareModalOpen.value = true;
        } else {
          console.error("Blob 생성 실패");
        }
      }, "image/jpeg");
    })
    .catch((error) => {
      console.error("캡처 실패:", error);
    });
};

const closeShareModalAndShowGameOver = () => {
  isGameShareModalOpen.value = false;
  isGameOverModalOpen.value = true;
};

const handleUploadImage = (newFile) => {
  imageBlobs.value = [newFile];
};

const handleRemoveImage = () => {
  imageBlobs.value = [];
};

const replayGame = () => {
  isGameOverModalOpen.value = false;
  window.location.reload();
};

onMounted(async () => {
  try {
    const gameId = await getGameByName(route.name);

    if (gameId.id) {
      const rankings = await getGameRanking(gameId.id);
      gameScoreData.value = rankings;

      const latestRanking = getCurrentUserRanking(rankings, user.value.id);

      if (latestRanking) {
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
    class="relative w-[530px] h-[748px] border-4 border-white rounded-[28px] bg-main-500"
  >
    <button
      class="absolute top-3 right-3 opacity-50 hover:opacity-100"
      @click="replayGame"
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
          class="w-[174px] h-[116px] bg-main-700 text-white flex flex-col first-line:justify-center items-center rounded-xl"
        >
          <h2 class="font-dnf text-xl mt-[22px]">TIME</h2>
          <p class="mt-3 font-pretendard font-medium text-lg opacity-80">
            {{ formattedPlayTime }}
          </p>
        </article>
        <article
          class="w-[174px] h-[116px] bg-main-700 text-white flex flex-col first-line:justify-center items-center rounded-xl"
        >
          <h2 class="font-dnf text-xl mt-[22px]">SCORE</h2>
          <p class="mt-3 font-pretendard font-medium text-lg opacity-80">
            {{ localScore }}점
          </p>
        </article>
      </section>
      <!-- RANKING -->
      <section class="h-[246px]">
        <h2 class="font-dnf text-2xl text-white flex justify-center mt-9">
          RANKING
        </h2>
        <div class="mt-[18px] space-y-[10px] flex flex-col items-center">
          <template v-for="rankData in filteredRankings" :key="rankData.id">
            <game-ranking-item
              v-if="!rankData.isLastPlace"
              :name="rankData.user.name"
              :score="rankData.score"
              :time="rankData.play_time"
              :rank="rankData.rank"
              :key="rankData.rank"
              :isHighlighted="rankData.isHighlighted"
              :game-result="gameResult"
            ></game-ranking-item>
            <game-ranking-item-last-place v-else></game-ranking-item-last-place>
          </template>
        </div>
      </section>
    </main>
    <section class="flex flex-col items-center mt-12">
      <div class="flex flex-row items-center gap-8">
        <after-game-over-button
          text="REPLAY"
          bg-color="bg-[#0A58CE]"
          @click="replayGame"
        ></after-game-over-button>
        <after-game-over-button
          text="SHARE"
          @click="openGameShareModal"
        ></after-game-over-button>
      </div>
    </section>
  </div>
  <div v-if="isGameShareModalOpen" class="z-50">
    <game-share-modal
      :imageBlobs="imageBlobs"
      :playTime="formattedPlayTime"
      :score="formattedScore"
      @uploadImage="handleUploadImage"
      @removeImage="handleRemoveImage"
      @close-share-modal="closeShareModalAndShowGameOver"
    ></game-share-modal>
  </div>
</template>
