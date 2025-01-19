<script setup>
defineProps({
  name: String,
  score: Number,
  time: String,
  rank: Number,
  isHighlighted: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <div
    :class="[
      'relative flex items-center px-6 rounded-[10px]',
      isHighlighted
        ? 'bg-point-500 w-[362px] h-[62px]'
        : 'bg-main-400 w-[326px] h-[56px]',
    ]"
  >
    <div
      v-if="!isHighlighted"
      class="absolute top-0 left-0 bg-main-400 bg-opacity-50 rounded-[10px] w-[326px] h-[56px]"
    ></div>
    <div
      :class="[
        'flex-shrink-0',
        isHighlighted ? 'w-[38px] h-[38px]' : 'w-[32px] h-[32px]',
      ]"
    >
      <img :src="`/assets/images/medal${rank}.png`" alt="Medal Image" />
    </div>
    <div
      :class="[
        'flex-1 flex justify-between items-center',
        isHighlighted ? 'ml-12' : 'ml-10',
      ]"
    >
      <span class="font-dnf text-white text-sm">{{ name }}</span>
      <span class="font-pretendard text-white text-xs">{{ score }}점</span>
      <span class="font-pretendard text-white text-xs">{{ time }}</span>
    </div>
  </div>
</template>
<style scoped></style>
