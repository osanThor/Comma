<script setup>
import NotFoundIcon from "@/components/common/icons/NotFoundIcon.vue";
</script>
<template>
  <main
    class="bg-size font-pretendard font-medium bg-main flex flex-col items-center justify-center"
  >
    <NotFoundIcon class="mb-8" />
    <div class="font-dnf text-white text-[50px] mb-10">Oops!</div>
    <div class="text-center text-white text-xl mb-[53px] font-semibold">
      삐빅! 페이지가 우주여행 중이에요
      <br />
      나중에 다시 와주세요!
    </div>
    <RouterLink
      to="/"
      class="w-[365px] h-[58px] flex items-center justify-center transition-all bg-point-500 hover:bg-point-700 text-xl font-semibold text-white rounded-full"
      ><img class="w-[114px] mr-1" src="/assets/images/logo.png" alt="logo" />로
      다시 돌아가기</RouterLink
    >
  </main>
</template>
<style scoped></style>
