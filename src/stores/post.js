import { storeToRefs } from "pinia";
import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from "../services/post.service.js";
import { useAuthStore } from "./auth";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

import { defineStore } from "pinia";
import { addLike, checkLike, removeLike } from "../services/like.service.js";
import { uploadImage } from "../services/upload.service";

export const usePostStore = defineStore("post", {
  state: () => ({
    id: "",
    title: "",
    content: "",
    user: {},
    createdAt: "",
    updatedAt: null,
    images: [],
    category: "free",
    likeCount: 0,
    commentCount: 0,
    hasLiked: false,
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

    setCreatedAt(newCreatedAt) {
      this.createdAt = newCreatedAt;
    },

    setUpdatedAt(newUpdatedAt) {
      this.updatedAt = newUpdatedAt;
    },

    setCategory(newCategory) {
      this.category = newCategory;
    },

    setLikeCount(newLikeCount) {
      this.likeCount = newLikeCount;
    },

    setCommentCount(newCommentCount) {
      this.commentCount = newCommentCount;
    },

    setHasLiked(newHasLiked) {
      this.hasLiked = newHasLiked;
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
      console.log("이미지 업로드:", this.images);
    },

    removeImage({ index }) {
      this.images.splice(index, 1);
      console.log("삭제되었습니다:", this.images);
    },

    async deletePost(postId) {
      try {
        const response = await deletePost(postId);
        return response;
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
        throw error;
      }
    },

    //좋아요 확인 및 추가 삭제
    async toggleLike(postId) {
      try {
        console.log("Toggling like for postId:", postId);

        const isLiked = await checkLike({
          userId: user.value.id,
          targetId: postId,
          targetType: "post",
        });

        console.log("Is post liked?", isLiked);

        if (isLiked) {
          await removeLike({
            userId: user.value.id,
            targetId: postId,
            targetType: "post",
          });
          this.setLikeCount(this.likeCount - 1);
          this.setHasLiked(false);
        } else {
          await addLike({
            userId: user.value.id,
            targetId: postId,
            targetType: "post",
          });
          this.setLikeCount(this.likeCount + 1);
          this.setHasLiked(true);
        }
      } catch (error) {
        console.error("게시글 좋아요 처리 실패:", error);
        throw error;
      }
    },

    //게시글 내용 불러오기
    async fetchPostById(postId) {
      try {
        const post = await getPost(postId);

        this.id = post.id;
        this.setTitle(post.title);
        this.setContent(post.content);
        this.setImages(post.images);
        this.setCreatedAt(post.created_at);
        this.setUpdatedAt(post.updated_at);
        this.setCategory(post.category);
        this.setLikeCount(post.like_count);
        this.setCommentCount(post.comment_count);

        this.user = {
          ...post.user,
          profile_image:
            post.user.profile_image || "/assets/images/exProfile.png",
        };

        const authStore = useAuthStore();
        const userId = authStore.user.id;

        const isLiked = await checkLike({
          userId,
          targetId: postId,
          targetType: "post",
        });
        this.setHasLiked(isLiked);
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
        const uploadResults = await Promise.all(
          this.images.map(async (image) => {
            if (image.file) {
              const uploadedUrl = await uploadImage(image.file);
              return uploadedUrl;
            } else {
              return image;
            }
          })
        );

        const postPayload = {
          postId: postId,
          userId: user.value.id,
          title: this.title,
          content: this.content,
          images: uploadResults,
          category: this.category,
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
      this.author = "";
      this.createdAt = "";
    },
  },
});
