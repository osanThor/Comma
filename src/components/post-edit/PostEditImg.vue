<script>
import PostEditImgCard from "./PostEditImgCard.vue";

export default {
  name: "PostEditImg",
  components: {
    PostEditImgCard,
  },
  props: {
    imagesByOpacity: {
      type: Object,
      default: () => ({ 100: [], 70: [], 50: [], 30: [] }),
    },
  },
  emits: ["addImage", "removeImage"],
  methods: {
    handleFileChange(event, opacity) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      this.$emit("addImage", { opacity, images: newImages });
      event.target.value = "";
    },
    triggerFileSelect(opacity) {
      const inputRef = this.$refs[`fileInput${opacity}`];
      if(inputRef && inputRef.length > 0) {
        inputRef[0].click();
      } else {
        console.error(`File input not found`);
      }
    },
    handleRemoveImage(opacity, index) {
      this.$emit("removeImage", { opacity, index });
    },
  },
};
</script>

<template>
  <section class="flex flex-col items-center">
    <!-- 이미지 업로드 입력창 -->
    <input
      v-for="opacity in [100, 70, 50, 30]"
      :key="'fileInput' + opacity"
      :ref="'fileInput' + opacity"
      type="file"
      accept="image/png, image/jpeg, image/jpg"
      multiple
      class="hidden"
      @change="(e) => handleFileChange(e, opacity)"
    />

    <div>
      <PostEditImgCard
        v-for="(blob, index) in imagesByOpacity[100]"
        :key="'img100-' + index"
        :imgSrc="blob.preview"
        :size="'w-[440px] h-[440px]'"
        :opacity="100"
        @click="handleRemoveImage(100, index)"
      />
      <PostEditImgCard @click="triggerFileSelect(100)" />
    </div>
    <div class="flex flex-row items-center w-full justify-between mt-2">
      <div v-for="opacity in [70, 50, 30]" :key="'group-' + opacity">
        <PostEditImgCard
          v-for="(blob, index) in imagesByOpacity[opacity]"
          :key="'img-' + opacity + '-' + index"
          :imgSrc="blob.preview"
          :size="'w-[140px] h-[140px]'"
          :opacity="opacity"
          @click="handleRemoveImage(opacity, index)"
        />
        <PostEditImgCard
          :opacity="opacity"
          :size="'w-[140px] h-[140px]'"
          @click="triggerFileSelect(opacity)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped></style>
