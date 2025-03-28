// Copyright (c) 2025 EFramework Organization. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { XEnv, XFile, XLog, XString, XUtility } from "org.eframework.uni.util"
import * as child_process from "child_process"
import * as fs from "fs"
import { https } from "follow-redirects"

export namespace Install {
    export async function Process(args: string[]) {
        const goTool = new Map<string, string>([["protoc-gen-go", "latest"], ["protoc-gen-go-grpc", "latest"]])
        const csTool = new Map<string, string>([["protoc-gen-csharp", "latest"]])
        const jsTool = new Map<string, string>([["protoc-gen-js", "latest"], ["protoc-gen-web-grpc", "1.5.0"], ["protoc-gen-ts", "latest"]])
        const tsTool = new Map<string, string>([["protoc-gen-ts", "latest"]])

        const nargs = new Map<string, string>()
        for (let i = 0; i < args.length; i++) {
            const arg = args[i]
            if (arg.startsWith("--")) {
                const strs = arg.split("=")
                const key = strs[0].replace("--", "").trim()
                const value = strs.length > 1 ? strs[1].trim() : null
                nargs.set(key, value)
            }
        }

        const all = nargs.has("all")
        let bgo = nargs.has("go_out") || nargs.has("go-grpc_out")
        let bcs = nargs.has("csharp_out") || nargs.has("csharp-grpc_out")
        let bjs = nargs.has("js_out") || nargs.has("js-grpc_out")
        let bts = nargs.has("ts_out")
        if (nargs.has("install")) {
            nargs.forEach((_, k) => {
                if (goTool.has(k)) bgo = true
                else if (csTool.has(k)) bcs = true
                else if (jsTool.has(k)) bjs = true
                else if (tsTool.has(k)) bts = true
            })
        }

        await Protoc(nargs)
        if (all || bgo || bcs || bjs || bts) {
            if (all || bgo) await GoTool(nargs)
            if (all || bcs) await CSTool(nargs)
            if (all || bjs) await JSTool(nargs)
            if (all || bts) await TSTool(nargs)
        }
    }

    async function Protoc(args: Map<string, string> = new Map()) {
        const local = XFile.PathJoin(XEnv.LocalPath, "protoc.ver")
        if (XFile.HasFile(local) && !args.get("protoc")) {
            XLog.Debug(`Protoc: @${XFile.OpenText(local)}`)
        } else {
            const version = args.get("protoc") ? args.get("protoc") : "30.2"

            const gitproxy = args.get("gitproxy") ? args.get("gitproxy") : "https://ghproxy.cn/"

            const binurl = {
                "win32_x86_32": `https://github.com/protocolbuffers/protobuf/releases/download/v${version}/protoc-${version}-win32.zip`,
                "win32_x86_64": `https://github.com/protocolbuffers/protobuf/releases/download/v${version}/protoc-${version}-win32.zip`,
                "linux_x86_32": `https://github.com/protocolbuffers/protobuf/releases/download/v${version}/protoc-${version}-linux-x86_32.zip`,
                "linux_x86_64": `https://github.com/protocolbuffers/protobuf/releases/download/v${version}/protoc-${version}-linux-x86_64.zip`,
                "darwin_x86_64": `https://github.com/protocolbuffers/protobuf/releases/download/v${version}/protoc-${version}-osx-x86_64.zip`,
                "darwin_aarch_64": `https://github.com/protocolbuffers/protobuf/releases/download/v${version}/protoc-${version}-osx-aarch_64.zip`
            }

            try {
                const plat = process.platform
                const arch = process.arch === "arm64" ? "aarch_64" : (process.arch === "x64" ? "x86_64" : "x86_32")
                const bin = plat + "_" + arch
                const dir = XFile.PathJoin(XEnv.LocalPath, "protoc")

                let url = binurl[bin]
                if (!url) throw new Error(`Unsupported platform: ${bin}. Was not able to find a proper version.`)

                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLocaleLowerCase()
                if (XString.Contains(tz, "shanghai") || args.has("gitproxy") || process.env.GITHUB_ACTIONS != null) {
                    url = `${gitproxy.endsWith("/") ? gitproxy : gitproxy + "/"}${url}`
                    XLog.Debug(`Install.Protoc: using git proxy of ${gitproxy}.`)
                }
                XLog.Debug(`Install.Protoc: fetch from ${url}.`)

                XFile.DeleteDirectory(dir)
                XFile.CreateDirectory(dir)

                const zip = XFile.PathJoin(dir, XFile.FileName(url))
                const ws = fs.createWriteStream(zip)

                await new Promise((resolve, reject) => {
                    https.get(url, (response) => {
                        response.pipe(ws)
                        ws.on("finish", () => {
                            ws.close(() => {
                                XLog.Debug(`Install.Protoc: fetch into ${zip}.`)
                                try { XFile.Unzip(zip, dir, resolve) } catch (err) { reject(err) }
                            })
                        })
                    }).on("error", reject)
                })

                XFile.DeleteFile(zip)

                const file = XFile.PathJoin(dir, "bin", plat === "win32" ? "protoc.exe" : "protoc")
                fs.chmodSync(file, 0o755)
                XLog.Debug(`Install.Protoc: chmod to 0o755.`)

                XLog.Debug(`Install.Protoc: @${version} has been installed.`)
                XFile.SaveText(local, version)
            } catch (err) {
                XLog.Error(`Install.Protoc: @${version} install failed: ${err}`)
                throw err
            }
        }
    }

    async function GoTool(args: Map<string, string> = new Map()) {
        const httpproxy = process.env["HTTPS_PROXY"]
        const goproxy = args.get("goproxy") ? args.get("goproxy") : "https://goproxy.cn,direct"

        const genGoVer = args.get("protoc-gen-go") ? args.get("protoc-gen-go") : "latest"
        const genGoVerLocal = XFile.PathJoin(XEnv.LocalPath, "protoc-gen-go.ver")
        if (XFile.HasFile(genGoVerLocal) && !args.get("protoc-gen-go")) {
            XLog.Debug(`GoTool(protoc-gen-go): @${XFile.OpenText(genGoVerLocal)}`)
        } else {
            try {
                if (!XString.IsNullOrEmpty(httpproxy)) XLog.Debug(`Install.GoTool(protoc-gen-go): using http proxy of ${httpproxy}.`)

                const opt = XUtility.ExecOpt(XEnv.LocalPath)
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLocaleLowerCase()
                const gp = child_process.execSync("go env GOPROXY").toString().trim()
                if ((XString.Contains(tz, "shanghai") && XString.IsNullOrEmpty(httpproxy) && !XString.Contains(gp, "http")) || args.has("goproxy")) {
                    opt.env["GOPROXY"] = goproxy
                    XLog.Debug(`Install.GoTool(protoc-gen-go): using go proxy of ${goproxy}.`)
                }
                XLog.Debug(`Install.GoTool(protoc-gen-go): ${child_process.execSync(`go install google.golang.org/protobuf/cmd/protoc-gen-go@${genGoVer}`, opt)}`)

                XLog.Debug(`Install.GoTool(protoc-gen-go): @${genGoVer} has been installed.`)
                XFile.SaveText(genGoVerLocal, genGoVer)
            } catch (err) {
                XLog.Error(`Install.GoTool(protoc-gen-go): @${genGoVer} install failed: ${err}`)
                throw err
            }
        }

        const genGoGRpcVer = args.get("protoc-gen-go-grpc") ? args.get("protoc-gen-go-grpc") : "latest"
        const genGoGRpcVerLocal = XFile.PathJoin(XEnv.LocalPath, "protoc-gen-go-grpc.ver")
        if (XFile.HasFile(genGoGRpcVerLocal) && !args.get("protoc-gen-go-grpc")) {
            XLog.Debug(`GoTool(protoc-gen-go-grpc): @${XFile.OpenText(genGoGRpcVerLocal)}`)
        } else {
            try {
                if (!XString.IsNullOrEmpty(httpproxy)) XLog.Debug(`Install.GoTool(protoc-gen-go-grpc): using http proxy of ${httpproxy}.`)

                const opt = XUtility.ExecOpt(XEnv.LocalPath)
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLocaleLowerCase()
                const gp = child_process.execSync("go env GOPROXY").toString().trim()
                if ((XString.Contains(tz, "shanghai") && XString.IsNullOrEmpty(httpproxy) && !XString.Contains(gp, "http")) || args.has("goproxy")) {
                    opt.env["GOPROXY"] = goproxy
                    XLog.Debug(`Install.GoTool(protoc-gen-go-grpc): using go proxy of ${goproxy}.`)
                }
                XLog.Debug(`Install.JSTool(protoc-gen-go-grpc): ${child_process.execSync(`go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@${genGoGRpcVer}`, opt)}`)

                XLog.Debug(`Install.GoTool(protoc-gen-go-grpc): @${genGoGRpcVer} has been installed.`)
                XFile.SaveText(genGoGRpcVerLocal, genGoGRpcVer)
            } catch (err) {
                XLog.Error(`Install.GoTool(protoc-gen-go-grpc): @${genGoGRpcVer} install failed: ${err}`)
                throw err
            }
        }
    }

    async function CSTool(args: Map<string, string> = new Map()) {
        // TODO
    }

    async function JSTool(args: Map<string, string> = new Map()) {
        const genJSVer = args.get("protoc-gen-js") ? args.get("protoc-gen-js") : "3.21.4"
        const genJSVerLocal = XFile.PathJoin(XEnv.LocalPath, "protoc-gen-js.ver")
        if (XFile.HasFile(genJSVerLocal) && !args.get("protoc-gen-js")) {
            XLog.Debug(`JSTool(protoc-gen-js): @${XFile.OpenText(genJSVerLocal)}`)
        } else {
            const gitproxy = args.get("gitproxy") ? args.get("gitproxy") : "https://ghproxy.cn/"
            const binurl = {
                "win32_x86_64": `https://github.com/protocolbuffers/protobuf-javascript/releases/download/v${genJSVer}/protobuf-javascript-${genJSVer}-win64.zip`,
                "linux_x86_32": `https://github.com/protocolbuffers/protobuf-javascript/releases/download/v${genJSVer}/protobuf-javascript-${genJSVer}-linux-x86_32.zip`,
                "linux_x86_64": `https://github.com/protocolbuffers/protobuf-javascript/releases/download/v${genJSVer}/protobuf-javascript-${genJSVer}-linux-x86_64.zip`,
                "darwin_x86_64": `https://github.com/protocolbuffers/protobuf-javascript/releases/download/v${genJSVer}/protobuf-javascript-${genJSVer}-osx-x86_64.zip`,
                "darwin_aarch_64": `https://github.com/protocolbuffers/protobuf-javascript/releases/download/v${genJSVer}/protobuf-javascript-${genJSVer}-osx-aarch_64.zip`
            }

            try {
                const plat = process.platform
                const arch = process.arch === "arm64" ? "aarch_64" : (process.arch === "x64" ? "x86_64" : "x86_32")
                const bin = plat + "_" + arch

                let url = binurl[bin]
                if (!url) throw new Error(`Unsupported platform: ${bin}. Was not able to find a proper version.`)

                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLocaleLowerCase()
                if (XString.Contains(tz, "shanghai") || args.has("gitproxy") || process.env.GITHUB_ACTIONS != null) {
                    url = `${gitproxy.endsWith("/") ? gitproxy : gitproxy + "/"}${url}`
                    XLog.Debug(`Install.JSTool(protoc-gen-js): using git proxy of ${gitproxy}.`)
                }
                XLog.Debug(`Install.JSTool(protoc-gen-js): fetch from ${url}.`)

                const dir = XFile.PathJoin(XEnv.LocalPath, "protobuf-javascript")
                XFile.DeleteDirectory(dir)
                XFile.CreateDirectory(dir)
                const zip = XFile.PathJoin(XEnv.LocalPath, XFile.FileName(url))
                const ws = fs.createWriteStream(zip)

                await new Promise((resolve, reject) => {
                    https.get(url, (response) => {
                        response.pipe(ws)
                        ws.on("finish", () => {
                            ws.close(() => {
                                XLog.Debug(`Install.JSTool(protoc-gen-js): fetch into ${zip}.`)
                                try { XFile.Unzip(zip, dir, resolve) } catch (err) { reject(err) }
                            })
                        })
                    }).on("error", reject)
                })

                let name = process.platform === "win32" ? "protoc-gen-js.exe" : "protoc-gen-js"
                let src = XFile.PathJoin(dir, "bin", name)
                if (!XFile.HasFile(src)) src = XFile.PathJoin(dir, XFile.FileName(url, false), "bin", name)   // win32的压缩包多了一个层级
                const dst = XFile.PathJoin(XEnv.LocalPath, name)
                XFile.CopyFile(src, dst)

                fs.chmodSync(dst, 0o755)
                XLog.Debug(`Install.JSTool(protoc-gen-js): chmod to 0o755.`)

                XLog.Debug(`Install.JSTool(protoc-gen-js): @${genJSVer} has been installed.`)
                XFile.SaveText(genJSVerLocal, genJSVer)

                XFile.DeleteFile(zip)
            } catch (err) {
                XLog.Error(`Install.JSTool(protoc-gen-js): @${genJSVer} install failed: ${err}`)
                throw err
            }
        }

        const genGRpcWebVer = args.get("protoc-gen-grpc-web") ? args.get("protoc-gen-grpc-web") : "1.5.0"
        const genGRpcWebVerLocal = XFile.PathJoin(XEnv.LocalPath, "protoc-gen-grpc-web.ver")
        if (XFile.HasFile(genGRpcWebVerLocal) && !args.get("protoc-gen-grpc-web")) {
            XLog.Debug(`JSTool(protoc-gen-grpc-web): @${XFile.OpenText(genGRpcWebVerLocal)}`)
        } else {
            const gitproxy = args.get("gitproxy") ? args.get("gitproxy") : "https://ghproxy.cn/"

            const binurl = {
                "win32_x86_32": `https://github.com/grpc/grpc-web/releases/download/${genGRpcWebVer}/protoc-gen-grpc-web-${genGRpcWebVer}-windows-x86_64.exe`,
                "win32_x86_64": `https://github.com/grpc/grpc-web/releases/download/${genGRpcWebVer}/protoc-gen-grpc-web-${genGRpcWebVer}-windows-x86_64.exe`,
                "linux_x86_32": `https://github.com/grpc/grpc-web/releases/download/${genGRpcWebVer}/protoc-gen-grpc-web-${genGRpcWebVer}-linux-x86_64`,
                "linux_x86_64": `https://github.com/grpc/grpc-web/releases/download/${genGRpcWebVer}/protoc-gen-grpc-web-${genGRpcWebVer}-linux-x86_64`,
                "darwin_x86_64": `https://github.com/grpc/grpc-web/releases/download/${genGRpcWebVer}/protoc-gen-grpc-web-${genGRpcWebVer}-darwin-x86_64`,
                "darwin_aarch_64": `https://github.com/grpc/grpc-web/releases/download/${genGRpcWebVer}/protoc-gen-grpc-web-${genGRpcWebVer}-darwin-aarch64`
            }

            try {
                const plat = process.platform
                const arch = process.arch === "arm64" ? "aarch_64" : (process.arch === "x64" ? "x86_64" : "x86_32")
                const bin = plat + "_" + arch

                let url = binurl[bin]
                if (!url) throw new Error(`Unsupported platform: ${bin}. Was not able to find a proper version.`)

                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLocaleLowerCase()
                if (XString.Contains(tz, "shanghai") || args.has("gitproxy") || process.env.GITHUB_ACTIONS != null) {
                    url = `${gitproxy.endsWith("/") ? gitproxy : gitproxy + "/"}${url}`
                    XLog.Debug(`Install.JSTool(protoc-gen-grpc-web): using git proxy of ${gitproxy}.`)
                }
                XLog.Debug(`Install.JSTool(protoc-gen-grpc-web): fetch from ${url}.`)

                const file = XFile.PathJoin(XEnv.LocalPath, process.platform === "win32" ? "protoc-gen-grpc-web.exe" : "protoc-gen-grpc-web")
                const ws = fs.createWriteStream(file)

                await new Promise<void>((resolve, reject) => {
                    https.get(url, (response) => {
                        response.pipe(ws)
                        ws.on("finish", () => {
                            ws.close(() => {
                                XLog.Debug(`Install.JSTool(protoc-gen-grpc-web): fetch into ${file}.`)
                                resolve()
                            })
                        })
                    }).on("error", reject)
                })

                fs.chmodSync(file, 0o755)
                XLog.Debug(`Install.JSTool(protoc-gen-grpc-web): chmod to 0o755.`)

                XLog.Debug(`Install.JSTool(protoc-gen-grpc-web): @${genGRpcWebVer} has been installed.`)
                XFile.SaveText(genGRpcWebVerLocal, genGRpcWebVer)
            } catch (err) {
                XLog.Error(`Install.JSTool(protoc-gen-grpc-web): @${genGRpcWebVer} install failed: ${err}`)
                throw err
            }
        }
    }

    async function TSTool(args: Map<string, string> = new Map()) {
        const httpproxy = process.env["HTTPS_PROXY"]
        const npmproxy = args.get("npmproxy") ? args.get("npmproxy") : "https://registry.npmmirror.com/"

        const genTSVer = args.get("protoc-gen-ts") ? args.get("protoc-gen-ts") : "latest"
        const genTSVerLocal = XFile.PathJoin(XEnv.LocalPath, "protoc-gen-ts.ver")
        if (XFile.HasFile(genTSVerLocal) && !args.get("protoc-gen-ts")) {
            XLog.Debug(`TSTool(protoc-gen-ts): @${XFile.OpenText(genTSVerLocal)}`)
        } else {
            try {
                if (!XString.IsNullOrEmpty(httpproxy)) XLog.Debug(`Install.TSTool(protoc-gen-ts): using http proxy of ${httpproxy}.`)

                const opt = XUtility.ExecOpt(XEnv.LocalPath)
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLocaleLowerCase()
                const np = child_process.execSync("npm config get registry").toString().trim()
                let ext = ""
                if ((XString.Contains(tz, "shanghai") && XString.IsNullOrEmpty(httpproxy) && !XString.Contains(np, "http")) || args.has("npmproxy")) {
                    ext = ` --registry ${npmproxy}`
                    XLog.Debug(`Install.TSTool(protoc-gen-ts): using npm proxy of ${npmproxy}.`)
                }

                XLog.Debug(`Install.TSTool(protoc-gen-ts): ${child_process.execSync(`npm install --no-save protoc-gen-ts@${genTSVer}${ext}`, opt)}`)

                XLog.Debug(`Install.TSTool(protoc-gen-ts): @${genTSVer} has been installed.`)
                XFile.SaveText(genTSVerLocal, genTSVer)
            } catch (err) {
                XLog.Error(`Install.TSTool(protoc-gen-ts): @${genTSVer} install failed: ${err}`)
                throw err
            }
        }
    }
}