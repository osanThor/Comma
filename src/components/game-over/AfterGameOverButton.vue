<script setup>
defineProps({
  type: {
    type: String,
    default: "button",
  },
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
    :type="type"
    :class="[
      'font-dnf text-2xl text-white w-[174px] h-[64px] rounded-xl',
      bgColor,
    ]"
  >
    {{ text }}
  </button>
</template>
