import { storeToRefs } from "pinia";
import { createPost, getPostsByCategory } from "../services/post.service.js";
import { useAuthStore } from "./auth";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

import { defineStore } from "pinia";
import { uploadImage } from "../services/upload.service";

export const usePostStroe = defineStore("post", {
  state: () => ({
    id: null,
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

    // 게시글 저장
    async savePost() {
      if (!this.isValidPost) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
      }

      try {
        const uploadResults = await Promise.allSettled(
          this.images.map(image => uploadImage(image.file))
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

    resetPost() {
      this.title = "";
      this.content = "";
      this.images = [];
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

  //게시글 내용 불러오기
  async fetchPostById(postId) {
    try{
      const post = await getPostsByUserId(postId);
      this.setTitle(post.title);
      this.setContent(post.content);
      this.images = post.images;
    }catch(error){
      console.error("게시글 불러오기 실패:", error);
    }
  }
});
