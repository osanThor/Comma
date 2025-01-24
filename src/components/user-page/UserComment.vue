<script setup>
import Filter from "@/components/common/Filter.vue";
import CommentComponent from "./CommentComponent.vue";
import { getCommentsByUserId } from "@/services/comment.service";
import Pagination from "@/components/common/Pagination.vue";
const channelSelected = ref("game");
const comments = ref([]);
const page = ref(1);

const handleGetComments = async (postId) => {
  try {
    if (!postId) return alert("post id 입력");
    const commentsData = await getCommentsByUserId(postId, "desc", "1", "7");
    console.log(commentsData);
    if (commentsData) comments.value = commentsData;
  } catch (err) {
    console.error(err);
    alert(err);
  }
};

const commentsData = reactive({
  comments: [],
  total: 0,
});
// const handleChangePage = (currentPage) => {
//   page.value = currentPage;
// };

onBeforeMount(async () => {
  await handleGetComments("759dc524-84fb-40a8-81c5-d6758c286827");
});

function changeChannelSelected(channel) {
  channelSelected.value = channel; // Use .value to update ref
}
</script>
<template>
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
    <div class="float-right mb-5">
      <Filter
        :sort="sort"
        :sortOption="sortOption"
        @change-sort="handleChangeSort"
      />
    </div>
    <CommentComponent v-for="value in comments.data" :item="value" />
    <!-- <CommentComponent
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
    /> -->
  </div>
  <Pagination
    :page="page"
    :total="commentsData.totalCount"
    @page-change="handleChangePage"
  />
  <div class="w-full flex justify-center"></div>
</template>
<style scoped></style>
