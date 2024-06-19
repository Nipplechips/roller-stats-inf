import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    ".(ts|tsx)": "ts-jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        "compiler": "ttypescript"
      }
    ]


  },
  "setupFiles": [
    "<rootDir>config.ts"
  ],
};
export default config;