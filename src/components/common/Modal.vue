<script setup>
import { useModalStore } from "@/stores/modal";

const modalBgRef = ref(null);

const modalStore = useModalStore();
const { isOpen, modalOptions } = storeToRefs(modalStore);
const { closeModal } = modalStore;

const handleClickBg = (e) => {
  if (modalBgRef.value && modalBgRef.value === e.target) closeModal();
};

const handleClickButton = () => {
  modalOptions.value.handler();
  closeModal();
};
</script>
<template>
  <div
    v-if="isOpen"
    ref="modalBgRef"
    class="fixed top-0 left-0 bottom-0 right-0 bg-main-500/50 backdrop-blur-sm flex items-center justify-center z-[999999]"
    @click.prevent="handleClickBg($event)"
  >
    <div
      class="w-[calc(100%-32px)] max-w-[472px] flex flex-col items-center font-dnf text-white p-6 bg-main-500/80 border-2 border-white rounded-xl"
    >
      <div class="text-xl mb-3">｡°(っ°´o`°ｃ)°｡</div>
      <div
        class="text-lg mb-6 text-center max-w-[320px] break-keep whitespace-pre-line"
      >
        {{ modalOptions.message }}
      </div>
      <div class="flex items-center justify-center gap-6 text-lg">
        <button
          @click="handleClickButton"
          class="p-1 w-[140px] h-[50px] rounded-lg bg-main-400 hover:bg-main-300"
        >
          {{ modalOptions.btnTxt }}
        </button>
        <button
          v-if="modalOptions.type !== 'alert'"
          @click="closeModal"
          class="p-1 w-[140px] h-[50px] rounded-lg bg-point-500 hover:bg-point-400"
        >
          돌아가기
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
