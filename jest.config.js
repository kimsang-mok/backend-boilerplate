/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json"
    }
  },
  preset: "ts-jest",
  moduleFileExtensions: ["ts", "js"],
  // transform: {
  //   "^.+\\.(ts|tsx)$": "./node_modules/ts-jest/preprocessor.js"
  // },
  testMatch: ["**/**/*.test.(ts|js)"],
  testEnvironment: "node"
};
