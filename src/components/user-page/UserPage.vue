<script setup>
import { useAuthStore } from "@/stores/auth.js";
import UserComment from "./UserComment.vue";
import UserLike from "./UserLike.vue";
import UserPost from "./UserPost.vue";
import UserRank from "./UserRank.vue";
import { ref } from "vue";

const uInfo = useAuthStore();
const pageSelected = ref("post");

function changePageSelected(page) {
  pageSelected.value = page; // Use .value to update ref
}
</script>

<template>
  <!-- Main Content -->
  <section
    class="w-full max-w-[1640px] h-screen mt-[120px] flex flex-col contents-box py-[90px] mb-10 px-4"
  >
    <!-- 전체 컨테이너를 flex로 만들고 좌우 정렬 -->
    <div class="flex w-full h-full">
      <!-- Sidebar - 왼쪽 고정 -->
      <div
        class="w-[210px] h-full border-white border-r-2 flex-shrink-0 mr-[135px]"
      >
        <h2
          v-on:click="changePageSelected('post')"
          :class="{
            'text-point-500 font-bold': pageSelected === 'post',
            'text-white': pageSelected !== 'post',
          }"
          class="block hover:text-point-500 cursor-pointer mb-[33px] text-2xl font-bold"
        >
          게시글
        </h2>

        <h2
          v-on:click="changePageSelected('like')"
          :class="{
            'text-point-500 font-bold': pageSelected === 'like',
            'text-white': pageSelected !== 'like',
          }"
          class="block hover:text-point-500 cursor-pointer mb-[33px] text-2xl font-bold"
        >
          좋아요
        </h2>

        <h2
          v-on:click="changePageSelected('rank')"
          :class="{
            'text-point-500': pageSelected === 'rank',
            'text-white': pageSelected !== 'rank',
          }"
          class="block hover:text-point-500 cursor-pointer mb-[33px] text-2xl font-bold"
        >
          개인별 랭크
        </h2>

        <h2
          v-on:click="changePageSelected('comment')"
          :class="{
            'text-point-500 font-bold': pageSelected === 'comment',
            'text-white': pageSelected !== 'comment',
          }"
          class="block hover:text-point-500 cursor-pointer mb-[33px] text-2xl font-bold"
        >
          작성한 댓글
        </h2>
      </div>

      <!-- Main Content Area - 오른쪽, 남은 공간 채움 -->
      <div class="flex-1 ml-8">
        <div>
          <!-- Conditionally Render Components -->
          <UserPost v-if="pageSelected === 'post'" />
          <UserLike v-if="pageSelected === 'like'" />
          <UserRank v-if="pageSelected === 'rank'" />
          <UserComment v-if="pageSelected === 'comment'" />
        </div>
      </div>
    </div>
    <img
      src="/assets/images/singleGhost.png"
      alt="ghost"
      class="absolute bottom-[-27px] -left-8 w-[129px] h-[118px] z-10 overflow-visible"
    />
  </section>
</template>

<style scoped>
@media (min-width: 640px) {
  .contents-box {
    padding: 60px;
  }
}

@media (min-width: 768px) {
  .contents-box {
    padding: 80px;
  }
}

@media (min-width: 1024px) {
  .contents-box {
    padding: 90px;
  }
}

@media (min-width: 1280px) {
  .contents-box {
    padding: 100px;
  }
}
</style>
