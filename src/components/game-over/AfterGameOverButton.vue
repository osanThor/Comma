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
  disabled: {
    type: Boolean,
  },
});
</script>
<template>
  <button
    :type="type"
    :class="[
      'font-dnf text-xl text-white w-[160px] h-[64px] rounded-xl',
      bgColor,
    ]"
    :disabled="disabled"
  >
    {{ text }}
  </button>
</template>
