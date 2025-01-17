<script>
export default {
  name: "PostCommentCardItem",
};
</script>

<template>
  <div class="flex flex-row items-center justify-between my-20">
    <!-- 작성자 프로필 이미지 -->
    <div class="w-16 h-16 rounded-full">
      <img
        class="w-full h-full object-cover object-center rounded-full"
        src="/assets/images/exProfile.png"
        alt=""
      />
    </div>
    
    <!-- 댓글 콘텐츠 -->
    <div>
      <!-- 닉네임 및 작성일시 -->
      <div class="flex flex-row items-center text-white gap-2">
        <p class="font-bold text-xl leading-0">Banana</p>
        <p class="font-medium text-xs text-white/50 leading-0 pt-1">2025.01.15</p>
      </div>
      <!-- 댓글 본문 -->
      <p class="w-[790px] h-auto text-white/70 font-semibold mr-10">
        이 스토리는 플레이어에게 선택과 결과에 따른 몰입감 있는 경험을 제공하며,
        시간과 운명이라는 테마를 중심으로 한 감동적인 여정을 그립니다.
      </p>
    </div>
    <!-- 좋아요 -->
    <div class="flex flex-col items-center font-medium text-white">
      <img src="/assets/images/icons/post-nolike-icon.png" alt="unlike">
      <p>21</p>
    </div>

  </div>
</template>

<style scoped></style>
