<script setup>
const evetItems = ref(Array(10).fill(0));

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

onMounted(() => {
  animationMarquee("#marquee", 0.5);
});
</script>
<template>
  <div id="marquee" class="w-full bg-main-500/50 h-[50px] flex items-center">
    <ul class="flex gap-[248px] text-sm font-dnf text-white">
      <li class="whitespace-nowrap" v-for="(_, idx) in evetItems" :key="idx">
        🎉 박지운님이 [틀린그림 찾기] 신기록에 달성하셨습니다.
      </li>
    </ul>
  </div>
</template>
<style scoped></style>
