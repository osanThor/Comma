<script setup>
const channelSelected = ref("game");
import Filter from "@/components/common/Filter.vue";
import { getLikedPosts } from "@/services/post.service";
import { useAuthStore } from "@/stores/auth.js";

const uInfo = useAuthStore();

const uId = ref(uInfo.user.id);

function changeChannelSelected(channel) {
  channelSelected.value = channel; // Use .value to update ref
}

const postData = reactive({
  posts: [],
  total: 0,
});

const handleGetLikedPosts = async (targetId) => {
  try {
    console.log(targetId);
    const data = await getLikedPosts(targetId, "desc", true, 1, 10);
    console.log(data);
    if (data) {
      console.log(1);
    }
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <div class>
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
  </div>

  <!-- 게시글 없을 시  -->

  <div
    class="text-center flex align-middle justify-center h-[60vh] place-items-center"
  >
    <nav class="text-white/50 text-2xl font-bold">
      좋아요를 누른 포스트가 존재하지 않습니다.
    </nav>
    <button
      @click="handleGetLikedPosts('759dc524-84fb-40a8-81c5-d6758c286827')"
    >
      try
    </button>
  </div>

  <!-- 게시글 있을 시  -->
  <!-- <div class="float-right mb-5">
    <Filter
      :sort="sort"
      :sortOption="sortOption"
      @change-sort="handleChangeSort"
    />
  </div>
  <div class="clear-right mt-5">
    <h1>123123</h1>
  </div> -->
  <!-- <PostItem v-for="value in postData.posts" :key="value.id" :item="value" /> -->
</template>
<style scoped></style>
