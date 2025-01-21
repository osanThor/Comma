export const useModalStore = defineStore("modalStore", () => {
  const isOpen = ref(false);
  const modalOptions = reactive({
    type: "confirm", // "confirm" | "alert"
    message: "",
    btnTxt: "",
    handler: closeModal,
  });

  const openModal = (
    message,
    btnTxt,
    handler = closeModal,
    type = "confirm"
  ) => {
    isOpen.value = true;
    modalOptions.message = message;
    modalOptions.type = type;
    modalOptions.btnTxt = btnTxt;
    modalOptions.handler = handler;
  };
  function closeModal() {
    isOpen.value = false;
  }

  return {
    isOpen,
    modalOptions,
    openModal,
    closeModal,
  };
});
