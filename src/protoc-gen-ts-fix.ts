// Copyright (c) 2025 EFramework Organization. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fs from "fs"
import { XFile, XString, XTest } from "org.eframework.uni.util"
import { CodeGeneratorRequest, CodeGeneratorResponse } from "google-protobuf/google/protobuf/compiler/plugin_pb"

// 来源：https://github.com/thesayyn/protoc-gen-ts
// 议题: https://github.com/thesayyn/protoc-gen-ts/issues/267
// 功能：修复在grpc_package=grpc-web,unary_rpc_promise=true,target=web模式下的问题
//  补丁1：grpc客户端方法的metadata不可为空，应当为可选（已完成）
//  补丁2：grpc服务端的定义应当移除（已完成）
//  补丁3：生成代码补充注释（待完善）
//  补丁4：修改google-protobuf库和grpc-web库的导入方式，为esm模块导入提供支持（已完成）
(async () => {
    try {
        const request = CodeGeneratorRequest.deserializeBinary(new Uint8Array(fs.readFileSync(0))) // Using 0 instead of process.stdin.fd.
        const response = new CodeGeneratorResponse()

        const input = request.getParameter()
        if (XString.IsNullOrEmpty(input)) throw new Error("Missing param of input directory.")
        if (!XFile.HasDirectory(input)) throw new Error(`Input directory of ${input} doesn't exists.`)

        // request.getFileToGenerateList()获取到的目标文件列表不包含依赖文件（Descriptor.proto、XProto.proto），故改为getProtoFileList()
        request.getProtoFileList().forEach(file => {
            const fileName = file.getName()
            const pbname = fileName.replace(".proto", ".ts")
            const pbpath = XFile.PathJoin(input, pbname)
            if (!XFile.HasFile(pbpath)) throw new Error(`PB file of ${pbpath} doesn't exists.`)

            const content = XFile.OpenText(pbpath)
            const lines = content.split("\n")
            const nlines = new Array<string>()
            let modify = false
            let unimpl = false
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i]
                if (XString.Contains(line, "export abstract class Unimplemented")) unimpl = true
                else if (unimpl && XString.Contains(line, "export class ")) unimpl = false
                if (!unimpl) {
                    if (XString.Contains(line, "metadata: grpc_web_1.Metadata | null)")) {
                        line = line.replace("metadata: grpc_web_1.Metadata | null)", "metadata?: grpc_web_1.Metadata)")
                        modify = true
                    } else if (XString.Contains(line, "metadata || {}")) {
                        line = line.replace("metadata || {}", "metadata")
                        modify = true
                    }

                    if (XString.Contains(line, "import * as") && (XString.Contains(line, "google-protobuf") || XString.Contains(line, "grpc-web"))) {
                        line = line.replace("import * as", "import")
                        modify = true
                    }
                    nlines.push(line)
                }
            }

            if (modify) {
                const pbfile = new CodeGeneratorResponse.File()
                pbfile.setContent(nlines.join("\n"))
                pbfile.setName(pbname)

                response.addFile(pbfile)
            }
        })

        process.stdout.write(Buffer.from(response.serializeBinary()))
    } catch (err) {
        console.error("Unexpected: ", err)
        if (!XTest.IsJest) process.exit(1)
    }
})()