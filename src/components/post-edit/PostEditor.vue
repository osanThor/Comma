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
  setup() {
    const postStore = usePostStroe();
    const {
      title,
      content,
      imagesByOpacity,
      setTitle,
      setContent,
      addImage,
      removeImage,
      savePost,
      fetchPostsByCategory,
    } = postStore;

    const handleSave = async () => {
      try {
        await savePost();
        alert("게시글이 저장되었습니다.");
      } catch (err) {
        console.error("게시글 저장 실패:", err);
        alert("게시글 저장에 실패했습니다.");
      }
    };

    const fetchPosts = async () => {
      await fetchPostsByCategory("free", "dec", 1, 10);
    };

    return {
      title,
      content,
      imagesByOpacity,
      setTitle,
      setContent,
      addImage,
      removeImage,
      handleSave,
      fetchPosts,
    };
  },
};
</script>

<template>
  <main class="flex flex-row items-center justify-center gap-12">
    <!-- 이미지 업로드 -->
    <PostEditImg
      :imagesByOpacity="imagesByOpacity"
      @addImage="addImage"
      @removeImage="removeImage"
    />
    <!-- 게시글 내용 작성 -->
    <PostEditContent
      :title="title"
      :content="content"
      @setTitle="setTitle"
      @setContent="setContent"
      @save="handleSave"
    />
  </main>
</template>

<style lang="scss" scoped></style>
