[🌏 Switch language to English](./README.md)

# Pelemenguin's KubeJS Collection

不知道写什么了，随便写一点 KubeJS 库啥的吧🐧

## 使用

GitHub Release 中将会发布两种文件：

- `.jar`
  - 通过 KubeLoader 打包，可以在 KubeLoader 存在时作为模组放置在 `mods` 文件夹中加载
- `.zip`
  - 可以解压到 Minecraft 游戏版本根目录使用

由于同时提供了多个语言的 `.d.ts` 文件，所以在使用时可以删除不需要的文件，
或者在 `jsconfig.json` 中设置 `exclude` 来排除不需要的文件。

## 列表

- [`ComponentStylizer`](https://github.com/Pelemenguin/KubeJSCollection/releases/tag/ComponentStylizer-v1.0) - 用于方便地设置组件样式
- [`EnumJS`](https://github.com/Pelemenguin/KubeJSCollection/releases/tag/EnumJS-v1.1) - 用于创建 Java 枚举类
- [`LavaAdapter`](https://github.com/Pelemenguin/KubeJSCollection/releases/tag/LavaAdapter-v1.0) - 用于继承 Java 类或者实现 Java 接口
- [`RegCmd`](https://github.com/Pelemenguin/KubeJSCollection/releases/tag/RegCmd-v1.0.1) - 用于简化命令注册
