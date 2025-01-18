<script setup>
import TitleLeft from "@/components/common/icons/TitleLeft.vue";
import TitleRight from "@/components/common/icons/TitleRight.vue";
import SmallLike from "@/components/common/icons/SmallLike.vue";
import Filter from "@/components/common/Filter.vue";
import Avatar from "@/components/common/Avatar.vue";
import Pagination from "../common/Pagination.vue";

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
        <div
          class="text-white rounded-lg overflow-hidden"
          v-for="(_, idx) in postItems"
          :key="idx"
        >
          <div
            class="w-full h-[130px] flex items-center justify-center overflow-hidden"
          >
            <img
              class="object-cover min-w-full min-h-full"
              src="/assets/images/examplepost.png"
              alt="post thumbnail"
            />
          </div>
          <div class="p-4 bg-main-500">
            <div class="text-sm font-dnf mb-3">님들 이거 해보심?</div>
            <div class="line-clamp-2 text-xs opacity-70 mb-3">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </div>
            <div class="w-full flex justify-between">
              <div class="text-xs flex items-center gap-1">
                <Avatar size="xs" /> 싹싹김치
              </div>
              <div class="text-[10px] flex items-center gap-1 text-point-500">
                <SmallLike />
                999+
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex justify-center">
        <Pagination :total="220" />
      </div>
    </div>
  </section>
</template>
<style scoped></style>
