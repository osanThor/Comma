<script setup></script>
<template>
  <div
    class="flex bg-white gap-4 w-full max-w-[700px] h-full items-center justify-center p-10"
  >
    <canvas id="board" class="border-2 border-main-500 w-full"></canvas>
    <div class="right-column">
      <div>
        <h1>TETRIS</h1>
        <p>Score: <span id="score">0</span></p>
        <p>Lines: <span id="lines">0</span></p>
        <p>Level: <span id="level">0</span></p>
        <canvas id="next" class="next"></canvas>
      </div>
      <button onclick="" class="play-button">Play</button>
    </div>
  </div>
</template>
<style scoped></style>
