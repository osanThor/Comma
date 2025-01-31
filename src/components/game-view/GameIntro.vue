<script setup>
defineProps({
  intro: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div
    class="h-[108px] w-[287px] bg-main-600 text-sm text-white text-center rounded-2xl pt-[27px] pr-[18px] pb-[19px] pl-[19px] items-center justify-center mb-[38px] whitespace-pre-line"
  >
    {{ intro }}
  </div>
</template>
