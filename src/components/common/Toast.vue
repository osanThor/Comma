<script setup>
import { useToastStore } from "@/stores/toast";

const { toasts, removeToast } = useToastStore();
</script>
<template>
  <div class="fixed z-[999] bottom-7 right-7 flex flex-col gap-4">
    <div class="w-[calc(100vw-32px)] max-w-[300px] p-4 rounded-lg bg-white">
      성공
    </div>
  </div>
</template>
<style scoped></style>
