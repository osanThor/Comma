<script setup>
import SmallLike from "@/components/common/icons/SmallLike.vue";
import { useToastStore } from "@/stores/toast";
import CommentDeleteIcon from "../common/icons/CommentDeleteIcon.vue";
import { useAuthStore } from "@/stores/auth";
import { useModalStore } from "@/stores/modal";
import { deleteComment } from "@/services/comment.service.js";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["comment-trigger"]);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const { openModal } = useModalStore();
const { addToast } = useToastStore();

const totalLikes = computed(() => {
  const likeCount = props.item?.like_count || 0;
  if (likeCount >= 1000) {
    return (likeCount / 1000).toFixed(1) + "k";
  }
  return likeCount.toString();
});

const dateFormed = computed(() => {
  const date = new Date(props.item.created_at);
  return date.toISOString().split("T")[0];
});

const handleDeleteComment = async () => {
  try {
    const data = await deleteComment(props.item.id);
    if (data) {
      addToast("댓글이 삭제 되었어요.");
      emit("comment-trigger");
    }
  } catch (err) {
    console.error(err);
    addToast("댓글을 삭제하기 못했어요.", "error");
  }
};

const handleClickDelete = () => {
  openModal("이 댓글을 삭제하시겠어요?", "삭제하기", handleDeleteComment);
};
</script>

<template>
  <!-- Main content area -->
  <div class="w-full relative group">
    <router-link
      :to="`/post/${item.post_id}`"
      class="h-[70px] w-full rounded-2xl bg-main-600 flex flex-wrap items-center px-[33px] mt-3"
    >
      <div
        class="w-[128px] flex-1 text-white text-base font-dnf max-w-32 truncate mr-10"
      >
        {{ item.post.title }}
      </div>
      <div
        class="flex-[1.8] text-white/70 text-base font-medium max-w-[612px] truncate pr-8"
      >
        {{ item.content }}
      </div>
      <div
        class="flex-[0.6] text-gray-500 text-xs font-medium flex justify-center"
      >
        {{ dateFormed }}
      </div>
      <div class="flex items-center text-point-500 text-base w-12">
        <small-like width="15" height="15"></small-like>
        <span class="ml-1">{{ totalLikes }}</span>
      </div>
    </router-link>
    <button
      v-if="item.user.id === user.id"
      class="w-7 h-7 absolute bg-white rounded-full hidden group-hover:flex items-center justify-center top-0 right-0 translate-x-4"
      @click="handleClickDelete"
    >
      <comment-delete-icon></comment-delete-icon>
    </button>
  </div>
</template>

<style scoped></style>
