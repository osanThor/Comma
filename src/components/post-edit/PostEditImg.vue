<script>
import PostEditImgCard from "./PostEditImgCard.vue";

export default {
  name: "PostEditImg",
  components: {
    PostEditImgCard,
  },
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["addImage", "removeImage"],
  computed: {
    totalImages() {
      return this.images.length;
    },
  },
  methods: {
    handleFileChange(event, index) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      this.$emit("addImage", { index, images: newImages });
      event.target.value = "";
    },
    triggerFileSelect(index) {
      const inputRef = document.getElementById(`fileInput${index}`);
      if (inputRef) {
        inputRef.click();
      } else {
        console.error(`File input not found`);
      }
    },
    handleRemoveImage(index) {
      this.$emit("removeImage", { index });
    },
  },
};
</script>

<template>
  <section class="flex flex-col items-center">
    <!-- 이미지 업로드 입력창 -->
    <input
      v-for="index in [0, 1, 2, 3]"
      :key="'fileInput' + index"
      :id="'fileInput' + index"
      type="file"
      accept="image/png, image/jpeg, image/jpg"
      multiple
      class="hidden"
      @change="(e) => handleFileChange(e, index)"
    />

    <div>
      <!-- 기본 이미지 영역 -->
      <PostEditImgCard
        v-if="images.length > 0"
        :imgSrc="images[0].preview || images[0]"
        :size="'w-[440px] h-[440px]'"
        :opacity="100"
        @click="handleRemoveImage(0)"
      />
      <PostEditImgCard v-else @click="triggerFileSelect(0)" />
    </div>
    <!-- 추가 이미지 영역 -->
    <div class="flex flex-row items-center w-full justify-between mt-2">
    <PostEditImgCard
        v-if="images.length > 1"
        :imgSrc="images[1].preview || images[1]"
        :size="'w-[140px] h-[140px]'"
        :opacity="70"
        @click="handleRemoveImage(1)"
      />
      <PostEditImgCard v-else @click="triggerFileSelect(1)" :opacity="70" :size="'w-[140px] h-[140px]'" />

      <PostEditImgCard
        v-if="images.length > 2"
        :imgSrc="images[2].preview || images[2]"
        :size="'w-[140px] h-[140px]'"
        :opacity="50"
        @click="handleRemoveImage(2)"
      />
      <PostEditImgCard v-else @click="triggerFileSelect(2)" :opacity="50" :size="'w-[140px] h-[140px]'" />

      <PostEditImgCard
        v-if="images.length > 3"
        :imgSrc="images[3].preview || images[3]"
        :size="'w-[140px] h-[140px]'"
        :opacity="30"
        @click="handleRemoveImage(3)"
      />
      <PostEditImgCard v-else @click="triggerFileSelect(3)" :opacity="30" :size="'w-[140px] h-[140px]'" />
    </div>
  </section>
</template>

<style scoped></style>
