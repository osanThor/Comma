<script setup>
import { useGameStore } from "@/stores/test-game";

const gameStore = useGameStore();
const { gameTopRankers } = storeToRefs(gameStore);
const items = computed(() => Object.values(gameTopRankers.value));

const animationMarquee = (selector, speed) => {
  const parentSelector = document.querySelector(selector);
  const clone = parentSelector.innerHTML;
  const firstElement = parentSelector.firstElementChild;
  let i = 0;
  parentSelector.insertAdjacentHTML("beforeend", clone);
  parentSelector.insertAdjacentHTML("beforeend", clone);

  const moveItem = () => {
    firstElement.style.marginLeft = `-${i}px`;
    if (i > firstElement.clientWidth) i = 0;
    i += speed;
    requestAnimationFrame(moveItem);
  };
  requestAnimationFrame(moveItem);
};

onMounted(async () => {
  await gameStore.getGameTopRankers();
});
onMounted(() => {
  animationMarquee("#marquee", 0.5);
});
</script>
<template>
  <div id="marquee" class="w-full bg-main-500/50 h-[50px] flex items-center">
    <ul class="flex gap-[248px] text-sm font-dnf text-white pr-[248px]">
      <li class="whitespace-nowrap" v-for="item in items" :key="item">
        🎉 {{ item.user.name }}님이 [{{ item.game.display_name }}] 신기록에
        달성하셨습니다.
      </li>
    </ul>
  </div>
</template>
<style scoped></style>
