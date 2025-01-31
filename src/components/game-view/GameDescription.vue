<script setup>
defineProps({
  description: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div
    class="h-[239px] w-[287px] bg-main-500 text-base rounded-2xl text-white flex items-center justify-center pt-[27px] pr-[18px] pb-[19px] pl-[19px] mb-[38px]"
  >
    <ul class="list-decimal text-center list-inside w-full flex flex-col gap-2">
      <li
        v-for="(item, index) in description"
        :key="index"
        class="whitespace-pre-line break-keep"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>
