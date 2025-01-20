export const useToastStore = defineStore("toastStore", () => {
  const toasts = ref([]);

  const addToast = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    toasts.value.push({ id, type, message });

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  return { toasts, addToast, removeToast };
});
