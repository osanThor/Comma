<script setup>
import GameOverModal from "@/components/game-over/GameOverModal.vue";
import { ref } from "vue";

const isGameOver = ref(false);

const openGameOver = (score, playTime) => {
  isGameOver.value = true;
};
const closeGameOver = () => {
  isGameOver.value = false;
};
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
        <game-over-modal />
      </div>
    </section>
  </div>
</template>
