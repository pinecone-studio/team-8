import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../backend/src/graphql/schemas/*.ts",
  documents: "src/graphql/**/*.graphql",
  generates: {
    "src/graphql/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
  },
};

export default config;
