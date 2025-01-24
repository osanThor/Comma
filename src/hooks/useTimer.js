export function useTimer() {
  const startTime = ref(0);
  const currentTime = ref(0);
  let timerId = null;

  const start = () => {
    if (timerId) return;
    startTime.value = Date.now() - currentTime.value;
    timerId = setInterval(() => {
      currentTime.value = Date.now() - startTime.value;
    }, 100);
  };

  const stop = () => {
    if (!timerId) return;
    clearInterval(timerId);
    timerId = null;
  };

  const reset = () => {
    stop();
    currentTime.value = 0;
  };

  onUnmounted(() => {
    stop(); // 컴포넌트 언마운트 시 정리
  });

  return {
    currentTime, // 실시간 값
    start,
    stop,
    reset,
  };
}
