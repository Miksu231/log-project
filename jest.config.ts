import type { Config } from "jest"

const config: Config = {
  globalSetup: "&lt;rootDir&gt;/jest.setup.js",
  moduleNameMapper: {
    "^@/(.*)$": "&lt;rootDir&gt;/$1",
    "^~/(.*)$": "&lt;rootDir&gt;/$1",
    "^vue$": "vue/dist/vue.common.js",
  },
  moduleFileExtensions: ["js", "vue", "json"],
  transform: {
    "^.+\\.js$": "babel-jest",
    ".*\\.(vue)$": "vue-jest",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "&lt;rootDir&gt;/components/**/*.vue",
    "&lt;rootDir&gt;/pages/**/*.vue",
  ],
}

export default config
