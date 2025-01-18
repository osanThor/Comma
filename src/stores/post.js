import { storeToRefs } from "pinia";
import { createPost, getPostsByCategory } from "../services/post.service.js";
import { useAuthStore } from "./auth";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

import { defineStore } from "pinia";
import { uploadImage } from "../services/upload.service";

export const usePostStroe = defineStore("post", {
  state: () => ({
    title: "",
    content: "",
    imageBlobs: [],
    posts: [],
    totalCount: 0,
    category: "free",
  }),
  getters: {
    imagesByOpacity(state) {
      return {
        100: state.imageBlobs.filter((blob) => blob.opacity === 100),
        70: state.imageBlobs.filter((blob) => blob.opacity === 70),
        50: state.imageBlobs.filter((blob) => blob.opacity === 50),
        30: state.imageBlobs.filter((blob) => blob.opacity === 30),
      };
    },
    isValidPost(state) {
      return state.title.trim() !== "" && state.content.trim() !== "";
    },
    imageCount(state) {
      return state.imageBlobs.length;
    },
  },
  actions: {
    setTitle(newTitle) {
      this.title = newTitle;
    },

    setContent(newContent) {
      this.content = newContent;
    },

    addImage({ opacity, images }) {
      const newImages = images.map((image) => ({ ...image, opacity }));
      if (this.imageBlobs.length + newImages.length > 4) {
        alert("이미지는 최대 4개까지 업로드 할 수 있습니다.");
        return;
      }
      this.imageBlobs.push(...newImages);
      console.log("Updated imageBlobs:", this.imageBlobs);
    },

    removeImage({ opacity, index }) {
      const groupIndex = this.imageBlobs.findIndex(
        (blob, idx) => blob.opacity === opacity && idx === index
      );
      if (groupIndex !== -1) {
        this.imageBlobs.splice(groupIndex, 1);
      }
    },

    // 게시글 저장
    async savePost() {
      if (!this.isValidPost) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
      }

      try {
        const imageUrls = await Promise.all(
          this.imageBlobs.map((blob) => {
            console.log("업로드할 이미지 Blob:", blob);
            return uploadImage(blob)
          })
        );
        const postPayload = {
          userId: user.value.id,
          title: this.title,
          content: this.content,
          images: imageUrls,
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

    resetPost() {
      this.title = "";
      this.content = "";
      this.imageBlobs = [];
    },
  },

  // 게시글 목록 가져오기
  async fetchPostsByCategory(
    category = "free",
    sort = "dec",
    page = 1,
    limit = 10
  ) {
    try {
      const { data, totalCount } = await getPostsByCategory(
        category || this.category,
        sort,
        page,
        limit
      ); 
      this.posts = data;
      this.totalCount = totalCount;
    } catch (error) {
      console.error("게시글 가져오기 실패:", error);
    }
  },
});
