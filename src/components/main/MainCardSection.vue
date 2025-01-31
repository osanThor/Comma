<script setup>
import { twMerge } from "tailwind-merge";
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import MainMarquee from "./MainMarquee.vue";
import { useGameStore } from "@/stores/test-game";

const gameStore = useGameStore();
const { games } = storeToRefs(gameStore);

const initialIndex = 2;

const target = ref(null);

// Swiper 설정
const swiperOptions = ref({
  slidesPerView: "5",
  centeredSlides: true,
  initialSlide: initialIndex,
});

const swiperInstance = ref(null);
const activeIndex = ref(0);
const targetIdx = ref(null);

const displayNames = reactive({
  bounceBall: "BOUNCE \n BALL",
  tetris: "TETRIS",
  flappyBoo: "Flappy \n boo",
  shooting: "Shoot \n Aliens",
  mineSweeper: "Mine \n sweeper",
});

const calculateOffset = (idx) => Math.abs(idx - activeIndex.value);
const isNegativeOffset = (idx) => idx - activeIndex.value < 0;

const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
  activeIndex.value = swiper?.activeIndex ?? 0;
};

const onSlideChange = () => {
  activeIndex.value = swiperInstance.value?.activeIndex ?? 0;
  if (swiperInstance.value?.activeIndex !== targetIdx.value)
    targetIdx.value = null;
};

const moveSlide = (nextTarget) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      swiperInstance.value.slideTo(nextTarget);
      activeIndex.value = nextTarget;
      resolve();
    }, 100);
  });
};

const handleClickTarget = async (idx) => {
  if (!swiperInstance.value) return;

  const isUpper = idx > activeIndex.value;
  let target = activeIndex.value;

  if (isUpper) {
    while (target < idx) {
      target++;
      await moveSlide(target);
    }
  } else {
    while (target > idx) {
      target--;
      await moveSlide(target);
    }
  }

  if (targetIdx.value === idx) {
    targetIdx.value = null;
  } else {
    targetIdx.value = idx;
  }
};

const handleKeyPress = (event) => {
  if (!swiperInstance.value) return;
  if (
    event.keyCode !== 37 &&
    event.keyCode !== 39 &&
    event.keyCode !== 32 &&
    event.keyCode !== 38 &&
    event.keyCode !== 40
  )
    return;

  event.preventDefault();
  if (event.keyCode === 37) {
    swiperInstance.value.slidePrev();
  } else if (event.keyCode === 39) {
    swiperInstance.value.slideNext();
  } else if (event.keyCode === 32 || event.keyCode === 38) {
    if (targetIdx.value === activeIndex.value) {
      targetIdx.value = null;
    } else {
      targetIdx.value = activeIndex.value;
    }
  }
};

const mouseDownHeader = (event) => {
  event.preventDefault();
  if (target.value && !target.value.contains(event.target))
    targetIdx.value = null;
};

watch(targetIdx, () => {
  if (targetIdx.value !== null)
    window.addEventListener("mousedown", mouseDownHeader);
  else window.removeEventListener("mousedown", mouseDownHeader);
});

onMounted(() => {
  document.removeEventListener("keydown", handleKeyPress);
  document.addEventListener("keydown", handleKeyPress);
});
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyPress);
  window.removeEventListener("mousedown", mouseDownHeader);
});
</script>

<template>
  <section
    class="relative w-full max-w-screen overflow-x-hidden flex flex-col items-center h-screen mb-[152px]"
  >
    <img
      class="w-[31.927vw] max-w-[613px] absolute -scale-x-100 top-[1.1vw] -left-[148px] pointer-events-none"
      src="/assets/images/cloud.png"
      alt="cloud"
    />
    <img
      class="w-[31.927vw] max-w-[613px] absolute top-[26.8vh] -right-[148px] pointer-events-none"
      src="/assets/images/cloud.png"
      alt="cloud"
    />
    <div
      class="w-full pt-[13vh] flex-grow flex flex-col justify-between items-center gap-[8.45vw] overflow-hidden"
    >
      <h2>
        <img
          class="w-full max-w-[584px] min-w-[584px]"
          src="/assets/images/main-title.png"
          alt="title"
        />
      </h2>
      <div
        ref="target"
        class="w-[calc(100%-32px)] max-w-[1200px] h-[41vh] max-h-[400px]"
      >
        <swiper
          v-bind="swiperOptions"
          class="mySwiper w-full"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
        >
          <swiper-slide
            v-for="(value, idx) in games"
            :key="value.id"
            :class="
              twMerge(
                'group max-w-[374px] w-full relative flex justify-center',
                calculateOffset(idx) === 1 && 'z-20 ',
                calculateOffset(idx) === 2 && 'z-10 ',
                idx === activeIndex && 'z-30',
                targetIdx === idx && 'z-40'
              )
            "
          >
            <div
              @click="handleClickTarget(idx)"
              :class="
                twMerge(
                  'w-full min-w-[370px] h-[516px] cursor-pointer left-1/2 -translate-x-1/2 relative rounded-3xl p-2 font-pixelNes ease-linear bg-white shadow-xl transition-all z-[9] flex items-center justify-center text-2xl font-bold bg-[url(/assets/images/bg/main/main-card-bg.jpg)] bg-no-repeat bg-center bg-cover',
                  calculateOffset(idx) === 1 &&
                    (isNegativeOffset(idx)
                      ? '-rotate-6 translate-y-10'
                      : 'rotate-6 translate-y-10'),
                  calculateOffset(idx) === 2 &&
                    (isNegativeOffset(idx)
                      ? '-rotate-12 translate-y-[140px] '
                      : 'rotate-12 translate-y-[140px] '),
                  calculateOffset(idx) > 2 &&
                    (isNegativeOffset(idx)
                      ? '-rotate-90 translate-y-96'
                      : 'rotate-90 translate-y-96'),
                  idx === activeIndex &&
                    'text-point-500 rotate-0 -translate-y-7 ',
                  targetIdx === idx && 'rotate-0 -translate-y-[300px] scale-110'
                )
              "
            >
              <span
                v-if="targetIdx === idx"
                class="animate-ping absolute inline-flex h-[300px] w-[300px] blur-sm rounded-full bg-white opacity-20 pointer-events-none"
              />
              <div
                :class="
                  twMerge(
                    'w-full flex h-full bg-point-500 rounded-3xl overflow-hidden relative flex-col items-center'
                  )
                "
              >
                <img
                  class="w-full h-full object-cover"
                  :src="`/assets/images/bg/main/main-card-${value.name}.jpg`"
                  :alt="`main-card-${value.name}`"
                />
                <h2
                  class="text-white absolute text-[50px] text-center top-[60px] leading-[45px]"
                >
                  {{ displayNames[value.name] }}
                </h2>
              </div>
              <div
                v-if="targetIdx === idx"
                class="absolute bottom-14 left-1/2 -translate-x-1/2 border-2 border-white rounded-full flex items-center justify-center"
              >
                <router-link
                  :to="`/game/${value.name}`"
                  class="text-3xl text-white w-[180px] flex items-center justify-center py-3 bg-main-500 transition-all hover:bg-point-500 rounded-full"
                  >Play</router-link
                >
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <main-marquee></main-marquee>
  </section>
</template>
<style scoped>
.swiper {
  overflow: visible !important;
}
</style>
