<script setup>
import PostItem from "../common/PostItem.vue";
import UserProfile from "./UserProfile.vue";
import Filter from "@/components/common/Filter.vue";
import { getPostsByCategory } from "@/services/post.service";

const channelSelected = ref("game");

function changeChannelSelected(channel) {
  channelSelected.value = channel; // Use .value to update ref
}
</script>
<template>
  <UserProfile />
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
    <!-- Todo 게시글 있을때만 보이도록 분기처리 -->
    <div class="float-right mr-28">
      <Filter
        :sort="sort"
        :sortOption="sortOption"
        @change-sort="handleChangeSort"
      />
    </div>
  </div>
  <!-- 게시글 없을 시 -->
  <div
    class="text-center flex align-middle justify-center h-[45vh] place-items-center"
  >
    <nav class="text-white/50 text-2xl font-bold">
      작성한 포스트가 존재하지 않습니다.
    </nav>
  </div>
  <!-- 게시글 있을 시  post item 무한스크롤-->
  <!-- <div>
  
    <PostItem item="" />
  </div> -->
</template>
<style scoped></style>
