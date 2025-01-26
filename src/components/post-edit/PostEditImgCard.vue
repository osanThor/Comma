<script>
export default {
  name: "PostEditImgCard",
  props: {
    size: {
      type: String,
      default: 'w-[440px] h-[440px]',
    },
    opacity: {
      type: Number,
      default: 100
    },
    imgSrc: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  computed: {
    sizeClass(){
      return this.size;
    },
    opacityStyle(){
      return { opacity: this.opacity / 100};
    },
    logImgSrc() {
      console.log("Image source:", this.imgSrc); 
      return this.imgSrc;
    }
  },
};
</script>

<template>

  <div>
    <!-- 이미지가 없을 때의 영역 -->
    <section v-if="!imgSrc" :class="`relative rounded-xl ${sizeClass} transition-all duration-300 transform hover:scale-105 hover:shadow-xl`" @click="$emit('click')" :style="opacityStyle">
      <!-- 이미지 추가 버튼 -->
      <button class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <img src="/assets/images/icons/postEdit-ImgPlus-icon.svg" alt="Add Image" />
      </button>
      <!-- 이미지 삽입 영역 -->
      <div 
      :class="`w-full h-full rounded-xl bg-white`">
      </div>
    </section>

    <!-- 이미지가 있을 때의 영역 -->
    <section v-else :class="`relative rounded-xl ${sizeClass} transition-all duration-300 transform hover:scale-105 hover:shadow-xl`" @click="$emit('click')">
      <!-- 이미지 삽입 영역 -->
      <div :class="`w-full h-full rounded-xl`">
        <img class="w-full h-full rounded-xl object-cover object-center" :src="imgSrc" />
      </div>
    </section>
  </div>
</template>

<style scoped></style>
