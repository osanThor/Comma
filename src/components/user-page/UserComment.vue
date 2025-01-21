<script setup>
import Filter from "@/components/common/Filter.vue";
import CommentComponent from "./CommentComponent.vue";
const channelSelected = ref("game");

function changeChannelSelected(channel) {
  channelSelected.value = channel; // Use .value to update ref
}
</script>
<template>
  <h2
    class="text-lg font-bold cursor-pointer inline mr-8 pb-2 hover:text-point-500 hover:border-point-500"
    :class="{
      'text-point-500 border-point-500 border-b-4': channelSelected === 'game',
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

  <!-- 게시글 없을 시  -->
  <!-- <div
    class="text-center flex align-middle justify-center h-[60vh] grid place-items-center font-bold"
  >
    <nav class="text-white/50 text-[24px]">
      댓글을 남긴 포스트가 존재하지 않습니다.
    </nav>
  </div> -->
  <!-- 게시글 있을 시 -->
  <div>
    <div class="float-right mb-5 mt-[60px] mr-[124px]">
      <Filter
        :sort="sort"
        :sortOption="sortOption"
        @change-sort="handleChangeSort"
      />
    </div>

    <CommentComponent
      title="Title"
      comment="test"
      date="2025-01-20"
      like="7200"
    />
    <CommentComponent
      title="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio harum illo, quae eos possimus qui, vero error dicta aperiam quis vitae corporis deserunt soluta dolorem repudiandae consequatur illum veritatis. Voluptatem."
      comment="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Distinctio harum illo, quae eos possimus qui, vero error dicta aperiam quis vitae corporis deserunt soluta dolorem repudiandae consequatur illum veritatis. Voluptatem."
      date="2025-01-20"
      like="2769"
    />
    <CommentComponent
      title="Title"
      comment="test123"
      date="2025-01-20"
      like="999"
    />
    <CommentComponent
      title="Title"
      comment="test123"
      date="2025-01-20"
      like="0"
    />
  </div>

  <!-- <PostItem v-for="value in postData.posts" :key="value.id" :item="value" /> -->
</template>
<style scoped></style>
