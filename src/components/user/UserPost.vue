<script setup>
import UserPagePostItem from "./UserPagePostItem.vue";
import UserProfile from "./UserProfile.vue";
import Filter from "@/components/common/Filter.vue";
import { getPostsByCategory } from "@/services/post.service";

const props = defineProps({
  userId: {
    type: String,
    default: "",
  },
  user: {
    type: Object,
    require: true,
  },
});

const channelSelected = ref("game");

function changeChannelSelected(channel) {
  channelSelected.value = channel; // Use .value to update ref
}

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

const handleGetPosts = async () => {
  try {
    const data = await getPostsByCategory("free", "desc", 1, 12);
    if (data) {
      postData.posts = data.data;
      postData.total = data.totalCount;
    }
  } catch (err) {
    console.error(err);
  }
};

const handleChangeSort = async (currentSort) => {
  if (sort.value !== currentSort) {
    sort.value = currentSort;
    page.value = 1;
    await handleGetPosts(page.value, sort.value);
  }
};

onBeforeMount(async () => {
  await handleGetPosts(1);
});

watch(page, async () => {
  await handleGetPosts(page.value, sort.value);
});
</script>

<template>
  <user-profile :user="user"></user-profile>
  <div class="mt-16">
    <h2
      class="text-lg font-bold cursor-pointer inline mr-8 pb-2 hover:text-point-500 hover:border-point-500"
      :class="{
        'text-point-500 border-point-500 border-b-4':
          channelSelected === 'game',
        'text-white': channelSelected !== 'game',
        'border-b-2': channelSelected === 'game',
      }"
      @click="changeChannelSelected('game')"
    >
      GAME
    </h2>
    <h2
      class="text-lg font-bold cursor-pointer inline mr-8 pb-2 hover:text-point-500 hover:border-point-500"
      :class="{
        'text-point-500 font-bold border-point-500 border-b-4':
          channelSelected === 'comma',
        'text-white': channelSelected !== 'comma',
        'border-b-2': channelSelected === 'comma',
      }"
      @click="changeChannelSelected('comma')"
    >
      COMMA
    </h2>

    <div class="flex float-right my-2">
      <Filter
        :sort="sort"
        :sortOption="sortOption"
        @change-sort="handleChangeSort"
      />
    </div>
    <div class="grid grid-cols-4 mt-[30px] gap-x-5 gap-y-[14px]">
      <UserPagePostItem
        v-for="value in postData.posts"
        :key="value.id"
        :item="value"
      />
    </div>
  </div>
</template>

<style scoped></style>
