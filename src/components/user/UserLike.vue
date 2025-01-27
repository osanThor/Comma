<script setup>
import { twMerge } from "tailwind-merge";
import UserPagePostItem from "./UserPagePostItem.vue";
import BaseFilter from "@/components/common/Filter.vue";
import { getLikedPosts } from "@/services/post.service";
import { useAuthStore } from "@/stores/auth.js";
import Pagination from "../common/Pagination.vue";

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

const channelSelected = ref("game");

const page = ref(1);
const sort = ref("likes");

const sortOption = [
  { name: "인기순", value: "likes" },
  { name: "최신순", value: "desc" },
];

const postData = reactive({
  posts: [],
  total: 0,
});
const handleGetPosts = async (page, sort, isComma) => {
  try {
    const data = await getLikedPosts(props.userId, sort, isComma, page, 12);
    if (data) {
      postData.posts = data.data;
      postData.total = data.totalCount;
    }
  } catch (err) {
    console.error(err);
  }
};
const changeChannelSelected = async (channel) => {
  if (channelSelected.value !== channel) {
    channelSelected.value = channel; // Use .value to update ref
    page.value = 1;
    await handleGetPosts(
      page.value,
      sort.value,
      channelSelected.value === "comma"
    );
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
  await handleGetPosts(1, sort.value, channelSelected.value === "comma");
});

watch(page, async () => {
  await handleGetPosts(
    page.value,
    sort.value,
    channelSelected.value === "comma"
  );
});
</script>

<template>
  <div class="flex flex-col flex-grow">
    <div class="w-full flex justify-between items-center">
      <div class="flex items-center gap-4">
        <button
          :class="
            twMerge(
              'text-lg font-bold text-white px-7 pb-4 border-b-4  hover:text-point-500 hover:border-point-500',
              channelSelected === 'game'
                ? 'text-point-500 border-point-500 border-opacity-100'
                : 'border-black border-opacity-0'
            )
          "
          @click="changeChannelSelected('game')"
        >
          GAME
        </button>
        <button
          :class="
            twMerge(
              'text-lg font-bold text-white px-7 pb-4 border-b-4 hover:text-point-500 hover:border-point-500',
              channelSelected === 'comma'
                ? 'text-point-500 border-point-500 border-opacity-100'
                : 'border-black border-opacity-0'
            )
          "
          @click="changeChannelSelected('comma')"
        >
          COMMA
        </button>
      </div>
      <base-filter
        :sort="sort"
        :sortOption="sortOption"
        @change-sort="handleChangeSort"
      ></base-filter>
    </div>
    <div
      v-if="!postData.posts.length"
      class="w-full flex items-center flex-grow justify-center py-[200px] text-white/50 text-2xl font-bold"
    >
      좋아요 누른 포스트가 존재하지 않습니다.
    </div>
    <div
      v-else
      class="grid grid-cols-4 mt-[30px] gap-x-5 gap-y-[14px] mb-[70px]"
    >
      <user-page-post-item
        v-for="value in postData.posts"
        :key="value.id"
        :item="value"
      ></user-page-post-item>
    </div>
    <div class="w-full flex justify-center">
      <pagination
        :page="page"
        :total="postData.total"
        @page-change="handleChangePage"
      ></pagination>
    </div>
  </div>
</template>
<style scoped></style>
