import typescript from "rollup-plugin-typescript2";
import sourceMaps from "rollup-plugin-sourcemaps";
import { terser } from "rollup-plugin-terser";
import clear from "rollup-plugin-clear";

function shebang() {
    return {
        name: "shebang",
        generateBundle(_, bundle) {
            for (const file in bundle) {
                if (bundle[file].type === "chunk" && file.endsWith(".js")) {
                    bundle[file].code = `#!/usr/bin/env node\n${bundle[file].code}`
                }
            }
        }
    }
}

export default {
    input: {
        "protoc-gen-js-fix": "src/protoc-gen-js-fix.ts",
        "protoc-gen-ts-fix": "src/protoc-gen-ts-fix.ts",
        "protoc": "src/protoc.ts",
        "protox": "src/protox.ts"
    },
    output: {
        dir: "dist",
        format: "cjs",
        sourcemap: process.argv.indexOf("--mode=production") === -1
    },
    preserveModules: true,
    plugins: [
        clear({ targets: ["dist"] }),
        typescript({ tsconfig: "./tsconfig.json" }),
        ...(process.argv.indexOf("--mode=production") > -1 ? [terser(), shebang()] : [sourceMaps()])
    ],
}