<script setup>
defineProps({
  text: {
    type: String,
  },
  bgColor: {
    type: String,
    default: "bg-point-500",
  },
});
</script>
<template>
  <button
    class="font-dnf text-2xl text-white w-[174px] h-[64px] rounded-xl"
    :class="[bgColor]"
  >
    {{ text }}
  </button>
</template>
<style scoped></style>
