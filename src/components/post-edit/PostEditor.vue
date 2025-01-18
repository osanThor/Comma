<script>
import { usePostStroe } from "../../stores/post";
import PostEditContent from "./PostEditContent.vue";
import PostEditImg from "./PostEditImg.vue";

export default {
  name: "PostEditor",
  components: {
    PostEditContent,
    PostEditImg,
  },
  data() {
    const postStore = usePostStroe();
    return {
      title: postStore.title,
      content: postStore.content,
      imagesByOpacity: postStore.imagesByOpacity,
    };
  },
  methods: {
    setTitle(title) {
      this.title = title;
    },
    setContent(content) {
      this.content = content;
    },
    addImage({ opacity, images }) {
      this.imagesByOpacity[opacity] = [
        ...this.imagesByOpacity[opacity],
        ...images,
      ];
    },
    removeImage({ opacity, index }) {
      this.imagesByOpacity[opacity].splice(index, 1);
    },

    async handleSave() {
      try {
        await this.$store.savePost();
        alert("게시글이 저장되었습니다.");
      } catch (err) {
        console.error("게시글 저장 실패:", err);
        alert("게시글 저장에 실패했습니다.");
      }
    },
    async fetchPosts() {
      try {
        await this.$store.fetchPostsByCategory();
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    },
  },
};
</script>

<template>
  <main class="flex flex-row items-start justify-center gap-12">
    <!-- 이미지 업로드 -->
    <PostEditImg
      :imagesByOpacity="imagesByOpacity"
      @addImage="addImage"
      @removeImage="removeImage"
    />
    <!-- 게시글 내용 작성 -->
    <section class="flex flex-col items-end gap-10">
      <PostEditContent
        :title="title"
        :content="content"
        @setTitle="setTitle"
        @setContent="setContent"
      />
      <button
        @click="handleSave"
        class="bg-white w-28 h-10 rounded-xl font-dnf text-main-500 disabled:opacity-50 hover:bg-point-500 ml-auto transition-all duration-60 transform hover:scale-110 hover:shadow-xl"
      >
        저장
      </button>
    </section>
  </main>
</template>

<style lang="scss" scoped></style>
