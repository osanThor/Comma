<script setup>
import TitleLeft from "@/components/common/icons/TitleLeft.vue";
import TitleRight from "@/components/common/icons/TitleRight.vue";
import Filter from "@/components/common/Filter.vue";
import Pagination from "@/components/common/Pagination.vue";
import PostItem from "../common/PostItem.vue";

const postItems = ref(Array(12).fill(0));
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
        <Filter />
      </div>
      <div class="grid grid-cols-4 gap-x-5 gap-y-[30px] mb-[70px]">
        <PostItem v-for="(_, idx) in postItems" />
      </div>
      <div class="w-full flex justify-center">
        <Pagination :total="220" />
      </div>
    </div>
  </section>
</template>
<style scoped></style>
