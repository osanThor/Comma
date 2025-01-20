<script>
import { useRoute, useRouter } from "vue-router";
import { usePostStore } from "../../stores/post";
import PostEditContent from "./PostEditContent.vue";
import PostEditImg from "./PostEditImg.vue";

export default {
  name: "PostEditor",
  components: {
    PostEditContent,
    PostEditImg,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const postStore = usePostStore();
    const router = useRouter();
    const route = useRoute();
    return {
      postStore,
      router,
      route,
    };
  },
  async created() {
    if (this.isEdit) {
      const postId = this.route.params.postId;
      await this.postStore.fetchPostById(postId);
    } else {
      this.postStore.resetPost();
    }
  },
  methods: {
    setTitle(title) {
      this.postStore.setTitle(title);
    },
    setContent(content) {
      this.postStore.setContent(content);
    },
    addImage({ index, images }) {
      this.postStore.addImage({ index, images });
    },
    removeImage({ index }) {
      this.postStore.removeImage({ index });
    },
    async handleSave() {
      try {
        let response;
        const postId = this.route.params.postId;
        if (this.isEdit) {
          response = await this.postStore.editPost(postId);
        } else {
          response = await this.postStore.savePost();
        }
        console.log(response);
        alert("게시글이 저장되었습니다.");
        this.router.push(`/post/${response.postId}`);
      } catch (err) {
        console.error("게시글 저장 실패:", err);
        alert("게시글 저장에 실패했습니다.");
      }
    },
  },
};
</script>

<template>
  <main class="flex flex-row items-start justify-center gap-12">
    <!-- 이미지 업로드 -->
    <PostEditImg
      :images="postStore.images"
      @addImage="addImage"
      @removeImage="removeImage"
    />
    <!-- 게시글 내용 작성 -->
    <section class="flex flex-col items-end gap-12">
      <PostEditContent
        :title="postStore.title"
        :content="postStore.content"
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

<style scoped></style>
