<script setup>
import TitleLeft from "@/components/common/icons/TitleLeft.vue";
import TitleRight from "@/components/common/icons/TitleRight.vue";
import Filter from "@/components/common/Filter.vue";
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

const handleGetPosts = async (page) => {
  try {
    const data = await getPostsByCategory("free", "desc", page, 12);
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
const handleChangeSort = (currentSort) => {
  sort.value = currentSort;
  page.value = 1;
};

onBeforeMount(async () => {
  await handleGetPosts(1);
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
      <TitleLeft
        class="w-[184px] h-10 absolute right-[calc(100%+28px)] bottom-0"
      />
      <span class="text-3xl">GAME</span>
      COMMUNITY
      <TitleRight
        class="w-[184px] h-10 absolute left-[calc(100%+28px)] bottom-0"
      />
    </h2>
    <RouterLink
      to="/post/write?category=free"
      class="w-[258px] h-12 flex items-center justify-center bg-white hover:bg-point-500 rounded-full text-xl font-dnf transition-all mb-2"
    >
      글 쓰러 가기
    </RouterLink>
    <div class="w-[calc(100%-40px)] max-w-[970px] flex flex-col">
      <div class="w-full flex items-center justify-end mb-5">
        <Filter
          :sort="sort"
          :sortOption="sortOption"
          @change-sort="handleChangeSort"
        />
      </div>
      <div class="grid grid-cols-4 gap-x-5 gap-y-[30px] mb-[70px]">
        <PostItem
          v-for="value in postData.posts"
          :key="value.id"
          :item="value"
        />
      </div>
      <div class="w-full flex justify-center">
        <Pagination
          :page="page"
          :total="postData.total"
          @page-change="handleChangePage"
        />
      </div>
    </div>
  </section>
</template>
<style scoped></style>
