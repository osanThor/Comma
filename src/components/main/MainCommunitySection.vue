<script setup>
import TitleLeft from "@/components/common/icons/TitleLeft.vue";
import TitleRight from "@/components/common/icons/TitleRight.vue";
import BaseFilter from "@/components/common/Filter.vue";
import Pagination from "@/components/common/Pagination.vue";
import PostItem from "../common/PostItem.vue";
import { getPostsByCategory } from "@/services/post.service";

const postData = reactive({
  posts: [],
  total: 0,
});
const page = ref(1);
const sort = ref("likes");
const sortOption = [
  { name: "인기순", value: "likes" },
  { name: "최신순", value: "desc" },
];

const handleGetPosts = async (page, sort) => {
  try {
    const data = await getPostsByCategory("free", sort, page, 12);
    if (data) {
      postData.posts = data.data;
      postData.total = data.totalCount;
    }
  } catch (err) {
    console.error(err);
  }
};

const handleChangePage = (currentPage) => {
  page.value = currentPage;
};
const handleChangeSort = async (currentSort) => {
  if (sort.value !== currentSort) {
    sort.value = currentSort;
    page.value = 1;
    await handleGetPosts(page.value, sort.value);
  }
};

onBeforeMount(async () => {
  await handleGetPosts(1, sort.value);
});

watch(page, async () => {
  await handleGetPosts(page.value, sort.value);
});
</script>
<template>
  <section
    class="w-[calc(100%-40px)] max-w-[1440px] flex flex-col items-center contents-box py-[83px] mb-10"
  >
    <h2
      class="flex flex-col items-center text-4xl font-dnf text-white relative mb-[30px]"
    >
      <title-left
        class="w-[184px] h-10 absolute right-[calc(100%+28px)] bottom-0"
      ></title-left>
      <span class="text-3xl">COMMA</span>
      COMMUNITY
      <title-right
        class="w-[184px] h-10 absolute left-[calc(100%+28px)] bottom-0"
      ></title-right>
    </h2>
    <router-link
      to="/post/write?category=free"
      class="w-[258px] h-12 flex items-center justify-center bg-white hover:bg-point-500 rounded-full text-xl font-dnf transition-all mb-2"
    >
      글 쓰러 가기
    </router-link>
    <div class="w-[calc(100%-40px)] max-w-[970px] flex flex-col">
      <div class="w-full flex items-center justify-end mb-5">
        <base-filter
          :sort="sort"
          :sortOption="sortOption"
          @change-sort="handleChangeSort"
        ></base-filter>
      </div>
      <div
        v-if="!postData.posts.length"
        class="w-full flex items-center justify-center py-[200px] text-white/50 text-2xl font-bold"
      >
        포스트가 존재하지 않습니다.
      </div>
      <div v-else class="grid grid-cols-4 gap-x-5 gap-y-[30px] mb-[70px]">
        <post-item
          v-for="value in postData.posts"
          :key="value.id"
          :item="value"
        ></post-item>
      </div>
      <div class="w-full flex justify-center">
        <pagination
          :page="page"
          :total="postData.total"
          @page-change="handleChangePage"
        ></pagination>
      </div>
    </div>
  </section>
</template>
<style scoped></style>
