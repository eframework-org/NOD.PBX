// Copyright (c) 2025 EFramework Organization. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { XEnv, XFile, XTest } from "org.eframework.uni.util"
import { Protoc } from "../src/protoc"

XTest.Test("Protoc Gen for Javascript(Web)", async () => {
    const src = XFile.PathJoin(XEnv.LocalPath, "..", "tests", "proto", "src")
    const out = XFile.PathJoin(XEnv.LocalPath, "..", "tests", "proto", "out", "js")
    if (XFile.HasDirectory(out)) XFile.DeleteDirectory(out)
    XFile.CreateDirectory(out)

    await Protoc([`--proto_path=${src}`,
        `--js_opt=import_style=es6`,
    `--js_out=${out}`,
        `--grpc-web_opt=import_style=typescript,mode=grpcwebtext`,
    `--grpc-web_out=${out}`,
    XFile.PathJoin(src, "*.proto")])

    await Protoc([`--proto_path=${src}`,
    `--js-fix_opt=${out}`,
    `--js-fix_out=${out}`,
    XFile.PathJoin(src, "*.proto")])
})