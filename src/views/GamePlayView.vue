<script setup>
import GameOverModal from "@/components/game-over/GameOverModal.vue";
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { getGameByName, updateGameScore } from "@/services/game.service";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const category = ref("");
const route = useRoute();

const playTime = ref(0);
const score = ref(0);

const isGameOver = ref(false);

async function openGameOver(currentScore, currentPlayTime) {
  try {
    score.value = currentScore;
    playTime.value = currentPlayTime;

    const gameId = await getGameByName(route.name);

    await updateGameScore(
      gameId.id,
      user.value.id,
      score.value,
      playTime.value
    );

    isGameOver.value = true;
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  category.value = route.name;
});
</script>
<template>
  <div
    class="w-full flex justify-center items-center h-screen pt-[16.666vh] pb-[11.111vh]"
  >
    <section
      class="w-[calc(100%-40px)] max-w-[1300px] h-[700px] bg-black flex items-center justify-center rounded-3xl overflow-hidden capture"
    >
      <router-view @open-game-over="openGameOver"></router-view>
      <div
        v-if="isGameOver"
        class="fixed inset-0 flex justify-center items-center z-50"
      >
        <game-over-modal :play-time="playTime" :score="score"></game-over-modal>
      </div>
    </section>
  </div>
</template>
