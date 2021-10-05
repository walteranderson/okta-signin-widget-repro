import svelte from "rollup-plugin-svelte-hot";
import Hmr from "rollup-plugin-hot";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import { copySync, removeSync } from "fs-extra";
import { spassr } from "spassr";
import getConfig from "@roxi/routify/lib/utils/config";
import autoPreprocess from "svelte-preprocess";
import postcssImport from "postcss-import";
import { config as dotenvConfig } from "dotenv";
import replace from "@rollup/plugin-replace";

dotenvConfig();

const { distDir } = getConfig(); // use Routify's distDir for SSOT
const assetsDir = "assets";
const buildDir = `${distDir}/build`;
const isNollup = !!process.env.NOLLUP;
const production = !process.env.ROLLUP_WATCH;

// clear previous builds
removeSync(distDir);
removeSync(buildDir);

const serve = () => ({
  writeBundle: async () => {
    const options = {
      assetsDir: [assetsDir, distDir],
      entrypoint: `${assetsDir}/__app.html`,
      script: `${buildDir}/main.js`,
    };
    spassr({ ...options, port: 5000 });
    spassr({
      ...options,
      ssr: true,
      port: 5005,
      ssrOptions: { inlineDynamicImports: true, dev: true },
    });
  },
});
const copyToDist = () => ({
  writeBundle() {
    copySync(assetsDir, distDir);
  },
});

export default {
  preserveEntrySignatures: false,
  input: [`src/main.js`],
  output: {
    sourcemap: true,
    format: "iife",
    dir: buildDir,
    // for performance, disabling filename hashing in development
    chunkFileNames: `[name]${(production && "-[hash]") || ""}.js`,
  },
  plugins: [
    /**
     * Configure environment variables
     */
    replace({
      // https://github.com/rollup/plugins/tree/master/packages/replace#preventassignment
      // Prevents replacing strings where they are followed by a single equals sign.
      preventAssignment: true,
      values: {
        "process.env": JSON.stringify({
          FE_OKTA_AUTH_DOMAIN: process.env.FE_OKTA_AUTH_DOMAIN,
          FE_OKTA_AUTH_TOKEN: process.env.FE_OKTA_AUTH_TOKEN,
          FE_OKTA_CLIENT_ID: process.env.FE_OKTA_CLIENT_ID,
          FE_OKTA_REDIRECT_BASE_URL: process.env.FE_OKTA_REDIRECT_BASE_URL,
        }),
      },
    }),

    svelte({
      emitCss: false,
      hot: isNollup,
      preprocess: [
        autoPreprocess({
          postcss: { plugins: [postcssImport()] },
          defaults: { style: "postcss" },
        }),
      ],
    }),

    // resolve matching modules from current working directory
    resolve({
      browser: true,
      dedupe: (importee) => !!importee.match(/svelte(\/|$)/),
    }),
    commonjs(),

    production && terser(),
    !production && !isNollup && serve(),
    !production && !isNollup && livereload(distDir), // refresh entire window when code is updated
    !production && isNollup && Hmr({ inMemory: true, public: assetsDir }), // refresh only updated code
    {
      // provide node environment on the client
      transform: (code) => ({
        code: code.replace(
          /process\.env\.NODE_ENV/g,
          `"${process.env.NODE_ENV}"`
        ),
        map: { mappings: "" },
      }),
    },
    production && copyToDist(),
  ],
  watch: {
    clearScreen: false,
    buildDelay: 100,
  },
};
