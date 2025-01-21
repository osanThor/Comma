<script>
import PostCommentCardItem from "../post-detail/PostCommentCardItem.vue";
export default {
  name: "PostCommentCard",
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  components:{
    PostCommentCardItem,
  }
};
</script>

<template>
  <div class="comment-card">
    <PostCommentCardItem 
    :comment="comment" />
  </div>
</template>

<style scoped></style>
