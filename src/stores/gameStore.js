import { defineStore } from 'pinia';

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    maxScore: 0,
    playTime: 0,
  }),

  actions: {
    updateMaxScore(newScore) {
      if (newScore > this.maxScore) {
        this.maxScore = newScore;
      }
    },

    updatePlayTime(newTime) {
      this.playTime = newTime;
    },

    async saveDataToServer() {
      try {
        console.log('Saving data to server:', {
          maxScore: this.maxScore,
          playTime: this.playTime,
        });
      } catch (error) {
        console.error('Error saving data:', error);
      }
    },
  },
});
