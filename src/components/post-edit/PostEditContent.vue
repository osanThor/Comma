<script>
export default {
  name: "PostEditContent",
  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
  emits: ['setTitle', 'setContent', 'save'],
};
</script>

<template>
  <!-- todo: 스크롤 수정하기 -->
  <section class="relative w-[600px] h-[588px] flex flex-col justify-between">
    <div>
      <!-- 제목 -->
      <input
        class="bg-transparent w-full font-dnf text-4xl focus:placeholder:opacity-0 text-white placeholder:text-white/70 focus:outline-none"
        type="text"
        :value="title"
        maxlength="15"
        @input="$emit('setTitle', $event.target.value)"
        placeholder="제목을 입력해주세요..."
      />
      <hr class="border-2 border-white/30 w-full my-5" />

      <!-- 컨텐츠 작성 -->
      <textarea
        :value="content"
        @input="$emit('setContent', $event.target.value)"
        id=""
        class="w-full h-[356px] p-7 rounded-xl focus:outline-none focus:placeholder:opacity-0 resize-none overflow-y-auto placeholder:font-medium font-medium text-white bg-white/10 placeholder:text-white/50"
        placeholder="내용을 입력해주세요..."
      ></textarea>
    </div>

    <button
      @click="$emit('save')"
      class="bg-white w-28 h-10 rounded-xl font-dnf text-main-500 disabled:opacity-50 hover:bg-point-500 ml-auto transition-all duration-60 transform hover:scale-110 hover:shadow-xl"
    >
      저장
    </button>
  </section>
</template>

<style scoped></style>
