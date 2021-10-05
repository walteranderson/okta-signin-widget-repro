module.exports = {
  restoreMocks: true,
  transform: {
    "^.+\\.[tj]s$": "babel-jest",
    "^.+\\.svelte$": [
      "svelte-jester",
      {
        preprocess: true,
      },
    ],
  },
  moduleFileExtensions: ["ts", "js", "svelte"],
};
