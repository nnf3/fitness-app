import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "../server/graph/schema/*.graphqls",
  documents: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  generates: {
    "graphql/": {
      preset: "client",
      plugins: [
        "typescript",
        "typescript-operations"
      ],
    },
  },
};

export default config;