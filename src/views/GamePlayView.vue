<script setup>
import GameOverModal from "@/components/game-over/GameOverModal.vue";
import { ref } from "vue";

const isGameOver = ref(true);
</script>
<template>
  <!-- <h1 class="text-7xl font-bold font-dnf text-white">Game Play</h1> -->
  <div class="flex justify-center items-center h-screen">
    <section class="w-[1500px] h-[780px] bg-black rounded-3xl"></section>
  </div>
  <div
    v-if="isGameOver"
    class="fixed inset-0 flex justify-center items-center z-50"
  >
    <GameOverModal />
  </div>
</template>
<style scoped></style>
