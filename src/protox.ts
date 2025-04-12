// Copyright (c) 2025 EFramework Organization. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { XEnv, XFile } from "org.eframework.uni.util"
import { Install } from "./utility/Install"
import { Protoc } from "./protoc"

(async () => {
    const args = process.argv.slice(2)
    if (args.length == 0 || args.indexOf("--help") >= 0) {
        try {
            const mfile = XFile.PathJoin(XEnv.LocalPath, "..", "README.md")
            if (XFile.HasFile(mfile)) {
                const lines = XFile.OpenText(mfile).split("\n")
                const nlines = new Array<string>()
                let manual = false
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i]
                    if (!manual && line.indexOf("## 使用手册") >= 0) manual = true
                    else if (manual && line.startsWith("## ")) manual = false   // End of manual section
                    if (manual) nlines.push(line)
                }
                if (nlines.length == 0) console.info(XFile.OpenText(mfile))
                else console.info(nlines.join("\n"))
            }
        } catch (err) { console.error("Readout README.md failed: ", err) }
    } else if (args.indexOf("--version") >= 0) {
        console.info(XEnv.Version)
    } else if (args.indexOf("--install") >= 0) {
        await Install.Process([...process.argv.slice(2)])
    } else {
        await Protoc([...process.argv.slice(2)])
    }
})()