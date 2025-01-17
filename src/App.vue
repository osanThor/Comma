<script setup>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";
const route = useRoute();
const layout = computed(() => {
  const layout = route.meta.layout || "DefaultLayout";
  return layout === "DefaultLayout" ? DefaultLayout : EmptyLayout;
});
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
