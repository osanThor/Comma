<script setup>
const props = defineProps({
  name: String,
  score: Number,
  time: Number,
  rank: Number,
  isHighlighted: {
    type: Boolean,
    default: false,
  },
});

function formatPlayTime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const millis = milliseconds % 1000;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}:${millis.toString().padStart(3, "0")}`;
}

const formatedName = computed(() => {
  return props.name.length > 4 ? props.name.substring(0, 4) + ".." : props.name;
});
</script>
<template>
  <div
    :class="[
      'relative flex items-center rounded-[10px]',
      isHighlighted
        ? 'bg-point-500 w-[362px] h-[62px] px-[26px]'
        : 'bg-main-400 w-[326px] h-14 px-6',
    ]"
  >
    <div
      v-if="!isHighlighted"
      class="absolute top-0 left-0 bg-main-400 bg-opacity-50 rounded-[10px] w-[326px] h-[56px]"
    ></div>
    <div
      :class="[
        'flex-shrink-0 flex justify-center items-center',
        isHighlighted ? 'w-[38px] h-[38px]' : 'w-8 h-8',
      ]"
    >
      <template v-if="rank <= 3">
        <img :src="`/assets/images/medal${rank}.png`" alt="Medal Image" />
      </template>
      <template v-else>
        <span class="font-dnf text-white text-xl">{{ rank }}</span>
      </template>
    </div>
    <div
      :class="[
        'flex-1 flex justify-between items-center',
        isHighlighted ? 'ml-12' : 'ml-10',
      ]"
    >
      <span class="font-dnf text-white text-sm">{{ formatedName }}</span>
      <span class="font-pretendard text-white text-xs">{{ score }}점</span>
      <span class="font-pretendard text-white text-xs">{{
        formatPlayTime(time)
      }}</span>
    </div>
  </div>
</template>
