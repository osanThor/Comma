export const saveSystem = {
  data: {
    maxScore: 0,
    playTime: 0,
  },

  async load() {
    try {
      const savedData = localStorage.getItem("gameData");
      if (savedData) {
        this.data = JSON.parse(savedData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  },

  async save() {
    try {
      localStorage.setItem("gameData", JSON.stringify(this.data));
    } catch (error) {
      console.error("Error saving data:", error);
    }
  },
};
