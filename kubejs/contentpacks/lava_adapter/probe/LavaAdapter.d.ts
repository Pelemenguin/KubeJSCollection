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
 * LavaAdapter is a KubeJS JavaScript library for creating subclasses of Java classes or implementing Java interfaces.
 * 
 * ## Usage
 * 
 * ### Extending
 * 
 * Use {@linkcode LavaAdapter.extend} to start defining a Java subclass:
 * 
 * > ```javascript
 * > const $Item = Java.loadClass("net.minecraft.world.item.Item");
 * > const ExampleClass = LavaAdapter.extend($Item)
 * >     .asClass();
 * > ```
 * 
 * The resulting class `ExampleClass` will be a subclass of `net.minecraft.world.item.Item`
 * and can be used as a normal `Item`.
 * 
 * > ```javascript
 * > const $Item$Properties = Java.loadClass("net.minecraft.world.item.Item$Properties");
 * > StartupEvents.registry("minecraft:item", (event) => {
 * >     event.createCustom("example", () => new ExampleClass(new $Item$Properties()));
 * > });
 * > ```
 * 
 * ### Overriding
 * 
 * Use the {@linkcode LavaAdapter.AdapterBuilder.override override} method to override a specified Java method:
 * 
 * > ```javascript
 * > const $Item = Java.loadClass("net.minecraft.world.item.Item");
 * > const ExampleClass = LavaAdapter.extend($Item)
 * >             // method name    // implementation function
 * >     .override("appendHoverText", function(itemStack, level, componentList, tooltipFlag) {
 * >         componentList.add(Component.literal("Tooltip example!").gray());
 * >     })
 * >     .asClass();
 * > ```
 * 
 * Note that `"appendHoverText"` here should not be an SRG name.
 * LavaAdapter looks up the method on the `prototype` of the superclass or superinterface.
 * 
 * You can also directly pass the method object you want to override:
 * 
 * > ```javascript
 * > const $Item = Java.loadClass("net.minecraft.world.item.Item");
 * > const item$appendHoverText = Items.AIR.appendHoverText;
 * >                           // Obtain the appendHoverText method from an existing Item instance
 * > const ExampleClass = LavaAdapter.extend($Item)
 * >            // Use the obtained Java method object here
 * >     .override(item$appendHoverText, function(itemStack, level, componentList, tooltipFlag) {
 * >         componentList.add(Component.literal("Tooltip example!").gray());
 * >     })
 * >     .asClass();
 * > ```
 * 
 * ### Implementing Interfaces
 * 
 * Use the {@linkcode LavaAdapter.AdapterBuilder.implement implement} method to implement a specified Java interface.
 * See the documentation of that method for concrete examples.
 * 
 * ### `this` and `super` Calls
 * 
 * `this` inside a method defined by LavaAdapter points to the current instance.
 * 
 * Additionally, `this` has a special property {@linkcode SuperMethods.$super $super},
 * which can be used to call superclass methods.
 * 
 * > ```javascript
 * > const $HashMap = Java.loadClass("java.util.HashMap");
 * > const PenguinMap = LavaAdapter.extend($HashMap)
 * >     .override("get", function(key) {
 * >         console.info("You can only get the value for 'penguin'!");
 * >                         // Let superclass HashMap handle "get" logics
 * >         return this.$super.get("penguin");
 * >     })
 * >     .asClass();
 * > 
 * > let map = new PenguinMap();
 * > map.put("penguin", "stone");
 * > map.put("otherKey", "otherValue");
 * > 
 * > console.info(map.get("otherKey"));
 * > // Console output:
 * > //   "You can only get the value for 'penguin'!"
 * > //   "stone"
 * > ```
 * 
 * ## KubeLoader
 * 
 * This module supports loading via KubeLoader.
 * When using KubeLoader, load it into your own script with:
 * 
 * > ```javascript
 * > const LavaAdapter = ContentPacks.getShared("pelemenguin.lava_adapter");
 * > // or more strictly:
 * > const LavaAdapter = ContentPacks.getShared("startup", "pelemenguin.lava_adapter");
 * > ```
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
     * Represents the intersection of all elements in a TypeScript tuple type.
     */
    type Intersection<I extends any[]> = I extends [infer I1, ...infer I2] ? I1 & Intersection<I2> : {};
    /**
     * Represents the union of all elements in a TypeScript tuple type.
     */
    type Union       <I extends any[]> = I extends [infer I1, ...infer I2] ? I1 | Union       <I2> : {};
    /**
     * Represents the union of keys of all elements in a TypeScript tuple type.
     */
    type AnyKeyFrom  <I extends any[]> = I extends [infer I1, ...infer I2] ? keyof I1 | AnyKeyFrom<I2> : never;
    /**
     * Finds the method type corresponding to a key `K` in the instance type of class `C` or multiple types `I[]`.
     */
    type OneOfMethods<C extends abstract new (...args: any[]) => any, I extends any[], K extends (keyof InstanceType<C>) | AnyKeyFrom<I>>
        = InstanceType<C>[K] extends (...args: any[]) => any ? InstanceType<C>[K]
            : I extends [infer I1, ...infer I2]
            ? (I1[K] extends (...args: any[]) => any ? I1[K] : OneOfMethods<any, I2, K>)
            : ((...args: unknown[]) => unknown);
    /**
     * A type that includes a readonly property {@linkcode SuperMethods.$super $super} of type `T`.
     */
    type SuperMethods<T> = {
        /**
         * A special object. Calling a method on this object will actually call the superclass method of the same name.
         */
        readonly $super: T;
    };
    /**
     * Indicates that this type also has a {@linkcode SuperMethods.$super $super} property for calling superclass methods.
     */
    type IntersectionWithSuperMethods<T> = T & SuperMethods<T>;

    /**
     * Interface for building Java adapters.
     */
    interface AdapterBuilder<C extends abstract new (...args: any[]) => any, I extends any[]> {
        /**
         * Specifies the Java interfaces to implement.
         * 
         * Can pass a single interface:
         * 
         * > ```javascript
         * > const $Runnable = Java.loadClass("java.lang.Runnable");
         * > const CustomRunnable = LavaAdapter.extend()
         * >     .implement($Runnable)
         * >     .override("run", function() {
         * >         console.info("Running!");
         * >     })
         * >     .asClass();
         * > 
         * > new CustomRunnable().run();
         * > ```
         * 
         * Can also pass multiple interfaces:
         * 
         * > ```javascript
         * > const $Runnable = Java.loadClass("java.lang.Runnable");
         * > const $Function = Java.loadClass("java.util.function.Function");
         * > const CustomRunnable = LavaAdapter.extend()
         * >     .implement($Runnable, $Function)
         * >     .override("run", function() {
         * >         // implement Runnable's run method
         * >     })
         * >     .override("apply", function(value) {
         * >         // implement Function's apply method
         * >     })
         * >     .asClass();
         * > ```
         * 
         * @param superInterface The Java interfaces to implement. Can be one or more interfaces, or an array of interfaces.
         *                       These interfaces should be obtained via `Java.loadClass`.
         * @return               The **current** `AdapterBuilder` with updated type parameters indicating the new interfaces to implement.
         */
        implement<I2 extends any[]>(...superInterface: I2): AdapterBuilder<C, [...I, ...I2]>;
        /**
         * Overrides a Java method.
         * 
         * See the {@link LavaAdapter module documentation} for examples.
         * 
         * @param methodName     The method name.
         * @param implementation A JavaScript function providing the concrete implementation.
         * @return               The current `AdapterBuilder`.
         */
        override<K extends (keyof InstanceType<C>) | AnyKeyFrom<I>>(
            methodName: K,
            implementation: (this: IntersectionWithSuperMethods<InstanceType<C & Intersection<I>>>, ...args: Parameters<OneOfMethods<C, I, K>>) => ReturnType<OneOfMethods<C, I, K>> | void
        ): this;
        /**
         * Overrides a Java method.
         * 
         * See the {@link LavaAdapter module documentation} for examples.
         * 
         * @param methodName     The method name.
         * @param implementation A JavaScript function providing the concrete implementation.
         * @return               The current `AdapterBuilder`.
         */
        override(methodName: string, implementation: (this: IntersectionWithSuperMethods<InstanceType<C & Intersection<I>>>, ...args: unknown[]) => any): this;
        /**
         * Overrides a Java method.
         * 
         * See the {@link LavaAdapter module documentation} for examples.
         * 
         * @param method         A Java method object obtained from a Java object.
         * @param implementation A JavaScript function providing the concrete implementation.
         * @return               The current `AdapterBuilder`.
         */
        override<K extends (keyof InstanceType<C>) | AnyKeyFrom<I>, M extends (C[K] | Intersection<I>[K])>(
            method: M,
            implementation: (this: IntersectionWithSuperMethods<InstanceType<C & Intersection<I>>>, ...args: Parameters<M>) => ReturnType<M> | void
        ): this;
        /**
         * Finishes the adapter definition and returns a Java class.
         * 
         * @return The generated Java class.
         */
        asClass(): C & (new (...args: any[]) => Intersection<I>);
    }

    /**
     * Starts an {@linkcode AdapterBuilder} that **directly extends** `java.lang.Object`.
     * 
     * See the {@link LavaAdapter module documentation} for examples.
     * 
     * @param superClass The Java class to extend, obtained via `Java.loadClass`.
     * @return           The created `AdapterBuilder`.
     */
    function extend(): AdapterBuilder<new () => {}, []>;
    /**
     * Specifies a Java class to extend and starts an {@linkcode AdapterBuilder}.
     * 
     * See the {@link LavaAdapter module documentation} for examples.
     * 
     * @param superClass The Java class to extend, obtained via `Java.loadClass`.
     * @return           The created `AdapterBuilder`.
     */
    function extend<C extends abstract new (...args: any[]) => any>(superClass: C): AdapterBuilder<C, []>;

}
