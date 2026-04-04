// @ts-nocheck

/*
 * MIT License
 * 
 * Copyright (c) 2026 Pelemenguin
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * `ComponentStylizer` 是一个 KubeJS JavaScript 库，用于在 Minecraft 中方便地创建和转换文本组件（`Component`）以实现自定义的文本风格。
 * 
 * ## 使用
 * 
 * {@linkcode Stylizer} 是负责转换 `Component` 的抽象基类。
 * 使用 {@linkcode Stylizer.transform} 方法可以直接转换一个字符串，并输出创建的风格化 `Component`。
 * 
 * > ```javascript
 * > // 获取 stylizer 后
 * > stylizer.transform("遵循特定格式的文本...");
 * > ```
 * 
 * 但是每次转换可能会导致性能问题，尤其是在高频调用的场景下。
 * 因此建议使用 {@linkcode Stylizer.literal} 或者 {@linkcode Stylizer.translatable} 来创建 {@linkcode LazyComponent}。
 * 使用方式类似于 {@linkcode Component.literal} 与 {@linkcode Component.translatable}。
 * 
 * > ```javascript
 * > stylizer.literal("等待转换的文本...");
 * > stylizer.translatable("a.translation.key");
 * > stylizer.translatable("another.translation.key", "要", "替换", "的", "文本");
 * > ```
 * 
 * 然后，保留创建的 `LazyComponent`。之后使用 {@linkcode LazyComponent.get} 方法获取转换后的 `Component`。
 * 这样做的好处是，`transform` 只会在第一次调用，后续使用缓存的结果，减少时间开销。
 * 
 * > ```javascript
 * > let lazy = stylizer.literal("输入的文本");
 * > 
 * > if (Client.player) {
 * >     Client.player.tell(lazy.get());
 * > 
 * >     // 后续的 get 不会重新计算
 * >     Client.player.tell(lazy.get());
 * > }
 * > ```
 * 
 * @see {@linkcode Stylizer}
 * @see {@linkcode LazyComponent}
 * 
 * ## 内置实现
 * 
 * - {@linkcode Emphasizer} - 简单的 `Stylizer`，用于强调一段被指定的字符包围的文本。例如默认情况下 `default _emph_` 会被转换至 “default **emph**”。
 *     可以自定义默认文本与强调文本的风格
 * 
 * ## 自定义实现
 * 
 * 你可以选择通过 {@linkcode Object.setPrototypeOf} 来创建一个 `Stylizer` 的子类：
 * 
 * > ```javascript
 * > // ES5 中创建子类的方法
 * >
 * > let CustomStylizer = function () {};
 * > Object.setPrototypeOf(CustomStylizer.prototype, ComponentStylizer.Stylizer.prototype);
 * > CustomStylizer.prototype.transform = function (text) {
 * >     // 这里应该是你自己的 transform 方法实现
 * >     // 这里以将文本变成浅紫色 Component 作为示例
 * >     return Component.literal(text).lightPurple();
 * > };
 * > 
 * > let customStylizer = new CustomStylizer();
 * > if (Client.player) {
 * >     let lazy = customStylizer.literal("使用了自定义 Stylizer！");
 * >     Client.player.tell(lazy.get());
 * > }
 * > ```
 * 
 * 但是我们提供了 {@linkcode Stylizer.custom} 方法来更方便地创建子类实例：
 * 
 * > ```javascript
 * > // 通过 custom 方法自动创建子类实例
 * >
 * > let customStylizer = ComponentStylizer.Stylizer.custom(text => {
 * >     // 这里应该是你的 transform 方法实现
 * >     return Component.literal(text).lightPurple();
 * > });
 * > 
 * > if (Client.player) {
 * >     let lazy = customStylizer.literal("使用自定义 Stylizer");
 * >     Client.player.tell(lazy.get());
 * > }
 * > ```
 * 
 * ## 类型定义
 * 
 * 由于在 Minecraft 1.20.1 版本上同时存在 ProbeJS 6 与 ProbeJS 7，
 * 它们生成的类型定义文件格式大相径庭。
 * 为了获得正确的类型提示，可以前往 {@linkcode Alias} 命名空间更改别名以匹配你自己的 ProbeJS 生成的类型定义。
 * 
 * - - - - -
 * 
 * @author Pelemenguin
 * @version 1.0
 * @license MIT
 * @copyright Pelemenguin 2026
 */
declare namespace ComponentStylizer {

    /**
     * 为文档而预定义的别名。
     * 
     * 如果这些与 ProbeJS 生成的文件不匹配，
     * 你可以更改这里以确保你的文档能正常工作。
     */
    namespace Alias {

        /** `net.minecraft.ChatFormatting` */
        type  ChatFormatting =        Internal.ChatFormatting;
        type $ChatFormatting = typeof Internal.ChatFormatting;
        /** `net.minecraft.network.chat.Component` */
        type Component       =        net.minecraft.network.chat.Component;
        /** `net.minecraft.network.chat.Style` */
        type  Style          =        Internal.Style;
        type $Style          = typeof Internal.Style;

    }

    /**
     * `LazyComponent` 处理 {@linkcode Stylizer.transform} 的调用。
     * 
     * `transform` 方法涉及文本解析，且各个 `Stylizer` 子类实现可能不同，
     * 因此 `transform` 方法可能耗时较长，在高频调用场景下可能会导致卡顿。
     * 
     * `LazyComponent` 可以缓存并重用 `Stylizer` 处理得到的 `Component`，
     * 避免重复转换产生性能浪费。
     * 
     * 但是，`LazyComponent` 会在 `Component` 的**文本变化后刷新缓存**。
     * 这是考虑到玩家会切换游戏语言而设计的。
     * 因此，若使用文本经常变化的 `Component`，`LazyComponent` 的效果并不会很好。
     * 
     * ## 使用
     * 
     * `LazyComponent` 可以通过构造函数或者 {@linkcode of} 方法创建：
     * 
     * > ```javascript
     * > let emphasizer = ComponentStylizer.Emphasizer.create();
     * > let lazy = ComponentStylizer.LazyComponent.of(Component.literal("This is a _emph_ test!"), emphasizer);
     * > // 或者
     * > // let lazy = new ComponentStylizer.LazyComponent(Component.literal("..."), emphasizer);
     * > ```
     * 
     * 要使用转换后的 `Component`，可以使用 {@linkcode get} 方法获取：
     * 
     * > ```javascript
     * > let component = lazy.get();
     * > if (Client.player) {
     * >     Client.player.tell(component);
     * > }
     * > ```
     * 
     * 若需要刷新缓存，可以使用 {@linkcode clearCache} 方法删除以前获取到的结果，
     * 这样下次 `get` 的时候会重新计算。
     * 
     * 或者使用 {@linkcode refreshAndGet} 方法，也可以删除缓存。
     * 但是其不会等到下次 `get` 方法调用，而是立即重新计算并返回结果。
     * 
     * > ```javascript
     * > lazy.clearCache();
     * > lazy.get();           // 在这里重新计算
     * > 
     * > lazy.refreshAndGet(); // 立即重新计算
     * > ````
     */
    class LazyComponent {
        /**
         * 构造一个新的 `LazyComponent`。
         * 
         * @param component 要转换的 `Component`
         * @param stylizer  要使用的 `Stylizer`
         */
        constructor(component: Alias.Component, stylizer: Stylizer);
        protected cachedString: string;
        protected cachedResult: Alias.Component;
        protected rawComponent: Alias.Component;
        protected stylizer: Stylizer;
        /**
         * 创建一个新的 `LazyComponent`。
         * 
         * @param component 要转换的 `Component`
         * @param stylizer  要使用的 `Stylizer`
         * @returns         创建的 `LazyComponent`
         */
        static of(component: Alias.Component, stylizer: Stylizer): LazyComponent;
        /**
         * 获取转换结果
         * 
         * @returns 结果
         */
        get(): Alias.Component;
        /**
         * 清除缓存，但不会立即重新计算
         */
        clearCache(): void;
        /**
         * 清除缓存并立即重新计算
         * 
         * @returns 转换结果
         */
        refreshAndGet(): Alias.Component;
    }

    /**
     * `Stylizer` 是一个抽象基类，指定了一个 `transform` 方法，用于将一个字符串转化为一个带有自定义风格的 `Component`。
     */
    abstract class Stylizer {
        /**
         * 通过指定的函数创建一个自定义的 `Stylizer`
         * 
         * @param transformFunction 将输入文本转换为 `Component` 的函数
         * 
         * @example
         * let customStylizer = ComponentStylizer.Stylizer.custom(text => {
         *     return Component.literal(text).lightPurple();
         * });
         *
         * if (Client.player) {
         *     Client.player.tell(customStylizer.literal("使用自定义 Stylizer").get());
         * }
         */
        static custom(transformFunction: (text: string) => Alias.Component): Stylizer;
        /**
         * 转换指定的文本。
         * 
         * @param text 输入文本
         */
        abstract transform(text: string): Alias.Component;
        /**
         * 使用该 `Stylizer` 创建一个 `Component.literal(text)` 的 {@linkcode LazyComponent}。
         * 
         * @param text 输入文本
         * @returns    创建的 `LazyComponent`
         */
        literal(text: string): LazyComponent;
        /**
         * 使用该 `Stylizer` 创建一个 `Component.translatable(key, objects)` 的 {@linkcode LazyComponent}。
         * 
         * @param key     翻译键
         * @param objects 替换文本
         * @returns       创建的 `LazyComponent`
         */
        translatable(key: string, ...objects: any[]): LazyComponent;
    }

    /**
     * 非常简单的 `Stylizer`，只有两种文本风格。
     * 
     * `Emphasizer` 会将 `emphCharacter`（默认为 `_`）之间的文本用 `emphStyle` 强调，
     * 而其他文本则使用 `defaultStyle`。
     * 
     * 例如：
     * 
     * |原文本              |转换后的文本        |
     * |--------------------|--------------------|
     * |`plain text`        |plain text          |
     * |`_emphasized_ text` |**emphasized** text |
     * |`_1_ 2 _3_`         |**1** 2 **3**       |
     * |`golden\_apple`     |golden_apple        |
     * 
     * ## 使用
     * 
     * 使用构造方法或者 `create` 方法以创建一个 `Emphasizer`。
     * 
     * > ```javascript
     * > // 默认 Emphasizer
     * > let emphasizer1 = new ComponentStylizer.Emphasizer();
     * > 
     * > // 也是默认 Emphasizer
     * > let emphasizer2 = ComponentStylizer.Emphasizer.create();
     * > 
     * > // 指定了 emphStyle 的 Emphasizer
     * > let emphasizer3 = ComponentStylizer.Emphasizer.create(
     * >     ComponentStylizer.Style.EMPTY.withBold(true).applyFormat("red")
     * > );
     * > 
     * > // emphStype 与 defaultStyle 均被指定的 Emphasizer
     * > let emphasizer4 = ComponentStylizer.Emphasizer.create(
     * >     ComponentStylizer.Style.EMPTY.withItalic(true).applyFormat("green"),
     * >     ComponentStylizer.Style.EMPTY.applyFormat("gray")
     * > );
     * > ```
     */
    class Emphasizer {
        /**
         * 构造一个新的 `Emphasizer`。
         */
        constructor();
        protected defaultStyle: Alias.Style;
        protected emphStyle: Alias.Style;
        protected emphCharacter: string;
        static create(emphStyle?: Alias.Style, defaultStyle?: Alias.Style): Emphasizer;
        /**
         * 设置强调文本的风格。
         * 
         * @param style 要设置的风格
         * @returns `this`
         */
        setEmphStyle(style: Alias.Style): this;
        /**
         * 设置默认文本的风格。
         * 
         * @param style 要设置的风格
         * @returns `this`
         */
        setDefaultStyle(style: Alias.Style): this;
    }

    /**
     * 预先加载的 Java 类 `net.minecraft.network.chat.Style`，为方便使用而提供。
     * 
     * ## 使用
     * 
     * 要创建一个 `Style` 对象，你可以从 `ComponentStylizer.Style.EMPTY` 开始，并使用 `withXxx()` 方法来修改它。
     * 
     * > ```javascript
     * > // 创建一个蓝色加粗风格
     * > ComponentStylizer.Style.EMPTY
     * >     .withBold()
     * >     .withColor("blue");
     * > ```
     * 
     * 注意 `Style` 都是**不可变**的，任何 `withXxx()` 方法都实际上创建并返回了一个新的 `Style` 对象，而非修改了原来的 `Style`。
     */
    const Style: Alias.$Style;

    /**
     * 预先加载的 Java 类 `net.minecraft.ChatFormatting`，为方便使用而提供。
     * 
     * ## 使用
     * 
     * `ChatFormatting` 是一个枚举，在 Minecraft 中用于表示颜色等格式的文本格式化选项。
     * 
     * 例如：
     * 
     * > ```javascript
     * > // 颜色
     * > ComponentStylizer.ChatFormatting.RED;
     * > ComponentStylizer.ChatFormatting.GREEN;
     * > ComponentStylizer.ChatFormatting.BLUE;
     * > ComponentStylizer.ChatFormatting.LIGHT_PURPLE;
     * > 
     * > // 其它格式
     * > ComponentStylizer.ChatFormatting.BOLD;
     * > ComponentStylizer.ChatFormatting.ITALIC;
     * > ComponentStylizer.ChatFormatting.UNDERLINE;
     * > ```
     * 
     * 由于 `ChatFormatting` 是一个枚举类，某些情况下你可以直接使用字符串，
     * 而不必直接访问静态字段，因为 Rhino 会帮你进行转换。
     * 
     * > ```javascript
     * > ComponentStylizer.Style.EMPTY.applyFormat("red");
     * > ComponentStylizer.Style.EMPTY.applyFormat(ComponentStylizer.ChatFormatting.RED);
     * > ```
     */
    const ChatFormatting: Alias.$ChatFormatting;

}

declare const ComponentStylizer: ComponentStylizer;
