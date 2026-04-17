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
 * EnumJS 是一个用于创建 Java 枚举类的 KubeJS JavaScript 库。
 * 
 * ## 使用
 * 
 * 使用 {@linkcode createEnum} 方法来创建新的 Java `enum`。
 * 
 * > ```javascript
 * > let colors = EnumJS.createEnum("Color")
 * >     .build("RED", "GREEN", "BLUE");
 * > ```
 * 
 * 这里 `createEnum` 的返回值是一个 Java 类，
 * 你可以直接通过 `colors` 访问这个 Java 类的静态方法：
 * 
 * > ```javascript
 * > colors.GREEN;          // 获取 GREEN 枚举实例
 * > colors.valueOf("RED"); // 获取 RED 枚举实例
 * > colors.values();       // 获取所有枚举实例的数组
 * > ```
 * 
 * ## 类型定义
 * 
 * 由于在 Minecraft 1.20.1 版本上同时存在 ProbeJS 6 与 ProbeJS 7，
 * 它们生成的类型定义文件格式大相径庭。
 * 为了获得正确的类型提示，可以前往 {@linkcode Alias} 命名空间更改别名以匹配你自己的 ProbeJS 生成的类型定义。
 * 
 * 同时，该模块提供了多语言的 `.d.ts` 文件。
 * 使用时，配置 `jsconfig.json` 以忽略其它语言的文件，或者直接删除不需要的文件。
 * 
 * ## KubeLoader
 * 
 * 该模块支持通过 KubeLoader 加载。
 * 当使用 KubeLoader 加载时，使用：
 * 
 * > ```javascript
 * > const EnumJS = ContentPacks.getShared("pelemenguin.enumjs");
 * > // 或更严谨地：
 * > const EnumJS = ContentPacks.getShared("startup", "pelemenguin.enumjs");
 * > ```
 * 
 * 来将其加载的你自己的脚本中。
 * 
 * ---
 * 
 * @author Pelemenguin
 * @version 1.1
 * @license MIT
 * @copyright Pelemenguin 2026
 */
declare namespace EnumJS {

    /**
     * 为文档而预定义的别名。
     * 
     * 如果这些与 ProbeJS 生成的文件不匹配，
     * 你可以更改这里以确保你的文档能正常工作。
     */
    namespace Alias {

        /** `java.lang.Enum` */
        type Enum<E extends Enum<E>>   = Internal.Enum<E>;

    }

    /**
     * 创建一个新的 Java 枚举类。
     * 
     * @param className 枚举类的类名（全限定名，例如 `com.exmaple.ExampleEnum`）
     * 
     * @since 1.1: 现在不再直接接受枚举实例数组来构建 Java 枚举类。
     * 
     * @example
     * let ExampleEnum = EnumJS.createEnum("ExampleEnum")
     *     .build("Value1", "Value2", "Value3");
     * console.info(ExampleEnum.Value1);
     */
    function createEnum(className: string): EnumClassBuilder;

    /**
     * 用于构建 Java 枚举类的构建器。
     * 
     * @since 1.1
     */
    class EnumClassBuilder {
        protected constructor(className: string);
        protected className: string;
        protected stringRepresentableCode?: ((methodVisitor: any) => void);
        protected customStringRepresentable?: (value: GeneratedEnum<string>) => void;
        /**
         * 构建 Java 枚举类。
         * 
         * @param values 枚举实例的名称
         * @return       构建的 Java 枚举类
         * 
         * @since 1.1
         */
        build<A extends string>(...values: A[]): Enum<A>;
        /**
         * 使生成的枚举类实现 `net.minecraft.util.StringRepresentable` 接口。
         * 
         * @param getter 一个函数，用于获取枚举实例的字符串表示。
         *               当省略时，默认使用枚举实例的名称作为字符串表示
         * @return       当前的构建器实例
         * 
         * @since 1.1
         */
        stringRepresentable(getter: (value?: GeneratedEnum<string>) => void): EnumClassBuilder;
    }

    /**
     * 类型提示时代表生成的 Java 枚举类的类型。
     * 
     * @since 1.1
     */
    type Enum<E extends string> = {[K in E]: GeneratedEnum<K>} & _Enum<E>;

    /**
     * 类型提示时代表生成的 Java 枚举类的接口。
     */
    interface _Enum<E extends string> {
        /**
         * 根据枚举实例的名称获取枚举实例。
         * 
         * @param value 枚举实例的名称
         * @return      对应名称的枚举实例
         */
        valueOf(value: E): GeneratedEnum<E>;
        /**
         * 获取枚举类中所有枚举实例的数组。
         * 
         * @return 枚举实例数组
         */
        values(): GeneratedEnum<E>[];
    }

    /**
     * 类型提示时代表枚举实例的接口。
     * 
     * @since 1.1: 添加了一个泛型参数来表示当前枚举实例的名称
     */
    interface GeneratedEnum<E extends string> extends Alias.Enum<GeneratedEnum<E>> {
        name(): E;
    }

}
