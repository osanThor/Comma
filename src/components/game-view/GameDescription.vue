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
    class="h-[239px] w-[287px] bg-main-500 text-base text-white flex items-center justify-center pt-[27px] pr-[18px] pb-[19px] pl-[19px] mb-[38px]"
  >
    <ul class="list-disc list-inside text-center w-full">
      <li
        v-for="(item, index) in description"
        :key="index"
        class="whitespace-pre-line"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>
