<script>
import { ref, onMounted, computed, watch } from "vue";
import { useCommentStore } from "../../stores/comment.js";
import PostCommentCardItem from "../post-detail/PostCommentCardItem.vue";
import Pagination from "../common/Pagination.vue";

export default {
  name: "PostComment",
  props: {
    postId: {
      type: String,
      required: true,
    },
    navigateToProfile: {
      type: Function,
      required: true,
    },
  },
  components: {
    PostCommentCardItem,
    Pagination,
  },
  setup(props) {
    const commentStore = useCommentStore();
    const sortType = ref("desc");
    const currentPage = ref(1);
    const pageSize = ref(10);
    const comments = ref([]);
    const totalCount = computed(() => commentStore.totalCount);

    const handleGetComments = async () => {
      try {
        await commentStore.fetchComments(
          props.postId,
          sortType.value,
          currentPage.value,
          pageSize.value
        );
        comments.value = commentStore.comments;
      } catch (err) {
        console.error("댓글 로드 중 오류 발생", err);
      }
    };

    const handleChangePage = async (newPage) => {
      currentPage.value = newPage;
      await handleGetComments();
    };

    const handleChangeSort = async (currentSort) => {
      if (sortType.value !== currentSort) {
        sortType.value = currentSort;
        currentPage.value = 1;
        await handleGetComments();
      }
    };

    onMounted(async () => {
      await handleGetComments();
    });

    return {
      comments,
      totalCount,
      sortType,
      handleChangeSort,
      currentPage,
      handleChangePage,
      pageSize,
    };
  },
};
</script>

<template>
  <section class="flex flex-col items-center w-full mx-auto">
    <!-- 댓글 상단 -->
    <header class="flex flex-row items-end justify-between w-full text-white mb-12">
      <p class="font-semibold text-2xl">댓글 {{ totalCount }}개</p>
      <div class="flex flex-row items gap-5 font-semibold text-lg">
        <button
          :class="{ 'text-point-500': sortType === 'desc' }"
          @click="handleChangeSort('desc')"
          class="hover:text-point-500"
        >
          최신순
        </button>
        <button
          :class="{ 'text-point-500': sortType === 'likes' }"
          @click="handleChangeSort('likes')"
          class="hover:text-point-500"
        >
          인기순
        </button>
      </div>
    </header>
    <main class="flex flex-col items-center w-full">
      <!-- 댓글 목록 -->
      <post-comment-card-item
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :navigateToProfile="navigateToProfile"
      ></post-comment-card-item>
    </main>
    <pagination
      :page="currentPage"
      :total="totalCount"
      @page-change="handleChangePage"
    ></pagination>
  </section>
</template>

<style scoped></style>
