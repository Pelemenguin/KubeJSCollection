// @ts-nocheck

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
