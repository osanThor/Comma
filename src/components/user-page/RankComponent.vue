<script setup>
const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  playTime: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 0,
  },
});

// milisecond 로 오는 플레이타임을 hh:mm:ss 로 변경해서 미리 변수로 저장
const formattedTime = computed(() => {
  const totalSeconds = Math.floor(props.playTime / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const padZero = (num) => String(num).padStart(2, "0");

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
});
</script>

<template>
  <!-- 메인내용 들어갈 곳 -->
  <div class="max-w-[1000px]">
    <div class="h-20 rounded-full bg-[#19162B]/50 flex items-center pl-4 mt-4">
      <img
        src="/assets/images/icons/mineSweeper-icon.svg"
        class="w-[60px] h-[60px]"
      />
      <div class="flex-1 flex justify-center text-white text-2xl font-semibold">
        {{ name }}
      </div>
      <div class="flex-1 flex justify-center text-white text-lg font-semibold">
        {{ formattedTime }}
      </div>
      <div class="flex-1 flex justify-center text-white text-lg font-semibold">
        {{ rank }}등
      </div>
    </div>
  </div>
</template>
<style scoped></style>
