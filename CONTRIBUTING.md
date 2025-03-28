# 贡献指南

[![贡献者](https://img.shields.io/github/contributors/eframework-org/NOD.PBX)](https://github.com/eframework-org/NOD.PBX/graphs/contributors)
[![月度提交](https://img.shields.io/github/commit-activity/m/eframework-org/NOD.PBX)](https://github.com/eframework-org/NOD.PBX/graphs/commit-activity)
[![最后提交](https://img.shields.io/github/last-commit/eframework-org/NOD.PBX)](https://github.com/eframework-org/NOD.PBX/commits/master)

[![活跃议题](https://img.shields.io/github/issues/eframework-org/NOD.PBX)](https://github.com/eframework-org/NOD.PBX/issues)
[![单元测试](https://github.com/eframework-org/NOD.PBX/actions/workflows/test.yml/badge.svg)](https://github.com/eframework-org/NOD.PBX/actions/workflows/test.yml)
[![版本发布](https://github.com/eframework-org/NOD.PBX/actions/workflows/publish.yml/badge.svg)](https://github.com/eframework-org/NOD.PBX/actions/workflows/publish.yml)

感谢您考虑为本项目做出贡献！

## 技术路线

### 1. 开发语言
- TypeScript 4.1.6：主要开发语言
- Node.js 16.11.7：运行环境

### 2. 开发工具
- rollup：代码打包
- rollup-plugin-typescript2：TypeScript 编译
- rollup-plugin-terser：代码压缩
- rollup-plugin-sourcemaps：源码映射
- rollup-plugin-dts：类型声明生成
- XTest：单元测试框架
- Cursor/VS Code/Visual Studio：代码编辑器

### 3. 集成工具
- Github Action：提供了自动化测试及发布工作流

## 目录规范

### 1. 目录结构
```
<Root>/                    # 项目目录
│
├── .github/               # 工作流目录
│   └── workflows/*.yml    # 工作流脚本
│
├── src/                   # 源码目录
│   └── <Module1>.ts       # 模块1实现
│   ├── <Module2>.ts       # 模块2实现
│   └── ...
│
├── tests/                 # 测试目录
│   └── <Module1>.Test.ts  # 模块1测试
│   ├── <Module2>.Test.ts  # 模块2测试
│   └── ...
│
├── docs/                  # 文档目录
│   └── <Module1>.md       # 模块1文档
│   ├── <Module2>.md       # 模块2文档
│   └── ...
│
├── types/                 # 类型定义
│
├── README.md              # 项目文档
├── CHANGELOG.md           # 更新记录
├── CONTRIBUTING.md        # 贡献指南
├── LICENSE                # 开源协议
├── package.json           # 项目描述
├── package-lock.json      # 依赖锁定
├── tsconfig.json          # TypeScript 配置
├── tsconfig.jest.json     # Jest TypeScript 配置
├── rollup.config.js       # Rollup 配置
└── jest.config.js         # Jest 配置
```

### 2. 命名规范

1. 目录命名
   - 使用 PascalCase 命名法，如：`Hello`、`World`、`Greet`
   - 专有目录使用通用命名规范，如：`.github`、`workflows`、`node_modules`

2. 文件命名
   - 源代码文件使用 PascalCase 命名法，如：`Hello.ts`
   - 专有文件使用通用命名规范，如：`README.md`、`.gitignore`

## 文档规范

### 1. 语言规范
- 首选语言：中文
- 专有名词保持原文，如：Node.js、TypeScript
- 中英文之间需要空格，如：Hello 你好

### 2. 标点规范
- 中文文档使用中文标点
- 代码示例使用英文标点

### 3. 格式规范
- 使用 Markdown 编写文档
- 标题使用 ATX 风格（#）
- 列表使用短横线（-）作为标记
- 代码块使用三个反引号（```）
- 文件末尾保留一个空行

### 4. 链接规范
- 使用相对路径链接项目内文件
- 使用完整 URL 链接外部资源
- 锚点使用小写，空格替换为连字符

### 5. 文档模板

#### 项目文档
文件路径：`<项目目录>/README.md`

```markdown
# <项目名称>

[![Version](https://img.shields.io/npm/v/<项目包名>)](https://www.npmjs.com/package/<项目包名>)
[![Downloads](https://img.shields.io/npm/dm/<项目包名>)](https://www.npmjs.com/package/<项目包名>)  

<项目名称> 提供了/是一个/实现了 <核心功能>，支持/用于 <主要特性>。

## 功能特性

- [<模块1名称>](docs/<模块1名称>.md) <模块1简介>
- [<模块2名称>](docs/<模块2名称>.md) <模块2简介>
- ...

## 常见问题

### 1. <问题描述>
<问题详情>

...

更多问题，请查阅[问题反馈](CONTRIBUTING.md#问题反馈)。

## 项目信息

- [更新记录](CHANGELOG.md)
- [贡献指南](CONTRIBUTING.md)
- [许可证](LICENSE)
```

#### 模块文档
文件路径：doc/<模块名称>.md

```markdown
# <模块名称>

[![Version](https://img.shields.io/npm/v/<项目包名>)](https://www.npmjs.com/package/<项目包名>)
[![Downloads](https://img.shields.io/npm/dm/<项目包名>)](https://www.npmjs.com/package/<项目包名>)  

<模块名称> 提供了/是一个/实现了 <核心功能>，支持/用于 <主要特性>。

## 功能特性

- 支持/提供 XXX：具体说明
- 实现了 XXX：具体说明
- ...

## 使用手册

### 1. <功能类别1>

#### 1.1 <具体功能>
<功能说明和示例（参考测试用例编写）>

...

## 常见问题

### 1. <问题描述>
<问题详情>

...

更多问题，请查阅[问题反馈](../CONTRIBUTING.md#问题反馈)。

## 项目信息

- [更新记录](../CHANGELOG.md)
- [贡献指南](../CONTRIBUTING.md)
- [许可证](../LICENSE)
```

#### 模块注释
文件路径：<模块名称>.ts

```typescript
// Copyright (c) 2025 EFramework Organization. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

/**
 * <模块名称> 提供了/是一个/实现了 <核心功能>，支持/用于 <主要特性>。
 * 
 * 功能特性
 * - <特性1>
 * - <特性2>
 * - ...
 * 
 * 使用手册
 * 1. <功能类别1>
 * 
 * 1.1 <具体功能>
 * 
 * <功能说明和示例（参考测试用例编写）>
 * 
 * ...
 * 
 * 更多信息请参考模块文档。
 */
export namespace <模块名称> { }
```

### 6. 文档同步

#### 同步范围

##### 1. 项目级同步
- 项目信息（`<项目目录>/package.json`）的项目描述应与项目文档（`<项目目录>/README.md`）保持一致，以项目文档为准
- 项目文档（`<项目目录>/README.md`）功能特性章节中各模块的描述应与其文档（`docs/<模块名称>.md`）保持一致，以模块文档为准

##### 2. 模块级同步
- 模块文档（`docs/<模块名称>.md`）具有最高优先级，是模块的主要文档
- 模块源码（`<模块名称>.ts`）的注释应与模块文档保持一致，以模块文档为准
- 项目文档（`<项目目录>/README.md`）中的模块描述应与模块文档保持一致，以模块文档为准

##### 3. 功能级同步
- 文档功能描述更新
- 示例代码同步更新
- 功能使用说明补充

#### 检查清单

##### 1. 描述一致性
- [ ] 项目描述一致性
- [ ] 模块描述一致性

##### 2. 功能完整性
- [ ] 功能列表完整性
- [ ] 示例代码正确性

##### 3. 链接有效性
- [ ] 文档内部链接检查
- [ ] 外部资源链接检查

#### 同步流程

```mermaid
graph LR
    Z[检查文档同步] --> E[运行检查清单]
    A[模块功能变更] --> B[更新模块文档]
    B --> C[更新源码注释]
    C --> D[更新项目文档]
    D --> E
    E --> F{是否通过?}
    F -->|是| G[完成文档同步]
    F -->|否| B
```

## 代码规范

### 1. 代码风格
- 使用 4 空格缩进代码
- 使用双引号作为字符串引号
- 使用 ASI（自动分号插入）规则
- 版权声明、类、函数之间及文件末尾保留一个空行

### 2. 命名规范
- 类名：使用 PascalCase，如：`Greet`
- 方法名：使用 PascalCase，如：`SayHello`
- 变量名：使用 camelCase，如：`helloMessage`
- 常量名：使用 PascalCase，如：`ServiceName`
- 属性名：使用 PascalCase，如：`IsClient`
- 事件名：使用 PascalCase，如：`OnUpdate`
- 接口名：使用 I 前缀 + PascalCase，如：`IBehaviour`

### 3. 注释规范

1. 基本要求
   - 基于 [JSDoc](https://jsdoc.app/) 标准，使用自然语句进行描述
   - 遵循 [语言规范](#1-语言规范) 和 [标点规范](#2-标点规范)
   - 公开的类型和成员必须包含文档注释

2. 注释模板
   ```typescript
   // Copyright (c) 2025 EFramework Organization. All rights reserved.
   // Use of this source code is governed by a MIT-style
   // license that can be found in the LICENSE file.

   /**
    * 定义了游戏对象的基础行为接口。
    * 实现此接口的类型可以参与游戏交互。
    */
   export interface IGameObject {
       /**
        * 初始化游戏对象。
        */
       Initialize(): void;

       /**
        * 处理游戏对象的更新逻辑。
        * @param deltaTime 上一帧到当前帧的时间间隔
        */
       Update(deltaTime: number): void;

       /**
        * 销毁游戏对象时的清理操作。
        */
       OnDestroy(): void;
   }
   ```

## 提交规范

### 1. 分支命名
- 功能分支：`feature/功能名称`
- 修复分支：`fix/问题描述`
- 优化分支：`optimize/优化内容`

### 2. 提交信息
- 遵循[语言规范](#1-语言规范)和[标点规范](#2-标点规范)
```
<类型>: <描述>

[可选的详细描述]

[可选的关闭问题]
```

- 类型包括：
  - `feat`: 新功能
  - `fix`: 修复问题
  - `docs`: 文档更新
  - `style`: 代码格式调整
  - `refactor`: 代码重构
  - `perf`: 性能优化
  - `test`: 测试相关
  - `chore`: 构建过程或辅助工具的变动

### 3. 提交模板
```
feat: 添加XX功能
- 添加了XX特性A
- 优化了XX流程B
- 更新相关文档
  
详细说明此功能的主要变更和影响范围
  
Closes #123
```

## 测试规范

### 1. 基本要求
- 核心功能必须有单元测试
- 保持较高的测试覆盖率

### 2. 代码模板
- 源码头部包含版权声明
- 用例名称使用 PascalCase 命名法

```typescript
// Copyright (c) 2025 EFramework Organization. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import { XTest } from "org.eframework.uni.util"
import { <模块名称> } from "../src/<模块名称>"

XTest.Test("<模块名称>.<用例名称>", async () => {
  // 准备测试数据（Arrange）

  // 执行测试功能（Act）

  // 验证测试结果（Assert）
})
```

## 开发流程

### 1. 环境准备
- 克隆仓库
  ```bash
  git clone https://github.com/eframework-org/NOD.PBX.git
  cd NOD.PBX
  ```

- 安装依赖
  ```bash
  npm install
  ```

### 2. 本地开发
- 链接至全局
  ```bash
  npm link
  ```

- 运行测试
  ```bash
  npm test
  ```

### 3. 项目集成
- 目标工程中链接本地包
  ```bash
  npm link org.eframework.nod.pbx
  ```

- 添加包引用至 package.json
  ```json
  {
    "dependencies": {
      "org.eframework.nod.pbx": "$version"
    }
  }
  ```

- 在 NPM Scripts 中调用
  ```json
  "scripts": {
    "build-proto": "protox --version"
  }
  ```

### 4. 注意事项
- TypeScript 不允许循环引用，注意模块间的依赖关系
- Jest 在 macOS 上解析 ts 模块导入有问题，使用 tsconfig.jest.json 覆盖 module 选项为 CommonJS

### 5. 技术讨论

#### 5.1 工具链安装参考
以下项目提供了不同的 protoc 工具链安装方案：
- [protobuf-ts](https://github.com/timostamm/protobuf-ts)
- [node-protoc](https://github.com/YePpHa/node-protoc)
- [gRPC Installation](https://grpc.io/blog/installation/)

#### 5.2 Proto2 vs Proto3
主要区别：
- 语法简化：Proto3 移除了 required 支持，所有字段默认 optional
- 默认值：Proto3 不支持自定义默认值，由字段类型决定
- 兼容性：WireType 保持相互兼容

#### 5.3 代码生成器对比

##### protoc-gen-js
- 缺点：
  - 无注释生成
  - ES6 支持有限
  - import 依赖不自动生成
  - 成员通过函数形式调用（**没加括号容易出错**）
  - 无命名空间
  - 枚举字段**全部转大写**
- 源码关键点：
  - protobuf-javascript/generator/js_generator.cc
    - JSIdent -> is_upper_camel
  - grpc-web/generator/grpc_generator.cc
    - LowercaseFirstLetter

##### protoc-gen-ts
- 优点：
  - TypeScript 支持良好
  - import 依赖自动生成
  - 成员通过字段形式调用
  - 包名作为命名空间
- 缺点：
  - 无注释生成
  - 未使用的枚举/消息**不导出**

##### protoc-gen-go
- 优点：
  - 注释生成完整
  - 各种特性支持良好

##### protoc-gen-csharp
- 优点：
  - 注释生成完整
  - 各种特性支持良好

#### 5.4 插件开发指南

##### 基本概念
- `--xxx_out`: 调用 protoc-gen-xxx 插件
- `--xxx_opt=key1=value1,..`: 传递参数给插件

##### 开发要点
1. 插件执行特点：
   - 多个插件并行执行
   - 所有插件执行完毕后统一输出

2. 补丁插件开发：
   - 需要设置输入和输出路径
   - 参考本项目的 protoc-gen-js-fix 等插件实现

3. 源码参考：
   - protoc-gen-js-fix：ES6 模块修复
   - protoc-gen-ts-fix：gRPC-Web 修复

## 发布流程

### 1. 运行单元测试
- 使用 `npm test` 运行所有单元测试

### 2. 检查文档同步
- 按照[文档模板](#5-文档模板)检查单个文档是否符合规范
- 按照[文档同步](#6-文档同步)检查关联文档之间是否同步

### 3. 更新修改记录
- 使用年月日格式：`YYYY-MM-DD`
- 按版本号降序排列
- 分类记录变更内容：
  ```markdown
  ## [1.0.0] - 2024-03-21
  ### 新增
  - 添加了新功能 A
  - 添加了新功能 B
  
  ### 优化
  - 优化了功能 C 的性能
  - 改进了功能 D 的用户体验
  
  ### 修复
  - 修复了问题 E
  - 修复了问题 F
  
  ### 变更
  - 调整了配置项 G
  - 更新了依赖库版本
  ```

### 4. 发布至注册表
- 确定版本：遵循[语义化版本 2.0.0](https://semver.org/lang/zh-CN/)
- 发布版本：运行[版本发布](https://github.com/eframework-org/NOD.PBX/actions/workflows/publish.yml)工作流

## 问题反馈

### 1. 问题检索
- 查阅[议题](https://github.com/eframework-org/NOD.PBX/issues)避免重复
- 确认可以稳定重现
- 提供必要环境信息

### 2. 问题报告
```markdown
### 问题描述
[清晰简洁的问题描述]

### 重现步骤
1. [步骤1]
2. [步骤2]
3. [步骤3]

### 期望行为
[描述期望的结果]

### 实际行为
[描述实际的结果]

### 环境信息
- Node.js 版本：如 16.11.7
- 操作系统：如 Windows 11
- 依赖版本：如 1.0.0
```

## 许可证

通过提交代码，您同意将您的代码贡献置于 MIT [许可证](LICENSE)之下。