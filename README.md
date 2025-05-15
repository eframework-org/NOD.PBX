# EFramework Protoc for Node

[![Version](https://img.shields.io/npm/v/org.eframework.nod.pbx)](https://www.npmjs.com/package/org.eframework.nod.pbx)
[![Downloads](https://img.shields.io/npm/dm/org.eframework.nod.pbx)](https://www.npmjs.com/package/org.eframework.nod.pbx)
[![DeepWiki](https://img.shields.io/badge/DeepWiki-Explore-blue)](https://deepwiki.com/eframework-org/NOD.PBX)

EFramework Protoc for Node 简化了 Protocol Buffers 和 gRPC 的安装与使用。

## 功能特性

### 多语言支持
| 语言 | Protobuf | gRPC |
|:---:|:---:|:---:|
| Go | ✅ | ✅ |
| C#(.NET) | ✅ | ✅ |
| JavaScript(Web) | ✅ | ✅ |
| Lua | 🛠️ | 🚫 |
- ✅已支持  🛠️计划中  🚫不适用

### 工具链管理
- 🚀 一键安装 protoc/gRPC 工具链
- 🌐 优化中国区镜像访问限制

## 使用手册

### 1. 命令说明

#### protox - 主命令
与 protoc 区分的工具入口命令。

```bash
protox [options]
```

选项：
- --help：查看文档
- --version：显示版本
- --install：安装工具链
  - --all：安装所有工具链
  - --protoc=<ver>：protoc 工具版本，默认：30.2
  - --protoc-gen-go=<ver>：protoc-gen-go 工具版本，默认：latest
  - --protoc-gen-go-grpc=<ver>：protoc-gen-go-grpc 工具版本，默认：latest
  - --protoc-gen-js=<ver>：protoc-gen-js 工具版本，默认：3.21.4
  - --protoc-gen-web-grpc=<ver>：protoc-gen-web-grpc 工具版本，默认：1.5.0
  - --protoc-gen-ts=<ver>：protoc-gen-ts 工具版本，默认：latest
  - --gitproxy=<url>：git 代理地址，默认：https://ghproxy.cn/
  - --goproxy=<url>：go 代理地址，默认：https://goproxy.cn,direct
  - --npmproxy=<url>：npm 代理地址，默认：https://registry.npmmirror.com/
- --xxx_out：与原生工具参数相同

#### protoc - 原生命令
Protocol Buffers 原生编译工具。

```bash
protoc [options] proto_files
```

选项：
- --help：查看文档
- --version：显示版本
- --xxx_out：编译 proto 文件

### 2. 生成插件

1. protoc-gen-js-fix：修复 ES6 模式下的库导入及模块导出问题。

```bash
--js-fix_out=/path/to/input:/path/to/output
```

2. protoc-gen-ts-fix：修复 gRPC-Web 模式下的代码生成问题。

```bash
--ts-fix_out=/path/to/input:/path/to/output
```

## 常见问题

### 1. proto 文件编译
- protoc 命令会自动注入 proto 工具链路径
- 支持 `*.proto` 匹配一级目录，不支持 `**/*.proto` 递归匹配

### 2. TypeScript 导入错误
- 问题：protoc-gen-ts-fix 生成的文件中 `import XXX from "XXX"` 报错
- 解决：在 tsconfig.json 中添加 `"esModuleInterop"：true`

### 3. Protocol Buffers 枚举命名
- 同一个 package 中的枚举值必须唯一，即使它们属于不同的枚举类型
- 例如：MemMode 使用 `None`，LogLevel 使用 `Undefined` 作为默认值，避免命名冲突
- 这是因为枚举值使用 C++ 作用域规则，它们是类型的兄弟而不是子级

### 4. 为什么 C#(.NET) 环境下安装的是 gRPC.Core 而不是 gRPC.NET？
- gRPC.Core 是一个基于 C++ 的 gRPC 实现，它有自己的 TLS 和 HTTP/2 栈。Grpc.Core 包是一个.NET包装器，围绕 gRPC C-core 构建，包含 gRPC 客户端和服务器
- gRPC .NET 是专为.NET Core 3.x 和.NET 5 或更高版本设计的 gRPC 实现。它利用现代.NET版本中内置的 TLS 和 HTTP/2 栈
- 当前使用 gRPC.Core 的最后一个版本，最新版本为 gRPC.NET 实现
- 因 Unity 不支持 HTTP2（截至 6000.0.32f1）故使用 Core 版本
- 待 Unity 支持 HTTP2 后可使用 .NET 版本

更多问题，请查阅[问题反馈](CONTRIBUTING.md#问题反馈)。

## 项目信息

- [更新记录](CHANGELOG.md)
- [贡献指南](CONTRIBUTING.md)
- [许可证](LICENSE)
