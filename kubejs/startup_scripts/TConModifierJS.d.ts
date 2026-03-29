namespace Internal {

    namespace pelemenguin$TConModifierJS {

        /**
         * All the aliases of the types defined in the `Internal` namespace (ProbeJS 6).  
         * If you used a different ProbeJS version or typing files with different type names,
         * you can change the type definitions here to match the actual types.  
         * `Internal` 命名空间中定义的类型的所有别名。  
         * 如果你使用了不同的 ProbeJS 版本或者类型定义文件中类型名称不同，你可以在这里更改类型定义以匹配实际类型。
         */
        namespace Alias {

            // Rhino
            /** `dev.latvian.mods.rhino.DefiningClassLoader` */
            type DefiningClassLoader = Internal.DefiningClassLoader;

            // Minecraft
            /** `net.minecraft.world.entity.LivingEntity` */
            type LivingEntity = Internal.LivingEntity;
            /** `net.minecraft.world.item.ItemStack` */
            type ItemStack    = Internal.ItemStack;
            /** `net.minecraft.world.level.Level` */
            type Level        = Internal.Level;

            // TConstruct | 匠魂

            /** `slimeknights.tconstruct.library.modifiers.ModifierEntry` */
            type ModifierEntry                            = Internal.ModifierEntry;
            /** `slimeknights.tconstruct.library.modifiers.util.ModifierDeferredRegister` */
            type ModifierDeferredRegister                 = Internal.ModifierDeferredRegister;
            /** `slimeknights.tconstruct.library.modifiers.util.StaticModifier` */
            type StaticModifier<T extends Alias.Modifier> = Internal.StaticModifier<T>
            /** `slimeknights.tconstruct.library.module.ModuleHookMap$Builder` */
            type ModuleHookMap$Builder                    = Internal.ModuleHookMap$Builder;
            /** `slimeknights.tconstruct.library.tools.nbt.IToolStackView` */
            type IToolStackView                           = Internal.IToolStackView;
        }

        /**
         * The base class for all modifiers defined here.  
         * 这里定义的所有强化的基类。
         */
        declare class BaseModifier extends Internal.Modifier {
            /**
             * ## Parameters | 参数
             * @param builder The `Consumer` used to register hooks for this modifier.
             *                注册钩子方法时使用的 `Consumer`。
             * - - - - -
             * ## See | 参见
             * Java 文档：
             * - [Consumer](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/function/Consumer.html)
             */
            constructor(builder: (registerer: Alias.ModuleHookMap$Builder) => void);
        }
        /**
         * The builder class.  
         * Builder 类。
         */
        declare class TConModifierBuilder {
            /**
             * @deprecated
             * Use {@linkcode create} instead.
             * The method `create` can look up for previously created builders to support reload.  
             * 用 {@linkcode create} 代替。
             * 方法 `create` 可以查找之前创建的 Builder 来支持重载。
             * - - - - -
             * Constructs a new `TConModifierBuilder`.
             * 构建一个新的 Builder。
             */
            constructor(modifierId: string);
            /**
             * The id of this modifier.  
             * 该强化的 ID。
             */
            modifierId: string;
            /**
             * Methods to use.  
             * **Do not modify**!  
             * 要使用的方法。  
             * **不要更改**！
             */
            methods: TinkerFunctions
            /**
             * Creates a new `TConModifierBuilder`.  
             * 创建一个新的 Builder。
             * - - - - -
             * @param modifierId 
             * The id of the modifier.  
             * 强化的 ID。
             */
            static create(modifierId: string): TConModifierBuilder;
            /**
             * Sets the `onInventoryTick` method.  
             * 设置 `onInventoryTick` 方法。
             * 
             * This method is called every tick for a tool in the player's inventory.  
             * 对于每个拥有该强化的在玩家物品栏中工具，这个方法每游戏刻会调用一次。
             * - - - - -
             * @param callback 
             * The callback function.  
             * 回调函数。
             * 
             * @returns 
             * The builder itself.  
             * Builder 本身。
             * - - - - -
             * Example | 实例
             * 
             * ```javascript
             * TConModifierJS.createModifier("test")
             *     .onInventoryTick((tool, modifier, world, holder, itemSlot, isSelected, isCorrectSlot, stack) => {
             *         if (!isSelected) return;
             *         console.info("This gotta be noisy so I'm now ticking only when held: " + world.getTime().toFixed());
             *     })
             *     .build();
             * ```
             * - - - - -
             * @see {@linkcode TinkerFunctions.onInventoryTick onInventoryTick}
             */
            onInventoryTick(callback: TinkerFunctions["onInventoryTick"]): this;
            /**
             * Build the modifier.  
             * 构建该强化。
             * - - - - -
             * @returns 
             * A `StaticModifier` object.
             * 一个 `StaticModifier` 对象。
             */
            build: () => Alias.StaticModifier<BaseModifier>;
        }
        /**
         * Structure of the object stored in the `global`.  
         * This object should avoid being accessed.  
         * 储存在 `global` 中的对象结构。  
         * 该对象应该避免被访问。
         */
        declare interface TheGlobal {
            classLoader: Alias.DefiningClassLoader;
            modifiers: Alias.ModifierDeferredRegister;
            createdBuilders: {[modifierId: string]: TConModifierBuilder};
            registeredModifiers: {[modifierId: string]: StaticModifier<BaseModifier>};
            builderClass: typeof TConModifierBuilder
        }
        /**
         * Docs for methods of modifiers.  
         * 强化所使用的方法的文档。
         */
        declare interface TinkerFunctions {
            /**
             * Called when the stack updates in the player inventory  
             * 在玩家物品栏中的物品更新时调用
             * - - - - -
             * @param tool           Current tool instance
             *                       当前工具实例
             * 
             * @param modifier       Modifier running the hook
             *                       运行该钩子方法的强化
             * 
             * @param world          World containing tool  
             *                       包含该工具的世界
             * 
             * @param holder         Entity holding tool  
             *                       手持该工具的实体
             * 
             * @param itemSlot       Slot containing this tool. Note this may be from the hotbar, main inventory, or armor inventory  
             *                       包含该工具的栏位。注意其可能来自热键栏，主物品栏，或者护甲栏位
             * 
             * @param isSelected     If true, this item is currently in the player's main hand  
             *                       若为真，则该物品当前正在玩家的主手上
             * 
             * @param isCorrectSlot  If true, this item is in the proper slot. For tools, that is main hand or off hand. For armor, this means its in the correct armor slot  
             *                       若为真，则该物品在恰当的栏位上。对于工具，这指的是主手或副手。对于护甲，这指的是其所属的护甲栏位
             * 
             * @param stack          Item stack instance to check other slots for the tool. Do not modify  
             *                       物品堆叠实例，用于检查工具的其它栏位。不要更改
             */
            onInventoryTick?(tool: Alias.IToolStackView, modifier: Alias.ModifierEntry, world: Alias.Level, holder: Alias.LivingEntity, itemSlot: number, isSelected: boolean, isCorrectSlot: boolean, stack: Alias.ItemStack): void;
        }
    }

}

/**
 * ## TConModifierJS
 */
declare interface TConModifierJS {
    /**
     * The `ModifierDeferredRegister` object used to register the modifiers.  
     * 注册强化使用的 `ModifierDeferredRegister` 对象。
     */
    MODIFIERS: Internal.pelemenguin$TConModifierJS.Alias.ModifierDeferredRegister;
    /**
     * Current configs.  
     * 当前配置。
     */
    CONFIGS: {
        /**
         * Defines the namespace of the modifiers to register.  
         * 定义强化要注册的命名空间。
         */
        MODIFIERS_NAMESPACE: string,
        /**
         * Defines the location to store in `global`.  
         * 定义在 `global` 中储存的位置。
         */
        GLOBAL_PROPERTY_NAME: string,
        /**
         * Defines the name of the base class of all modifiers.  
         * 定义所有匠魂强化的基类的名称。
         */
        BASE_MODIFIER_CLASS_NAME: string
    };
    /**
     * @deprecated
     * Use {@link TConModifierJS.customModifier} instead.  
     * 改为使用 {@link TConModifierJS.customModifier}。
     * - - - - -
     * The base Java class for all modifiers defined here.  
     * 这里定义的所有强化的基类。
     */
    BaseModifier: typeof Internal.pelemenguin$TConModifierJS.BaseModifier;
    /**
     * The JavaScript class of the modifier builders.  
     * 强化 Builder 的 JavaScript 类。
     */
    TConModifierBuilder: typeof Internal.pelemenguin$TConModifierJS.TConModifierBuilder;
    /**
     * Creates a custom modifier object.  
     * 创建一个自定义强化对象。
     * - - - - -
     * ## Parameters and Return value | 参数与返回值
     * @param hookRegisterer 
     * The object's own `registerHooks` method.  
     * 该对象自己的 `registerHooks` 方法。
     * 
     * @returns 
     * The created {@linkcode TConModifierJS.BaseModifier} object.
     * 创建的 {@linkcode TConModifierJS.BaseModifier} 对象。
     */
    customModifier(hookRegisterer: (hookBuilder: Internal.pelemenguin$TConModifierJS.Alias.ModuleHookMap$Builder) => void)
        : Internal.pelemenguin$TConModifierJS.BaseModifier;
    /**
     * - - - - -
     * @param modifierId 
     * The id of the modifier.  
     * 强化 ID。
     * 
     * @returns 
     * The created builder.  
     * 创建的 Builder 对象。
     */
    createModifier(modifierId: string): Internal.pelemenguin$TConModifierJS.TConModifierBuilder
}
