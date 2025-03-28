// Copyright (c) 2025 EFramework Organization. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { XFile, XObject, XString } from "org.eframework.uni.util"
import * as protobufjs from "protobufjs"

export namespace Proto {
    export enum FieldType {
        None = 0,
        Double = 1,
        Float = 2,
        Int64 = 3,
        Uint64 = 4,
        Int32 = 5,
        Fixed64 = 6,
        Fixed32 = 7,
        Bool = 8,
        String = 9,
        Group = 10,
        Message = 11,
        Bytes = 12,
        Uint32 = 13,
        Enum = 14,
        Sfixed32 = 15,
        Sfixed64 = 16,
        Sint32 = 17,
        Sint64 = 18,
    }

    export enum WireType {
        None = -1,
        Variant = 0,
        Fixed64 = 1,
        String = 2,
        StartGroup = 3,
        EndGroup = 4,
        Fixed32 = 5,
        SignedVariant = WireType.Variant | (1 << 3),
    }

    export const WireMap = new Map<FieldType, WireType>([
        [FieldType.Double, WireType.Fixed64],
        [FieldType.Float, WireType.Fixed32],
        [FieldType.Int64, WireType.Variant],
        [FieldType.Uint64, WireType.Variant],
        [FieldType.Int32, WireType.Variant],
        [FieldType.Fixed64, WireType.Fixed64],
        [FieldType.Fixed32, WireType.Fixed32],
        [FieldType.Bool, WireType.Variant],
        [FieldType.String, WireType.String],
        [FieldType.Group, WireType.StartGroup],
        [FieldType.Message, WireType.String],
        [FieldType.Bytes, WireType.String],
        [FieldType.Uint32, WireType.Variant],
        [FieldType.Enum, WireType.Variant],
        [FieldType.Sfixed32, WireType.Fixed32],
        [FieldType.Sfixed64, WireType.Fixed64],
        [FieldType.Sint32, WireType.Variant],
        [FieldType.Sint64, WireType.Variant],
    ])

    export function GetType(field: protobufjs.Field): FieldType {
        let type = field.type
        if (XString.IsNullOrEmpty(type)) return FieldType.None
        let char = type.charAt(0)
        if (char != char.toUpperCase()) {
            type = char.toUpperCase() + type.slice(1)
        }
        let ftype = XObject.Value(FieldType, type)
        if (ftype == null) {
            function findType(node: protobufjs.Namespace | protobufjs.Type) {
                if (node && node.nestedArray) {
                    for (let i = 0; i < node.nestedArray.length; i++) {
                        let ele = node.nestedArray[i]
                        if (ele.fullName.endsWith(type)) {
                            if (ele instanceof protobufjs.Enum) {
                                ftype = FieldType.Enum
                            } else if (ele instanceof protobufjs.Type) {
                                ftype = FieldType.Message
                            } else ftype = FieldType.None
                        } else if (ele instanceof protobufjs.Type) findType(ele)

                        if (ftype) break
                    }
                }
            }

            let root: protobufjs.Namespace = field.parent
            while (root.parent) root = root.parent
            findType(root)
        }
        if (ftype == null) ftype = FieldType.None
        return ftype
    }

    export function GetTag(number: number, type: FieldType): number {
        return number << 3 | WireMap.get(type)
    }

    export class Descriptor {
        public File: string
        public Syntax: string
        public Package: string
        public Options: Map<string, string> = new Map()
        public Roots: protobufjs.ReflectionObject[]

        constructor(file: string) {
            this.File = file
            const content = XFile.OpenText(file)
            const result = protobufjs.parse(content, { keepCase: true, alternateCommentMode: true, preferTrailingComment: true })
            this.Syntax = result.syntax
            this.Package = result.package
            if (result.root.nestedArray && result.root.nestedArray.length > 0) {
                const root = this.Package ? result.root.nestedArray[0] : result.root
                for (let k in root.options) this.Options.set(k, root.options[k])
                this.Roots = (root as protobufjs.Root).nestedArray
            }
        }
    }
}