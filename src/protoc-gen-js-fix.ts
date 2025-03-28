// Copyright (c) 2025 EFramework Organization. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fs from "fs"
import { XFile, XString, XTest } from "org.eframework.uni.util"
import { CodeGeneratorRequest, CodeGeneratorResponse } from "google-protobuf/google/protobuf/compiler/plugin_pb"

// 来源：https://github.com/protocolbuffers/protobuf-javascript
// 议题: Support for ES6-style imports is not implemented yet. 对es6的支持尚未完成
// 功能：修复在es6模式下的goog,jspb库导入及模块导出，补充注释
//  补丁1：头部goog,jspb库导入（已完成）
//  补丁2：底部模块导出（已完成）
//  补丁3：忽略.d.ts文件中的导入错误（已完成）
//  补丁4：生成代码补充注释（待完善）
(async () => {
    try {
        const request = CodeGeneratorRequest.deserializeBinary(new Uint8Array(fs.readFileSync(0))) // Using 0 instead of process.stdin.fd.
        const response = new CodeGeneratorResponse()

        const input = request.getParameter()
        if (XString.IsNullOrEmpty(input)) throw new Error("Missing param of input directory.")
        if (!XFile.HasDirectory(input)) throw new Error(`Input directory of ${input} doesn't exists.`)

        request.getFileToGenerateList().forEach(file => {
            const pbdesc = request.getProtoFileList().find(ele => ele.getName() == file)
            if (pbdesc == null) throw new Error(`PB desc of ${file} was not found.`)

            function patchPJS() {
                const pbname = file.replace(".proto", "_pb.js")
                const pbpath = XFile.PathJoin(input, pbname)
                if (!XFile.HasFile(pbpath)) throw new Error(`PB file of ${pbpath} doesn't exists.`)

                const content = XFile.OpenText(pbpath)
                const lines = content.split("\n")
                const nlines = new Array<string>()
                let simport = false // 导入依赖库
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i]
                    if (simport == false) {
                        if (XString.StartsWith(line, "goog")) {
                            simport = true
                            nlines.push("const jspb = require('google-protobuf');")
                            nlines.push("const goog = jspb;")
                        }
                    }
                    nlines.push(line)
                    // if (XString.StartsWith(line, "/**")) cindex = nlines.length // 临近注释索引
                    // TODO: 如何从request中获取注释信息，并补充至生成的代码中
                    // if (XString.EndsWith(line, " = function (opt_data) {")) { // 补充Message注释
                    // }
                }

                pbdesc.getMessageTypeList().forEach(ele => nlines.push(`export const ${ele.getName()} = proto.${pbdesc.getPackage()}.${ele.getName()}`))
                pbdesc.getEnumTypeList().forEach(ele => nlines.push(`export const ${ele.getName()} = proto.${pbdesc.getPackage()}.${ele.getName()}`))

                const pbfile = new CodeGeneratorResponse.File()
                pbfile.setContent(nlines.join("\n"))
                pbfile.setName(pbname)

                response.addFile(pbfile)
            }

            function patchDTS() {
                const pbname = file.replace(".proto", "_pb.d.ts")
                const pbpath = XFile.PathJoin(input, pbname)
                if (!XFile.HasFile(pbpath)) throw new Error(`PB file of ${pbpath} doesn't exists.`)

                // TODO: 补充注释

                const pbfile = new CodeGeneratorResponse.File()
                pbfile.setContent(`/* eslint-disable */\n// @ts-nocheck\n\n${XFile.OpenText(pbpath)}`)
                pbfile.setName(pbname)

                response.addFile(pbfile)
            }

            function patchRPC() {
                // TODO: 补充注释
            }

            patchPJS()
            patchDTS()
            patchRPC()
        })

        process.stdout.write(Buffer.from(response.serializeBinary()))
    } catch (err) {
        console.error("Unexpected: ", err)
        if (!XTest.IsJest) process.exit(1)
    }
})()