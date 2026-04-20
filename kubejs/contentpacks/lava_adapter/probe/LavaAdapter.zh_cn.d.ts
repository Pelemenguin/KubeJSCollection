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
 * LavaAdapter 是一个用于创建继承 Java 类或实现 Java 接口的 KubeJS JavaScript 库。
 * 
 * ## 使用
 * 
 * ### 继承
 * 
 * 通过 {@linkcode LavaAdapter.extend} 来开始定义 Java 子类：
 * 
 * > ```javascript
 * > const $Item = Java.loadClass("net.minecraft.world.item.Item");
 * > const ExampleClass = LavaAdapter.extend($Item)
 * >     .asClass();
 * > ```
 * 
 * 这样定义的类 `ExampleClass` 将会是一个 `net.minecraft.world.item.Item` 的子类，
 * 可以当成一个正常的 `Item` 使用。
 * 
 * > ```javascript
 * > const $Item$Properties = Java.loadClass("net.minecraft.world.item.Item$Properties");
 * > StartupEvents.registry("minecraft:item", (event) => {
 * >     event.createCustom("example", () => new ExampleClass(new $Item$Properties()));
 * > });
 * > ```
 * 
 * ### 重写
 * 
 * 通过 {@linkcode LavaAdapter.AdapterBuilder.override override} 方法来重写一个指定的 Java 方法：
 * 
 * > ```javascript
 * > const $Item = Java.loadClass("net.minecraft.world.item.Item");
 * > const ExampleClass = LavaAdapter.extend($Item)
 * >             // 方法名称        // 实现函数
 * >     .override("appendHoverText", function(itemStack, level, componentList, tooltipFlag) {
 * >         componentList.add(Component.literal("Tooltip example!").gray());
 * >     })
 * >     .asClass();
 * > ```
 * 
 * 注意这里的 `"appendHoverText"` 不需要 SRG 名。
 * LavaAdapter 会从父类或父接口的 `prototype` 上寻找方法。
 * 
 * 当然，你也可以直接传入需要重写的方法对象：
 * 
 * > ```javascript
 * > const $Item = Java.loadClass("net.minecraft.world.item.Item");
 * > const item$appendHoverText = Items.AIR.appendHoverText;
 * >                           // 从一个已有的 Item 实例上获取 appendHoverText 方法
 * > const ExampleClass = LavaAdapter.extend($Item)
 * >            // 这里使用获取到的 Java 方法对象
 * >     .override(item$appendHoverText, function(itemStack, level, componentList, tooltipFlag) {
 * >         componentList.add(Component.literal("Tooltip example!").gray());
 * >     })
 * >     .asClass();
 * > ```
 * 
 * ### 接口实现
 * 
 * 通过 {@linkcode LavaAdapter.AdapterBuilder.implement implement} 方法来实现一个指定的 Java 接口。
 * 具体实例查看该方法文档。
 * 
 * ### `this` 与 `super` 调用
 * 
 * `this` 在 LavaAdapter 定义的方法中指向当前实例。
 * 
 * 除此之外，`this` 上还有一个特殊属性 {@linkcode SuperMethods.$super $super}，
 * 可以用来调用父类的方法。
 * 
 * > ```javascript
 * > const $HashMap = Java.loadClass("java.util.HashMap");
 * > const PenguinMap = LavaAdapter.extend($HashMap)
 * >     .override("get", function(key) {
 * >         console.info("你只能拿到“企鹅”对应的值！")
 * >                         // 让父类 HashMap 来处理 "get" 逻辑
 * >         return this.$super.get("企鹅");
 * >     })
 * >     .asClass();
 * > 
 * > let map = new PenguinMap();
 * > map.put("企鹅", "石头");
 * > map.put("其它键", "其它值");
 * > 
 * > console.info(map.get("其它键"));
 * > // 控制台输出：
 * > //   "你只能拿到“企鹅”对应的值！"
 * > //   "石头"
 * > ```
 * 
 * ## KubeLoader
 * 
 * 该模块支持通过 KubeLoader 加载。
 * 当使用 KubeLoader 加载时，使用：
 * 
 * > ```javascript
 * > const LavaAdapter = ContentPacks.getShared("pelemenguin.lava_adapter");
 * > // 或更严谨地：
 * > const LavaAdapter = ContentPacks.getShared("startup", "pelemenguin.lava_adapter");
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
declare namespace LavaAdapter {

    /**
     * 用于表示某个 TypeScript 元组类型中全部元素的交叉类型。
     */
    type Intersection<I extends any[]> = I extends [infer I1, ...infer I2] ? I1 & Intersection<I2> : {};
    /**
     * 用于表示某个 TypeScript 元组类型中全部元素的联合类型。
     */
    type Union       <I extends any[]> = I extends [infer I1, ...infer I2] ? I1 | Union       <I2> : {};
    /**
     * 用于表示某个 TypeScript 元组类型中全部元素的键的联合类型
     */
    type AnyKeyFrom  <I extends any[]> = I extends [infer I1, ...infer I2] ? keyof I1 | AnyKeyFrom<I2> : never;
    /**
     * 找到一个类 `C` 的实例类型与多个类型 `I[]` 中，某个键 `K` 对应的方法类型。
     */
    type OneOfMethods<C extends abstract new (...args: any[]) => any, I extends any[], K extends (keyof InstanceType<C>) | AnyKeyFrom<I>>
        = InstanceType<C>[K] extends (...args: any[]) => any ? InstanceType<C>[K]
            : I extends [infer I1, ...infer I2]
            ? (I1[K] extends (...args: any[]) => any ? I1[K] : OneOfMethods<any, I2, K>)
            : ((...args: unknown[]) => unknown);
    /**
     * 一个包含 {@linkcode SuperMethods.$super $super} 只读属性的类型，`$super` 的类型为 `T`。
     */
    type SuperMethods<T> = {
        /**
         * 一个特殊对象，调用该对象上的方法时，实际会调用父类的同名方法。
         */
        readonly $super: T;
    };
    /**
     * 表示这个类型上同时拥有一个 {@linkcode SuperMethods.$super $super} 属性，用于调用父类方法。
     */
    type IntersectionWithSuperMethods<T> = T & SuperMethods<T>;

    /**
     * 用于构建 Java 适配器的接口
     */
    interface AdapterBuilder<C extends abstract new (...args: any[]) => any, I extends any[]> {
        /**
         * 指定要实现的 Java 接口。
         * 
         * 可以传入单个接口：
         * 
         * > ```javascript
         * > const $Runnable = Java.loadClass("java.lang.Runnable");
         * > const CustomRunnable = LavaAdapter.extend()
         * >     .implement($Runnable)
         * >     .override("run", function() {
         * >         console.info("正在运行！");
         * >     })
         * >     .asClass();
         * > 
         * > new CustomRunnable().run();
         * > ```
         * 
         * 也可以传入多个接口
         * 
         * > ```javascript
         * > const $Runnable = Java.loadClass("java.lang.Runnable");
         * > const $Function = Java.loadClass("java.util.function.Function");
         * > const CustomRunnable = LavaAdapter.extend()
         * >     .implement($Runnable, $Function)
         * >     .override("run", function() {
         * >         // 实现 Runnable 的 run 方法
         * >     })
         * >     .override("apply", function(value) {
         * >         // 实现 Function 的 apply 方法
         * >     })
         * >     .asClass();
         * > ```
         * 
         * @param superInterface 要实现的 Java 接口，可以传入一个或多个接口，或者一个包含接口的数组。
         *                       这些接口应当通过 `Java.loadClass` 获取
         * @return               **当前** `AdapterBuilder`，并更新类型参数以表示要实现新的接口
         */
        implement<I2 extends any[]>(...superInterface: I2): AdapterBuilder<C, [...I, ...I2]>;
        /**
         * 重写一个 Java 方法。
         * 
         * 示例参见 {@link LavaAdapter 模块文档} 。
         * 
         * @param methodName     方法名称
         * @param implementation 一个 JavaScript 函数以提供具体实现
         * @return               当前 `AdapterBuilder`
         */
        override<K extends (keyof InstanceType<C>) | AnyKeyFrom<I>>(
            methodName: K,
            implementation: (this: IntersectionWithSuperMethods<InstanceType<C & Intersection<I>>>, ...args: Parameters<OneOfMethods<C, I, K>>) => ReturnType<OneOfMethods<C, I, K>> | void
        ): this;
        /**
         * 重写一个 Java 方法。
         * 
         * 示例参见 {@link LavaAdapter 模块文档} 。
         * 
         * @param methodName     方法名称
         * @param implementation 一个 JavaScript 函数以提供具体实现
         * @return               当前 `AdapterBuilder`
         */
        override(methodName: string, implementation: (this: IntersectionWithSuperMethods<InstanceType<C & Intersection<I>>>, ...args: unknown[]) => any): this;
        /**
         * 重写一个 Java 方法。
         * 
         * 示例参见 {@link LavaAdapter 模块文档} 。
         * 
         * @param methodName     从一个 Java 对象上获取的 Java 方法对象
         * @param implementation 一个 JavaScript 函数以提供具体实现
         * @return               当前 `AdapterBuilder`
         */
        override<K extends (keyof InstanceType<C>) | AnyKeyFrom<I>, M extends (C[K] | Intersection<I>[K])>(
            method: M,
            implementation: (this: IntersectionWithSuperMethods<InstanceType<C & Intersection<I>>>, ...args: Parameters<M>) => ReturnType<M> | void
        ): this;
        /**
         * 完成适配器定义，并返回一个 Java 类。
         * 
         * @return 生成的 Java 类
         */
        asClass(): C & (new (...args: any[]) => Intersection<I>);
    }

    /**
     * 开启一个 {@linkcode AdapterBuilder}，并**直接继承**自 `java.lang.Object`。
     * 
     * 示例参见 {@link LavaAdapter 模块文档}。
     * 
     * @param superClass 要继承的 Java 类，通过 `Java.loadClass` 获取
     * @return           创建的 `AdapterBuilder`
     */
    function extend(): AdapterBuilder<new () => {}, []>;
    /**
     * 指定一个要继承的 Java 类，并开启一个 {@linkcode AdapterBuilder}。
     * 
     * 示例参见 {@link LavaAdapter 模块文档}。
     * 
     * @param superClass 要继承的 Java 类，通过 `Java.loadClass` 获取
     * @return           创建的 `AdapterBuilder`
     */
    function extend<C extends abstract new (...args: any[]) => any>(superClass: C): AdapterBuilder<C, []>;

}
