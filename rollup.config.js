import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import scss from "rollup-plugin-scss";
import pkg from "./package.json";
import json from "@rollup/plugin-json";
const extensions = [".js", ".jsx", ".ts", ".tsx"];
const name = "speedtestpro";

export default [
  {
    input: "./src/speedtestpro.ts",
    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en/#external
    external: [],
    plugins: [
      typescript(),
      // Allows node_modules resolution
      resolve({
        extensions,
        jsnext: true,
        browser: false,
      }),

      // Allow bundling cjs modules. Rollup doesn't understand cjs
      commonjs(),
      // Compile TypeScript/JavaScript files
      babel({
        extensions,
        babelHelpers: "bundled",
        // presets: [["solid", { generate: "ssr", hydratable: true }]],
        include: ["src/**/*"],
      }),
      scss(),
      json(),
    ],

    output: [
      {
        file: pkg.main,
        format: "cjs",
      },
      {
        file: pkg.module,
        format: "esm",
        // Removes the hash from the asset filename
        assetFileNames: "[name][extname]",
      },
    ],
  },
  {
    input: "./src/speedtestpro.ts",

    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en/#external
    external: [],
    plugins: [
      typescript(),
      // Allows node_modules resolution
      resolve({
        extensions,
        jsnext: true,
        browser: true,
      }),

      // Allow bundling cjs modules. Rollup doesn't understand cjs
      commonjs(),
      // Compile TypeScript/JavaScript files
      babel({
        extensions,
        babelHelpers: "bundled",
        // presets: [["solid", { generate: "ssr", hydratable: true }]],
        include: ["src/**/*"],
      }),
      scss(),
      json(),
    ],
    output: [
      {
        file: pkg.browser,
        format: "iife",
        sourcemap: "inline",
        name,
        // https://rollupjs.org/guide/en/#outputglobals
        globals: {
          "node:buffer": "window",
          axios: "node_modules/axios/dist/browser/axios.cjs.js",
        },
      },
    ],
  },
];
