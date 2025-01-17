<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const items = ref(Array.from({ length: 5 }, (_, i) => `Item ${i + 1}`));

const getStyle = (i) => {
  return {
    transform: {
      boxShadow: `-5px 5px 5px rgba(0, 0, 0, 0.15), inset 0 0 0 2px hsla(${
        (i / 10) * -360
      }, 100%, 80%, 0.75)`,
      transform: `translateY(${Math.abs(((i - 4.5) / 4.5) * 80)}px) rotate(${
        ((i - 4.5) / 4.5) * 50
      }deg)`,
    },
  };
};
</script>

<template>
  <section class="w-full flex flex-col items-center h-screen">
    <div
      class="w-full pt-[13vh] flex-grow flex flex-col items-center gap-[6.45vw] overflow-y-hidden"
    >
      <h2 class="max-w-[48.88vh]">
        <img
          class="w-full max-w-[30.31vw]"
          src="/assets/images/main-title.png"
          alt="title"
        />
      </h2>
      <div class="w-[calc(100%-32px)] max-w-[1920px] flex flex-grow">
        <swiper
          :slidesPerView="5"
          :loop="true"
          :centeredSlides="true"
          :spaceBetween="30"
          :grabCursor="true"
          class="mySwiper w-full"
        >
          <swiper-slide
            class="w-[374px] h-[516px] rounded-lg bg-white"
            v-for="(value, idx) in items"
            >Slide {{ value }}</swiper-slide
          >
        </swiper>
      </div>
    </div>
    <div class="w-full bg-main-500/50 h-[50px]"></div>
  </section>
  <section class="min-h-screen">22</section>
</template>

<style scoped></style>
