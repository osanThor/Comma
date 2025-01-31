<script setup>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";
import AppToast from "@/components/common/Toast.vue";
import AppModal from "@/components/common/Modal.vue";
const route = useRoute();
const layout = computed(() => {
  const layout = route.meta.layout || "DefaultLayout";
  return layout === "DefaultLayout" ? DefaultLayout : EmptyLayout;
});
</script>

<template>
  <component :is="layout">
    <router-view></router-view>
  </component>
  <app-toast></app-toast>
  <app-modal></app-modal>
</template>
