<script setup>
import { useToastStore } from "@/stores/toast";
import { twMerge } from "tailwind-merge";
import CommaIcon from "./icons/CommaIcon.vue";

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);
</script>
<template>
  <transition-group
    name="toast"
    tag="div"
    class="fixed z-[99999] bottom-10 right-7 flex flex-col gap-2"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="
        twMerge(
          'w-[calc(100vw-32px)] max-w-[470px] rounded-xl border-2 px-10 py-[24px] text-white font-dnf border-white shadow-lg transition transform duration-300 backdrop-blur-sm flex justify-center items-center gap-2',
          toast.type === 'success' && 'bg-point-500/30',
          toast.type === 'error' && 'bg-[#0A90CE]/30'
        )
      "
    >
      <comma-icon></comma-icon>
      :
      {{ toast.message
      }}{{ toast.type === "success" ? " ♡(*´ ˘ `*)♡" : " (っ°´o`°ｃ)" }}
    </div>
  </transition-group>
</template>
<style scoped>
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.toast-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.toast-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
