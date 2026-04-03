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
     * `Stylizer` 是一个抽象基类，指定了一个 `transform` 方法，用于将一个字符串转化为一个带有自定义风格的 `Component`。
     */
    abstract class Stylizer {
        /**
         * Transforms the given text.
         * 
         * @param text The input text
         */
        abstract transform(text: string): Alias.Component;
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
     * ```javascript
     * // 默认 Emphasizer
     * let emphasizer1 = new ComponentStylizer.Emphasizer();
     * 
     * // 也是默认 Emphasizer
     * let emphasizer2 = ComponentStylizer.Emphasizer.create();
     * 
     * // 指定了 emphStyle 的 Emphasizer
     * let emphasizer3 = ComponentStylizer.Emphasizer.create(
     *     ComponentStylizer.Style.EMPTY.withBold(true).applyFormat("red")
     * );
     * 
     * // emphStype 与 defaultStyle 均被指定的 Emphasizer
     * let emphasizer4 = ComponentStylizer.Emphasizer.create(
     *     ComponentStylizer.Style.EMPTY.withItalic(true).applyFormat("green"),
     *     ComponentStylizer.Style.EMPTY.applyFormat("gray")
     * );
     * ```
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
     * ```javascript
     * // 创建一个蓝色加粗风格
     * ComponentStylizer.Style.EMPTY
     *     .withBold()
     *     .withColor("blue");
     * ```
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
     * ```javascript
     * // 颜色
     * ComponentStylizer.ChatFormatting.RED;
     * ComponentStylizer.ChatFormatting.GREEN;
     * ComponentStylizer.ChatFormatting.BLUE;
     * ComponentStylizer.ChatFormatting.LIGHT_PURPLE;
     * 
     * // 其它格式
     * ComponentStylizer.ChatFormatting.BOLD;
     * ComponentStylizer.ChatFormatting.ITALIC;
     * ComponentStylizer.ChatFormatting.UNDERLINE;
     * ```
     * 
     * 由于 `ChatFormatting` 是一个枚举类，某些情况下你可以直接使用字符串，而不必直接访问静态字段，因为 Rhino 会帮你进行转换。
     * 
     * ```java
     * ComponentStylizer.Style.EMPTY.applyFormat("red");
     * ComponentStylizer.Style.EMPTY.applyFormat(ComponentStylizer.ChatFormatting.RED);
     * ```
     */
    const ChatFormatting: Alias.$ChatFormatting;

}

declare const ComponentStylizer: ComponentStylizer;
