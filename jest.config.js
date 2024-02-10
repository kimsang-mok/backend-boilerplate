/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/*.test.(ts|js)"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"]
};
