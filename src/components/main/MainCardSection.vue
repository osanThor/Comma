<script setup>
import { twMerge } from "tailwind-merge";
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const items = ref(Array.from({ length: 5 }, (_, i) => `Item ${i + 1}`));
const initialIndex = 2;

// Swiper 설정
const swiperOptions = ref({
  slidesPerView: "5",
  centeredSlides: true,
  initialSlide: initialIndex,
  grabCursor: true,
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

const handleClickTarget = (idx) => {
  if (targetIdx.value === idx) {
    targetIdx.value = null;
  } else targetIdx.value = idx;
};
</script>

<template>
  <section
    class="relative w-full flex flex-col items-center h-screen sm:max-h-[1080px] mb-[152px]"
  >
    <img
      class="w-[31.927vw] max-w-[613px] absolute -scale-x-100 top-[9.4vh] -left-[148px]"
      src="/assets/images/cloud.png"
      alt="cloud"
    />
    <img
      class="w-[31.927vw] max-w-[613px] absolute top-[26.8vh] -right-[148px]"
      src="/assets/images/cloud.png"
      alt="cloud"
    />
    <div
      class="w-full pt-[13vh] flex-grow flex flex-col justify-between items-center gap-[8.45vw] overflow-hidden"
    >
      <h2 class="max-w-[48.88vh]">
        <img
          class="w-full max-w-[30.31vw]"
          src="/assets/images/main-title.png"
          alt="title"
        />
      </h2>
      <div class="w-[calc(100%-32px)] max-w-[1920px] h-[40vh] max-h-[400px]">
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
                'group max-w-[374px] w-full relative',
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
                  'w-full min-w-[300px] h-[516px] absolute top-1/2 rounded-3xl ease-linear bg-white shadow-xl transition-all z-[9] flex items-center justify-center text-2xl font-bold',
                  calculateOffset(idx) === 1 &&
                    (isNegativeOffset(idx)
                      ? '-rotate-6 translate-x-[50px] translate-y-20 '
                      : 'rotate-6 -translate-x-[50px] translate-y-20 '),
                  calculateOffset(idx) === 2 &&
                    (isNegativeOffset(idx)
                      ? '-rotate-12 translate-x-[120px] translate-y-[200px] '
                      : 'rotate-12 -translate-x-[120px] translate-y-[200px] '),
                  calculateOffset(idx) > 2 &&
                    (isNegativeOffset(idx)
                      ? '-rotate-90 translate-y-96'
                      : 'rotate-90 translate-y-96'),
                  idx === activeIndex &&
                    'text-point-500 rotate-0 translate-x-0 -translate-y-7 ',
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
    <div class="w-full bg-main-500/50 h-[50px]"></div>
  </section>
</template>
<style scoped>
.swiper {
  overflow: visible !important;
}
</style>
