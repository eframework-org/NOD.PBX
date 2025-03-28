// Copyright (c) 2025 EFramework Organization. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { XEnv, XFile, XTest } from "org.eframework.uni.util"
import { Install } from "../src/utility/Install"

XTest.Test("Install Toolchains", async () => {
    XFile.DeleteDirectory(XEnv.LocalPath)
    await Install.Process(["--protoc=30.2", "--gitproxy=https://ghproxy.cn/"]) // Install specified version.

    XFile.DeleteDirectory(XEnv.LocalPath)
    await Install.Process(["--all"]) // Install all toolchains.
})