<script setup>
import { twMerge } from "tailwind-merge";
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const items = ref(Array.from({ length: 5 }, (_, i) => `Item ${i + 1}`));
const evetItems = ref(Array(10).fill(0));
const initialIndex = 2;

// Swiper 설정
const swiperOptions = ref({
  slidesPerView: "5",
  centeredSlides: true,
  initialSlide: initialIndex,
});

const swiperInstance = ref(null);
const activeIndex = ref(0);
const targetIdx = ref(null);

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
      swiperInstance.value.slideTo(nextTarget); // 슬라이드 이동
      activeIndex.value = nextTarget; // 상태 업데이트
      resolve();
    }, 100);
  });
};

const handleClickTarget = async (idx) => {
  if (!swiperInstance.value) return;

  const isUpper = idx > activeIndex.value; // 이동 방향 확인
  let target = activeIndex.value; // 현재 활성 인덱스

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
</script>

<template>
  <section
    class="relative w-full flex flex-col items-center h-screen mb-[152px]"
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
      <h2 class="max-w-[30.41vw]">
        <img
          class="w-full max-w-[584px]"
          src="/assets/images/main-title.png"
          alt="title"
        />
      </h2>
      <div class="w-[calc(100%-32px)] max-w-[1200px] h-[41vh] max-h-[400px]">
        <swiper
          v-bind="swiperOptions"
          class="mySwiper w-full"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
        >
          <swiper-slide
            v-for="(value, idx) in items"
            :key="idx"
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
                  'w-full min-w-[370px] h-[516px] left-1/2 -translate-x-1/2 relative rounded-3xl ease-linear bg-white shadow-xl transition-all z-[9] flex items-center justify-center text-2xl font-bold',
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
                      ? '-rotate-45 translate-y-96'
                      : 'rotate-45 translate-y-96'),
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
              Slide {{ value }}
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="w-full bg-main-500/50 h-[50px] flex items-center">
      <ul class="flex gap-[248px] text-sm font-dnf text-white">
        <li class="whitespace-nowrap" v-for="(_, idx) in evetItems" :key="idx">
          🎉 박지운님이 [틀린그림 찾기] 신기록에 달성하셨습니다.
        </li>
      </ul>
    </div>
  </section>
</template>
<style scoped>
.swiper {
  overflow: visible !important;
}
</style>
