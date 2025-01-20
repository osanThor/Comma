import { storeToRefs } from "pinia";
import { createPost, getPost, updatePost } from "../services/post.service.js";
import { useAuthStore } from "./auth";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

import { defineStore } from "pinia";
import { uploadImage } from "../services/upload.service";

export const usePostStore = defineStore("post", {
  state: () => ({
    id: "",
    title: "",
    content: "",
    images: [],
    posts: [],
    totalCount: 0,
    category: "free",
  }),
  getters: {
    isValidPost(state) {
      return state.title.trim() !== "" && state.content.trim() !== "";
    },
    imageCount(state) {
      return state.images.length;
    },
  },
  actions: {
    setTitle(newTitle) {
      this.title = newTitle;
    },

    setContent(newContent) {
      this.content = newContent;
    },

    setImages(newImages) {
      this.images = newImages;
    },

    addImage({ index, images }) {
      if (this.images.length + images.length > 4) {
        alert("이미지는 최대 4개까지 업로드 할 수 있습니다.");
        return;
      }
      this.images.splice(index, 0, ...images);
      if (this.images.length > 4) {
        this.images.splice(4);
      }
      console.log("Updated images:", this.images);
    },

    removeImage({ index }) {
      this.images.splice(index, 1);
      console.log("Updated images after removal:", this.images);
    },

    //게시글 내용 불러오기
    async fetchPostById(postId) {
      try {
        const post = await getPost(postId);
        this.id = post.id;
        this.setTitle(post.title);
        this.setContent(post.content);
        this.setImages(post.images);
        
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    },

    // 게시글 저장
    async savePost() {
      if (!this.isValidPost) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
      }

      try {
        const uploadResults = await Promise.allSettled(
          this.images.map((image) => uploadImage(image.file))
        );
        const successfulUploads = uploadResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);

        if (successfulUploads.length !== this.images.length) {
          alert("일부 이미지를 업로드하지 못했습니다.");
        }

        const postPayload = {
          userId: user.value.id,
          title: this.title,
          content: this.content,
          images: successfulUploads,
          category: "free",
        };

        console.log("게시글 데이터:", postPayload);

        const response = await createPost(postPayload);
        console.log("게시글 저장 성공!", response);

        this.resetPost();
        return response;
      } catch (error) {
        console.error("게시글 저장 중 오류 발생:", error);
        throw error;
      }
    },

    // 게시글 수정하기
    async editPost(postId) {
      if (!this.isValidPost) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
      }

      try {
        const postPayload = {
          postId: postId,
          userId: user.value.id,
          title: this.title,
          content: this.content,
          images: this.images,
          category: "free",
        };

        console.log("업데이트 게시글 데이터:", postPayload);

        const response = await updatePost(postPayload);
        console.log("게시글 업데이트 성공!", response);

        this.resetPost();
        return response;
      } catch (error) {
        console.error("게시글 업데이트 중 오류 발생:", error);
        throw error;
      }
    },

    resetPost() {
      this.id = "";
      this.title = "";
      this.content = "";
      this.images = [];
    },
  },
});
