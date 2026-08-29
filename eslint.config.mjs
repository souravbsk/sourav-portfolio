import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// eslint-config-next 16 ships native flat configs. Routing them through
// FlatCompat instead crashes ESLint 10 while validating the legacy schema.
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "public/**",
    ],
  },
  ...coreWebVitals,
  ...typescript,
  {
    settings: {
      // Pinned rather than auto-detected: the eslint-plugin-react bundled with
      // eslint-config-next detects the version through an ESLint 9 API that
      // ESLint 10 removed, which throws while loading the react rules.
      react: { version: "19.2" },
    },
    rules: {
      // react-three-fiber sets mesh/material props that React DOM doesn't know.
      "react/no-unknown-property": "off",
    },
  },
];

export default eslintConfig;
