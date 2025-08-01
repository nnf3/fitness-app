import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "../server/graph/schema/*.graphqls",
  documents: "./documents/**/*.{ts,tsx}",
  generates: {
    "types/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        gqlImport: "graphql-tag#gql",
      },
    },
  },
};

export default config;