<script>
import { usePostStroe } from "../../stores/post";
import { useRouter, useRoute } from "vue-router";
import PostEditContent from "./PostEditContent.vue";
import PostEditImg from "./PostEditImg.vue";

export default {
  name: "PostEditor",
  components: {
    PostEditContent,
    PostEditImg,
  },
  props: {
    isEdit:{
      type:Boolean,
      default: false,
    },
  },
  data() {
    const postStore = usePostStroe();
    const router = useRouter();
    const route = useRoute();
    return {
      ...postStore,
      router,
      route,
    };
  },
  async created() {
    if(this.isEdit){
      const postId = this.route.params.postId;
      await this.fetchPostById(postId);
    } else {
      this.resetPost();
    }
  },
  methods: {
    setTitle(title) {
      this.title = title;
    },
    setContent(content) {
      this.content = content;
    },
    addImage({ index, images }) {
      this.images.splice(index, 0, ...images);
      if (this.images.length > 4) {
        this.images.splice(4);
      }
    },
    removeImage({ index }) {
      this.images.splice(index, 1);
    },
    async handleSave() {
      try {
        const response = await this.savePost();
        console.log(response);
        alert("게시글이 저장되었습니다.");
        this.router.push(`/post/${response.postId}`);
      } catch (err) {
        console.error("게시글 저장 실패:", err);
        alert("게시글 저장에 실패했습니다.");
      }
    },
    async fetchPosts() {
      try {
        await this.fetchPostsByCategory();
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
      :images="images"
      @addImage="addImage"
      @removeImage="removeImage"
    />
    <!-- 게시글 내용 작성 -->
    <section class="flex flex-col items-end gap-12">
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

<style scoped></style>
