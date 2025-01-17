<script>
export default {
  name: "PostContent",
};
</script>

<template>
  <main class="flex flex-row items-center gap-12">
    <!-- 게시글 이미지 -->
    <section>
      <div
        class="bg-white w-[440px] h-[440px] rounded-xl flex items-center justify-center p-1"
      >
        <div class="w-[420px] h-[420px]">
          <img
            class="w-full h-full object-cover object-center rounded-xl"
            src="/assets/images/examplepost.png"
          />
        </div>
      </div>
    </section>
    <!-- 컨텐츠 -->
    <article
      class="flex flex-col items-start justify-between text-white w-[601px] h-[440px]"
    >
      <section class="w-full">
        <!-- 상단 -->
        <header class="flex flex-row items-end justify-between w-full">
          <!-- 제목 및 날짜 -->
          <div>
            <p class="font-medium text-white/70 mb-1">2025년 01월 15일</p>
            <h1 class="font-dnf text-4xl">신기록 달성!</h1>
          </div>

          <!-- 수정/삭제 버튼 -->
          <div class="flex flex-row gap-6 text-lg font-semibold text-white/50">
            <button class="hover:text-white/100">수정</button>
            <button class="hover:text-white/100">삭제</button>
          </div>
        </header>
        <hr class="border-2 opacity-30 w-full my-5 rounded-sm" />
        <!-- 게시글 내용 -->
        <section>
          <!-- 점수 및 플레이 타임 -->
          <div
            class="flex flex-row items-center gap-4 font-semibold text-lg mb-4 text-point-500"
          >
            <p>TIME | 01:00:00</p>
            <p>SCORE | 999점</p>
          </div>
          <!-- 본문 -->
          <p class="font-medium opacity-85">
            여러분은 최근에 어떤 기록을 달성하셨나요? 같이 공유하고 공략에 대해
            이야기해보면 좋겠습니다. 😃 읽어주셔서 감사합니다! 다음 목표는
            [새로운 목표, 랭크 등]를 달성하는 겁니다. 응원 부탁드려요!
          </p>
        </section>
      </section>
      <!-- 작성자 -->
      <p class="text-lg font-medium opacity-70">작성자 : 싹싹김치</p>
    </article>
  </main>
</template>

<style scoped></style>
