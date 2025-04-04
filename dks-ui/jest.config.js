// See https://nextjs.org/docs/testing


import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

// See https://jestjs.io/docs/configuration
const jestConfig = {
  resetMocks: true,
  roots: ["<rootDir>/src"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  coverageReporters: ["text", "html", "lcov"],
  globals: {
    fetch: global.fetch,
  },
  setupFiles: ["./jest.polyfills.js"],
};

export default createJestConfig(jestConfig);
