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
  emits: ['setTitle', 'setContent'],
};
</script>

<template>
  <section class="relative w-full h-full flex flex-col justify-between">
    <div class="flex-grow">
      <!-- 제목 -->
      <input
        class="bg-transparent w-full font-dnf text-4xl focus:placeholder:opacity-0 text-white placeholder:text-white/70 focus:outline-none truncate-title"
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
        class="w-full min-h-[360px] h-full p-7 rounded-xl focus:outline-none focus:placeholder:opacity-0 resize-none overflow-y-auto placeholder:font-medium font-medium text-white bg-white/10 placeholder:text-white/50"
        placeholder="내용을 입력해주세요..."
      ></textarea>
    </div>
  </section>
</template>

<style scoped>
  .truncate-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
