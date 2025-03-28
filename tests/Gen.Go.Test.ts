// Copyright (c) 2025 EFramework Organization. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { XEnv, XFile, XTest } from "org.eframework.uni.util"
import { Protoc } from "../src/protoc"

XTest.Test("Protoc Gen for Go", async () => {
    const src = XFile.PathJoin(XEnv.LocalPath, "..", "tests", "proto", "src")
    const out = XFile.PathJoin(XEnv.LocalPath, "..", "tests", "proto", "out", "go")
    if (XFile.HasDirectory(out)) XFile.DeleteDirectory(out)
    XFile.CreateDirectory(out)

    await Protoc([`--proto_path=${src}`,
    `--go_out=${out}`,
    `--go-grpc_out=${out}`,
    XFile.PathJoin(src, "*.proto")])
})