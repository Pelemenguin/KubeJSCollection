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
 * `ComponentStylizer` is a KubeJS JavaScript library for easily creating and transforming text components (`Component`) in Minecraft to achieve custom text styling.
 * 
 * ## Usage
 * 
 * {@linkcode Stylizer} is the abstract base class responsible for transforming `Component`.
 * Use the {@linkcode Stylizer.transform} method to directly transform a string and output the created styled `Component`.
 * 
 * > ```javascript
 * > // after obtaining a stylizer
 * > stylizer.transform("text following a specific format...");
 * > ```
 * 
 * However, each transformation may cause performance issues, especially in high-frequency scenarios.
 * Therefore, it is recommended to use {@linkcode Stylizer.literal} or {@linkcode Stylizer.translatable} to create {@linkcode LazyComponent}.
 * Usage is similar to {@linkcode Component.literal} and {@linkcode Component.translatable}.
 * 
 * > ```javascript
 * > stylizer.literal("text waiting to be transformed...");
 * > stylizer.translatable("a.translation.key");
 * > stylizer.translatable("another.translation.key", "text", "to", "replace");
 * > ```
 * 
 * Then, keep the created `LazyComponent`. Afterwards, use the {@linkcode LazyComponent.get} method to obtain the transformed `Component`.
 * The advantage is that `transform` is only called the first time, and subsequent uses will reuse the cached result, reducing time overhead.
 * 
 * > ```javascript
 * > let lazy = stylizer.literal("input text");
 * > 
 * > if (Client.player) {
 * >     Client.player.tell(lazy.get());
 * > 
 * >     // subsequent get() will not recompute
 * >     Client.player.tell(lazy.get());
 * > }
 * > ```
 * 
 * @see {@linkcode Stylizer}
 * @see {@linkcode LazyComponent}
 * 
 * ## Built-in implementations
 * 
 * - {@linkcode Emphasizer} - A simple `Stylizer` used to emphasize text surrounded by specified characters. For example, by default `default _emph_` will be transformed into "default **emph**".
 *     You can customize the style of default text and emphasized text.
 * 
 * ## Custom Implementation
 * 
 * You can create a subclass of `Stylizer` via {@linkcode Object.setPrototypeOf}:
 * 
 * > ```javascript
 * > // Method to create a subclass in ES5
 * >
 * > let CustomStylizer = function () {};
 * > Object.setPrototypeOf(CustomStylizer.prototype, ComponentStylizer.Stylizer.prototype);
 * > CustomStylizer.prototype.transform = function (text) {
 * >     // Your own transform method implementation goes here
 * >     // Example: turn the text into a light purple Component
 * >     return Component.literal(text).lightPurple();
 * > };
 * > 
 * > let customStylizer = new CustomStylizer();
 * > if (Client.player) {
 * >     let lazy = customStylizer.literal("Using a custom Stylizer!");
 * >     Client.player.tell(lazy.get());
 * > }
 * > ```
 * 
 * However, we provide the {@linkcode Stylizer.custom} method to create subclass instances more conveniently:
 * 
 * > ```javascript
 * > // Automatically create a subclass instance via the custom method
 * >
 * > let customStylizer = ComponentStylizer.Stylizer.custom(text => {
 * >     // Your own transform method implementation goes here
 * >     return Component.literal(text).lightPurple();
 * > });
 * > 
 * > if (Client.player) {
 * >     let lazy = customStylizer.literal("Using a custom Stylizer");
 * >     Client.player.tell(lazy.get());
 * > }
 * > ```
 * 
 * ## Type definitions
 * 
 * Since both ProbeJS 6 and ProbeJS 7 exist on Minecraft version 1.20.1,
 * their generated type definition file formats are vastly different.
 * To get correct type hints, go to the {@linkcode Alias} namespace and change the aliases to match your ProbeJS generated type definitions.
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
     * Predefined aliases for documentation.
     * 
     * If these do not match the files generated by ProbeJS,
     * you can change them here to ensure your documentation works properly.
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
     * `LazyComponent` handles calls to {@linkcode Stylizer.transform}.
     * 
     * The `transform` method involves text parsing, and implementations may vary between `Stylizer` subclasses,
     * so the `transform` method can be time-consuming and may cause lag in high-frequency call scenarios.
     * 
     * `LazyComponent` can cache and reuse the `Component` obtained from `Stylizer` processing,
     * avoiding performance waste from repeated transformations.
     * 
     * However, `LazyComponent` will **refresh the cache when the text of the `Component` changes**.
     * This is designed considering that players may change the game language.
     * Therefore, if you use a `Component` whose text changes frequently, the effect of `LazyComponent` may not be optimal.
     * 
     * ## Usage
     * 
     * `LazyComponent` can be created via the constructor or the {@linkcode of} method:
     * 
     * > ```javascript
     * > let emphasizer = ComponentStylizer.Emphasizer.create();
     * > let lazy = ComponentStylizer.LazyComponent.of(Component.literal("This is a _emph_ test!"), emphasizer);
     * > // or
     * > // let lazy = new ComponentStylizer.LazyComponent(Component.literal("..."), emphasizer);
     * > ```
     * 
     * To get the transformed `Component`, use the {@linkcode get} method:
     * 
     * > ```javascript
     * > let component = lazy.get();
     * > if (Client.player) {
     * >     Client.player.tell(component);
     * > }
     * > ```
     * 
     * If you need to refresh the cache, use the {@linkcode clearCache} method to delete the previously obtained result,
     * so that the next `get` call will recompute.
     * 
     * Alternatively, use the {@linkcode refreshAndGet} method, which also clears the cache.
     * However, it does not wait until the next `get` call, but recomputes immediately and returns the result.
     * 
     * > ```javascript
     * > lazy.clearCache();
     * > lazy.get();           // recompute here
     * > 
     * > lazy.refreshAndGet(); // recompute immediately
     * > ````
     */
    class LazyComponent {
        /**
         * Constructs a new `LazyComponent`.
         * 
         * @param component The `Component` to transform
         * @param stylizer  The `Stylizer` to use
         */
        constructor(component: Alias.Component, stylizer: Stylizer);
        protected cachedString: string;
        protected cachedResult: Alias.Component;
        protected rawComponent: Alias.Component;
        protected stylizer: Stylizer;
        /**
         * Creates a new `LazyComponent`.
         * 
         * @param component The `Component` to transform
         * @param stylizer  The `Stylizer` to use
         * @returns         The created `LazyComponent`
         */
        static of(component: Alias.Component, stylizer: Stylizer): LazyComponent;
        /**
         * Gets the transformation result.
         * 
         * @returns The result
         */
        get(): Alias.Component;
        /**
         * Clears the cache without immediate recomputation.
         */
        clearCache(): void;
        /**
         * Clears the cache and recomputes immediately.
         * 
         * @returns The transformation result
         */
        refreshAndGet(): Alias.Component;
    }

    /**
     * `Stylizer` is an abstract base class that defines a `transform` method for converting a string into a `Component` with custom styling.
     */
    abstract class Stylizer {
        /**
         * Creates a custom `Stylizer` using the provided function.
         * 
         * @param transformFunction A function that converts the input text into a `Component`
         * 
         * @example
         * let customStylizer = ComponentStylizer.Stylizer.custom(text => {
         *     return Component.literal(text).lightPurple();
         * });
         *
         * if (Client.player) {
         *     Client.player.tell(customStylizer.literal("Using a custom Stylizer").get());
         * }
         */
        static custom(transformFunction: (text: string) => Alias.Component): Stylizer;
        /**
         * Transforms the given text.
         * 
         * @param text The input text
         */
        abstract transform(text: string): Alias.Component;
        /**
         * Creates a {@linkcode LazyComponent} from `Component.literal(text)` using this `Stylizer`.
         * 
         * @param text The input text
         * @returns    The created `LazyComponent`
         */
        literal(text: string): LazyComponent;
        /**
         * Creates a {@linkcode LazyComponent} from `Component.translatable(key, objects)` using this `Stylizer`.
         * 
         * @param key     The translation key
         * @param objects The replacement texts
         * @returns       The created `LazyComponent`
         */
        translatable(key: string, ...objects: any[]): LazyComponent;
    }

    /**
     * A very simple `Stylizer` with only two text styles.
     * 
     * `Emphasizer` emphasizes text between `emphCharacter` (default `_`) using `emphStyle`,
     * while other text uses `defaultStyle`.
     * 
     * For example:
     * 
     * |Original text       |Transformed text    |
     * |--------------------|--------------------|
     * |`plain text`        |plain text          |
     * |`_emphasized_ text` |**emphasized** text |
     * |`_1_ 2 _3_`         |**1** 2 **3**       |
     * |`golden\_apple`     |golden_apple        |
     * 
     * ## Usage
     * 
     * Use the constructor or the `create` method to create an `Emphasizer`.
     * 
     * > ```javascript
     * > // default Emphasizer
     * > let emphasizer1 = new ComponentStylizer.Emphasizer();
     * > 
     * > // also default Emphasizer
     * > let emphasizer2 = ComponentStylizer.Emphasizer.create();
     * > 
     * > // Emphasizer with specified emphStyle
     * > let emphasizer3 = ComponentStylizer.Emphasizer.create(
     * >     ComponentStylizer.Style.EMPTY.withBold(true).applyFormat("red")
     * > );
     * > 
     * > // Emphasizer with both emphStyle and defaultStyle specified
     * > let emphasizer4 = ComponentStylizer.Emphasizer.create(
     * >     ComponentStylizer.Style.EMPTY.withItalic(true).applyFormat("green"),
     * >     ComponentStylizer.Style.EMPTY.applyFormat("gray")
     * > );
     * > ```
     */
    class Emphasizer {
        /**
         * Constructs a new `Emphasizer`.
         */
        constructor();
        protected defaultStyle: Alias.Style;
        protected emphStyle: Alias.Style;
        protected emphCharacter: string;
        static create(emphStyle?: Alias.Style, defaultStyle?: Alias.Style): Emphasizer;
        /**
         * Sets the style for emphasized text.
         * 
         * @param style The style to set
         * @returns `this`
         */
        setEmphStyle(style: Alias.Style): this;
        /**
         * Sets the style for default text.
         * 
         * @param style The style to set
         * @returns `this`
         */
        setDefaultStyle(style: Alias.Style): this;
    }

    /**
     * Preloaded Java class `net.minecraft.network.chat.Style`, provided for convenience.
     * 
     * ## Usage
     * 
     * To create a `Style` object, you can start from `ComponentStylizer.Style.EMPTY` and use `withXxx()` methods to modify it.
     * 
     * > ```javascript
     * > // create a bold blue style
     * > ComponentStylizer.Style.EMPTY
     * >     .withBold()
     * >     .withColor("blue");
     * > ```
     * 
     * Note that `Style` is **immutable**; any `withXxx()` method actually creates and returns a new `Style` object rather than modifying the original.
     */
    const Style: Alias.$Style;

    /**
     * Preloaded Java class `net.minecraft.ChatFormatting`, provided for convenience.
     * 
     * ## Usage
     * 
     * `ChatFormatting` is an enum used in Minecraft to represent text formatting options such as colors and styles.
     * 
     * For example:
     * 
     * > ```javascript
     * > // colors
     * > ComponentStylizer.ChatFormatting.RED;
     * > ComponentStylizer.ChatFormatting.GREEN;
     * > ComponentStylizer.ChatFormatting.BLUE;
     * > ComponentStylizer.ChatFormatting.LIGHT_PURPLE;
     * > 
     * > // other formats
     * > ComponentStylizer.ChatFormatting.BOLD;
     * > ComponentStylizer.ChatFormatting.ITALIC;
     * > ComponentStylizer.ChatFormatting.UNDERLINE;
     * > ```
     * 
     * Since `ChatFormatting` is an enum, in some cases you can use a string directly
     * without accessing the static fields, because Rhino will convert it for you.
     * 
     * > ```javascript
     * > ComponentStylizer.Style.EMPTY.applyFormat("red");
     * > ComponentStylizer.Style.EMPTY.applyFormat(ComponentStylizer.ChatFormatting.RED);
     * > ```
     */
    const ChatFormatting: Alias.$ChatFormatting;

}

declare const ComponentStylizer: ComponentStylizer;
