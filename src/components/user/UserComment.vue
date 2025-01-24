<script setup>
import BaseFilter from "@/components/common/Filter.vue";
import CommentComponent from "./CommentComponent.vue";
import { getCommentsByUserId } from "@/services/comment.service";
import Pagination from "@/components/common/Pagination.vue";

const props = defineProps({
  userId: {
    type: String,
    default: "",
  },
  user: {
    type: Object,
    required: true,
  },
});

const page = ref(1);
const sort = ref("likes");

const sortOption = [
  { name: "인기순", value: "likes" },
  { name: "최신순", value: "desc" },
];

const commentsData = reactive({
  comments: [],
  total: 0,
});

const handleGetComments = async (page, sort) => {
  try {
    const data = await getCommentsByUserId(props.userId, sort, page);
    if (data) {
      commentsData.comments = data.data;
      commentsData.total = data.totalCount;
    }
  } catch (err) {
    console.error(err);
    alert(err);
  }
};

const handleChangePage = (currentPage) => {
  page.value = currentPage;
};

const handleChangeSort = async (currentSort) => {
  if (sort.value !== currentSort) {
    sort.value = currentSort;
    page.value = 1;
    await handleGetPosts(
      page.value,
      sort.value,
      channelSelected.value === "comma"
    );
  }
};

onBeforeMount(async () => {
  await handleGetComments(1, sort.value);
});

watch(page, async () => {
  await handleGetPosts(page.value, sort.value);
});
</script>
<template>
  <div class="flex flex-col flex-grow">
    <div class="flex justify-end mb-5">
      <base-filter
        :sort="sort"
        :sortOption="sortOption"
        @change-sort="handleChangeSort"
      ></base-filter>
    </div>
    <div
      v-if="!commentsData.comments.length"
      class="w-full flex items-center flex-grow justify-center py-[200px] text-white/50 text-2xl font-bold"
    >
      작성한 댓글이 존재하지 않습니다.
    </div>
    <div v-else class="flex flex-col gap-3 pr-[70px] mb-[70px]">
      <comment-component
        v-for="item in commentsData.comments"
        :item="item"
      ></comment-component>
    </div>
    <div class="w-full flex justify-center">
      <pagination
        :page="page"
        :total="commentsData.total"
        :page-size="10"
        @page-change="handleChangePage"
      ></pagination>
    </div>
  </div>
</template>
<style scoped></style>
