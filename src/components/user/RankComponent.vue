<script setup>
import Avatar from "@/components/common/Avatar.vue";
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

// milisecond 로 오는 플레이타임을 hh:mm:ss 로 변경해서 미리 변수로 저장
const formattedTime = computed(() => {
  const totalSeconds = Math.floor(props.item.play_time / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const padZero = (num) => String(num).padStart(2, "0");

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
});

const formatedScore = computed(() => {
  return props.item.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});
</script>

<template>
  <!-- 메인내용 들어갈 곳 -->
  <div class="w-full max-w-[1000px]">
    <router-link
      :to="`/game/${item.game.name}`"
      class="py-2 rounded-full bg-[#19162B]/50 flex items-center pl-4"
    >
      <avatar
        :src="`/assets/images/game/profile/${item.game.name}.jpg`"
        :alt="item.game.name"
      ></avatar>
      <div class="flex-1 flex justify-center text-white text-lg font-semibold">
        {{ item.game.display_name }}
      </div>
      <div
        class="flex-1 flex justify-center text-white text-base font-semibold opacity-70"
      >
        {{ formatedScore }}점
      </div>
      <div
        class="flex-1 flex justify-center text-white text-base font-semibold opacity-70"
      >
        {{ formattedTime }}
      </div>
      <div
        class="flex-1 flex justify-center text-white text-base font-semibold"
      >
        {{ item.rank }}등
      </div>
    </router-link>
  </div>
</template>
<style scoped></style>
