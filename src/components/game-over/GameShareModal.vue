<script setup>
import AfterGameOverButton from "./AfterGameOverButton.vue";
</script>
<template>
  <div
    class="w-[538px] h-[754px] border-4 border-white rounded-[28px] bg-main-500"
  >
    <header class="flex flex-col items-center">
      <h1 class="mt-[52px] text-white font-dnf text-3xl opacity-70">
        제목을 입력해 주세요..
      </h1>
      <div class="w-[372px] h-[2px] bg-white mt-3 opacity-50"></div>
    </header>
    <main class="flex flex-col items-center">
      <section
        class="relative w-[372px] h-[216px] border-[6px] mt-6 border-white rounded-[10px]"
      >
        <button
          class="absolute bottom-[-16px] right-[-16px] w-[42px] h-[42px] bg-point-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg"
        >
          <img
            src="/assets/images/icons/gameOver-postEdit-ImgPlus-icon.svg"
            alt="Add Image"
          />
        </button>
      </section>
      <section
        class="w-[372px] h-[230px] border-2 mt-6 border-main-100 rounded-[10px] bg-white bg-opacity-10"
      >
        <textarea
          class="w-full h-full pt-6 pl-8 text-white bg-transparent placeholder:text-main-100 placeholder:font-pretendard placeholder:text-base focus:outline-none resize-none"
          placeholder="최고의 순간을 공유해 보세요!"
        ></textarea>
      </section>
    </main>
    <footer class="flex justify-between mx-[82px] mt-[30px]">
      <AfterGameOverButton text="CANCEL" bg-color="bg-main-400" />
      <AfterGameOverButton text="SHARE" />
    </footer>
  </div>
</template>
<style scoped></style>
