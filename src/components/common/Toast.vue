<script setup>
import { useToastStore } from "@/stores/toast";
import { twMerge } from "tailwind-merge";

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
      class="p-4 w-[calc(100vw-32px)] max-w-[300px] rounded-lg bg-white shadow-lg transition transform duration-300 flex items-center gap-4"
      @click="removeToast(toast.id)"
    >
      <span
        :class="
          twMerge(
            'w-3 min-w-3 h-3 rounded-full',
            toast.type === 'success' && 'bg-green-500 ',
            toast.type === 'error' && 'bg-red-500 ',
            toast.type === 'info' && 'bg-blue-500 '
          )
        "
      />
      {{ toast.message }}
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
