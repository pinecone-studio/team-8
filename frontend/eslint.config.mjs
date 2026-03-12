import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    ignores: [".next/**", ".open-next/**", "out/**", "node_modules/**", "src/graphql/generated/**"],
  },
];

export default config;
