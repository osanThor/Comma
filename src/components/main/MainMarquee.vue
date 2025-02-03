<script setup>
import { useGameStore } from "@/stores/test-game";

const section = ref(null);

const gameStore = useGameStore();
const { games, gameTopRankers } = storeToRefs(gameStore);
const rankItems = computed(() => {
  return Object.values(gameTopRankers.value)
    .filter((ranker) => ranker !== null)
    .map((item) => {
      return {
        user: item?.user ?? "Unknown User",
        game: item?.game ?? { display_name: "Unknown Game" },
      };
    });
});

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

watch(games, async () => {
  if (games.value.length) {
    await gameStore.getGameTopRankers();
  }
});
watch(section, () => {
  if (section.value) animationMarquee("#marquee", 0.5);
});
</script>
<template>
  <div
    v-if="rankItems.length"
    ref="section"
    id="marquee"
    class="w-full bg-main-500/50 h-[50px] flex items-center"
  >
    <ul class="flex gap-[248px] font-semibold text-white pr-[248px]">
      <li v-for="(item, idx) in rankItems" class="whitespace-nowrap" :key="idx">
        🎉 {{ item.user.name }}님이 [{{ item.game.display_name }}] 신기록에
        달성하셨습니다.
      </li>
    </ul>
  </div>
</template>
<style scoped></style>
