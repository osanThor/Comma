<script setup>
import AfterGameOverButton from "./AfterGameOverButton.vue";
import GameRankingItem from "./GameRankingItem.vue";
import GameShareModal from "./GameShareModal.vue";
import { ref } from "vue";

const isGameOverModalOpen = ref(true);
const isGameShareModalOpen = ref(false);

function openGameShareModal() {
  isGameOverModalOpen.value = false;
  isGameShareModalOpen.value = true;
}

function closeGameOverModal() {
  isGameOverModalOpen.value = false;
}
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
      <img
        src="/assets/images/icons/close-icon.svg"
        alt="close game over modal"
      />
    </button>
    <header class="mt-[64px] flex justify-center">
      <h1 class="text-[44px] text-point-500 font-dnf">!! GAME OVER !!</h1>
    </header>
    <main>
      <section class="mx-[82px] mt-7 flex flex-row justify-between">
        <article
          class="w-[174px] h-[122px] bg-main-700 text-white flex flex-col first-line:justify-center items-center rounded-xl"
        >
          <!-- todo 폰트 레귤러로 -->
          <h2 class="font-dnf text-2xl mt-[22px]">TIME</h2>
          <!-- todo 게임 플레이 시간 가져오기 -->
          <p class="mt-3 font-pretendard font-medium text-xl opacity-80">
            01:00:00
          </p>
        </article>
        <article
          class="w-[174px] h-[122px] bg-main-700 text-white flex flex-col first-line:justify-center items-center rounded-xl"
        >
          <!-- todo 폰트 레귤러로 -->
          <h2 class="font-dnf text-2xl mt-[22px]">SCORE</h2>
          <!-- todo score 가져오기 -->
          <p class="mt-3 font-pretendard font-medium text-xl opacity-80">
            9999점
          </p>
        </article>
      </section>

      <section class="h-[246px]">
        <h2 class="font-dnf text-2xl text-white flex justify-center mt-12">
          RANKING
        </h2>
        <!-- todo 랭킹 만들고 스크롤 이벤트 주기 -->
        <div class="mt-[18px] space-y-[10px] flex flex-col items-center">
          <GameRankingItem name="싹싹이" score="999" time="01:00:03" rank="1" />
          <GameRankingItem
            name="이준영"
            score="990"
            time="01:00:05"
            rank="2"
            isHighlighted
          />
          <GameRankingItem name="랄랄라" score="934" time="01:30:32" rank="3" />
        </div>
      </section>
    </main>

    <footer class="flex justify-between mx-[82px] mt-[56px]">
      <!-- todo 버튼 타입 맞나 확인 -->
      <AfterGameOverButton text="REPLAY" bg-color="bg-[#0A58CE]" />
      <AfterGameOverButton text="SHARE" @click="openGameShareModal" />
    </footer>
  </div>
  <div v-if="isGameShareModalOpen">
    <GameShareModal />
  </div>
</template>
<style scoped></style>
