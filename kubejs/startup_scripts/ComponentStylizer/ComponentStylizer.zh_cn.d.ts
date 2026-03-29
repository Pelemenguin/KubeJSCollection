// @ts-nocheck
declare namespace Internal {

    /**
     * `ComponentStylizer` 的内部命名空间。
     */
    namespace pelemenguin$ComponentStylizer {

        /**
         * 为文档而预定义的别名。
         * 
         * 如果这些与 ProbeJS 生成的文件不匹配，
         * 你可以更改这里以确保你的文档能正常工作。
         */
        namespace Alias {

            /** `net.minecraft.network.chat.Component` */
            type Component = net.minecraft.network.chat.Component;
            /** `net.minecraft.network.chat.Style` */
            type Style = Internal.Style;

        }

        /**
         * 非常简单的风格化器，只有两种文本风格。
         * 
         * 一个 `Emphasizer` 会将 `emphCharacter`（默认为 `_`）之间的文本用 `emphStyle` 强调，
         * 而其他文本则使用 `defaultStyle`。
         * 
         * 例如：
         * 
         * |原文本              |转换后的文本        |
         * |--------------------|--------------------|
         * |`plain text`        |plain text          |
         * |`_emphasized_ text` |**emphasized** text |
         * |`_1_ 2 _3_`         |**1** 2 **3**       |
         */
        class Emphasizer {
            constructor();
            private defaultStyle: Alias.Style;
            private emphStyle: Alias.Style;
            private emphCharacter: string;
            /**
             * 转换一个文本组件
             * - - - - -
             * @param input 输入文本组件
             * @returns     转换后的文本组件
             */
            transform(input: Alias.Component): Alias.Component;
        }

    }

}

declare interface ComponentStylizer {
    /**
     * 非常简单的风格化器，只有两种文本风格。
     * 
     * 一个 `Emphasizer` 会将 `emphCharacter`（默认为 `_`）之间的文本用 `emphStyle` 强调，
     * 而其他文本则使用 `defaultStyle`。
     * 
     * 例如：
     * 
     * |Original text       |Transformed text    |
     * |--------------------|--------------------|
     * |`plain text`        |plain text          |
     * |`_emphasized_ text` |**emphasized** text |
     * |`_1_ 2 _3_`         |**1** 2 **3**       |
     */
    Emphasizer: typeof Internal.pelemenguin$ComponentStylizer.Emphasizer;
}