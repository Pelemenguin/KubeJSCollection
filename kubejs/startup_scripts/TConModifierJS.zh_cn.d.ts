// @ts-nocheck
namespace Internal {

    namespace pelemenguin$TConModifierJS {

        /**
         * `Internal` 命名空间中定义的类型的所有别名。  
         * 如果你使用了不同的 ProbeJS 版本或者类型定义文件中类型名称不同，
         * 你可以在这里更改类型定义以匹配实际类型。
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

            // 匠魂

            /** `slimeknights.tconstruct.library.modifiers.ModifierEntry` */
            type ModifierEntry                            = Internal.ModifierEntry;
            /** `slimeknights.tconstruct.library.modifiers.ModifierHooks` */
            type $ModifierHooks                    = typeof Internal.ModifierHooks;
            /** `slimeknights.tconstruct.library.modifiers.util.ModifierDeferredRegister` */
            type ModifierDeferredRegister                 = Internal.ModifierDeferredRegister;
            /** `slimeknights.tconstruct.library.modifiers.util.StaticModifier` */
            type StaticModifier<T extends Alias.Modifier> = Internal.StaticModifier<T>
            /** `slimeknights.tconstruct.library.module.ModuleHookMap$Builder` */
            type ModuleHookMap$Builder                    = Internal.ModuleHookMap$Builder;
            /** `slimeknights.tconstruct.library.tools.nbt.IToolStackView` */
            type IToolStackView                           = Internal.IToolStackView;
            /** `slimeknights.tconstruct.library.tools.stat.FloatToolStat` */
            type FloatToolStat                            = Internal.FloatToolStat;
            /** `slimeknights.tconstruct.library.tools.stat.ToolStats` */
            type ToolStats                                = Internal.ToolStats;

        }

        /**
         * 这里定义的所有强化的基类。
         */
        declare class BaseModifier extends Internal.Modifier {
            /**
             * @param builder 注册钩子方法时使用的 `Consumer`。
             * - - - - -
             * 参见
             * 
             * Java 文档：
             * - [Consumer](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/function/Consumer.html)
             */
            constructor(builder: (registerer: Alias.ModuleHookMap$Builder) => void);
        }
        /**
         * Builder 类。
         */
        declare class TConModifierBuilder {
            /**
             * @deprecated 用 {@linkcode create} 代替。
             *             方法 `create` 可以查找之前创建的 Builder 来支持重载。
             * - - - - -
             * 构建一个新的 Builder。
             */
            constructor(modifierId: string);
            /**
             * 该强化的 ID。
             */
            modifierId: string;
            /**
             * 要使用的方法。  
             * **不要更改**！
             */
            methods: TinkerFunctions
            /**
             * 创建一个新的 Builder。
             * - - - - -
             * @param modifierId 
             * 强化的 ID。
             */
            static create(modifierId: string): TConModifierBuilder;
            /**
             * 设置 `onInventoryTick` 方法。
             * 
             * 对于每个拥有该强化的在玩家物品栏中工具，这个方法每游戏刻会调用一次。
             * - - - - -
             * @param callback 回调函数
             * @returns        Builder 本身
             * - - - - -
             * @see {@linkcode TinkerFunctions.onInventoryTick onInventoryTick}
             * - - - - -
             * 示例
             * 
             * ```javascript
             * TConModifierJS.createModifier("test")
             *     .onInventoryTick((tool, modifier, world, holder, itemSlot, isSelected, isCorrectSlot, stack) => {
             *         if (!isSelected) return;
             *         console.info("太吵了！每个游戏刻都输出一次！所以我选择只在手持时输出，现在游戏刻数：" + world.getTime().toFixed());
             *     })
             *     .build();
             * ```
             */
            onInventoryTick(callback: TinkerFunctions["onInventoryTick"]): this;
            /**
             * 设置 `modifyStat` 方法。
             * 
             * 该方法在部分数值（例如弹射物力量、拉弓速度等）计算时实时调用以获取加成或削弱。
             * - - - - -
             * @param callback 回调函数
             * @returns        Builder 本身
             * - - - - -
             * @see {@linkcode TinkerFunctions.modifyStat modifyStat}
             * - - - - -
             * 示例
             * 
             * 下面的示例创建了一个 `test` 强化。
             * 在生命值低于 25% 时，其增加 20% 弹射物力量。
             * 
             * @example
             * TConModifierJS.createModifier("test")
             *     .modifyStat((tool, modifier, living, stat, baseValue, multiplier) => {
             *         // 如果修改的数值类型不是我们想要的弹射物力量，就直接返回原数值，不做更改
             *         if (stat != TConModifierJS.ToolStats.PROJECTILE_DAMAGE) return baseValue;
             *         // 计算并检查生命值
             *         let percentage = living.getHealth() / living.getMaxHealth();
             *         if (percentage < 0.25) {
             *             // 返回修改后的值
             *             return baseValue * (1 + 0.2 * multiplier);
             * 
             *             // `multiplier` 会受工具或其它强化的影响，带来更额外的加成或削弱
             *             // 如果想要忽略这些系数变化，使用：
             *             // return baseValue * 1.2;
             *         } else {
             *             // 不成立，返回未经修改的值
             *             return baseValue;
             *         }
             *     })
             *     .build()
             */
            modifyStat(callback: TinkerFunctions["modifyStat"]): this;
            /**
             * 构建该强化。
             * - - - - -
             * @returns 一个 `StaticModifier` 对象
             */
            build: () => Alias.StaticModifier<BaseModifier>;
        }
        /**
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
         * 强化所使用的方法的文档。
         */
        declare interface TinkerFunctions {
            /**
             * 在玩家物品栏中的物品更新时调用
             * - - - - -
             * @param tool             当前工具实例
             * @param modifier         运行该钩子方法的强化
             * @param world            包含该工具的世界
             * @param holder           手持该工具的实体
             * @param itemSlot (`int`) 包含该工具的栏位。注意其可能来自热键栏，主物品栏，或者护甲栏位
             * @param isSelected       若为真，则该物品当前正在玩家的主手上
             * @param isCorrectSlot    若为真，则该物品在恰当的栏位上。对于工具，这指的是主手或副手。对于护甲，这指的是其所属的护甲栏位
             * @param stack            物品堆叠实例，用于检查工具的其它栏位。不要更改
             */
            onInventoryTick?(tool: Alias.IToolStackView, modifier: Alias.ModifierEntry, world: Alias.Level, holder: Alias.LivingEntity, itemSlot: number, isSelected: boolean, isCorrectSlot: boolean, stack: Alias.ItemStack): void;
            /**
             * 用于更改工具使用时的数据的方法
             * - - - - -
             * @param tool         工具实例
             * @param modifier     强化实例
             * @param living       手持工具的实体
             * @param stat         要更改的数据，可以安全地进行实例比较
             * @param baseValue    该钩子方法修改之前的数据
             * @param multiplier   全局系数，工具中包含了相同的数值，但由于其广泛被额外数值奖励需要，这里为了便利而直接提供
             * @return             特性的新数值，或者在不想修改数值时返回 `baseValue`
             */
            modifyStat?(tool: Alias.IToolStackView, modifier: Alias.ModifierEntry, living: Alias.LivingEntity, stat: Alias.FloatToolStat, baseValue: number, multiplier: number): number;
        }
    }

}

/**
 * ## TConModifierJS
 */
declare interface TConModifierJS {
    /**
     * 注册强化使用的 `ModifierDeferredRegister` 对象。
     */
    MODIFIERS: Internal.pelemenguin$TConModifierJS.Alias.ModifierDeferredRegister;
    /**
     * 当前配置。
     */
    CONFIGS: {
        /**
         * 定义强化要注册的命名空间。
         */
        MODIFIERS_NAMESPACE: string,
        /**
         * 定义在 `global` 中储存的位置。
         */
        GLOBAL_PROPERTY_NAME: string,
        /**
         * 定义所有匠魂强化的基类的名称。
         */
        BASE_MODIFIER_CLASS_NAME: string
    };
    /**
     * @deprecated 改为使用 {@link TConModifierJS.customModifier}。
     * - - - - -
     * 这里定义的所有强化的基类。
     */
    BaseModifier: typeof Internal.pelemenguin$TConModifierJS.BaseModifier;
    /**
     * 强化 Builder 的 JavaScript 类。
     */
    TConModifierBuilder: typeof Internal.pelemenguin$TConModifierJS.TConModifierBuilder;
    /**
     * 由匠魂本地实现的所有钩子方法，为使用方便而提供。
     * 
     * 其等价于：
     * 
     * ```javascript
     * Java.loadClass("slimeknights.tconstruct.library.modifiers.ModifierHooks");
     * ```
     */
    ModifierHooks: Internal.pelemenguin$TConModifierJS.Alias.$ModifierHooks;
    /**
     * 处理所有工具数据的类，为使用方便而提供。
     * 
     * 其等价于：
     * 
     * ```javascript
     * Java.loadClass("slimeknights.tconstruct.library.tools.stat.ToolStats");
     * ```
     * 
     * 匠魂将其所有的内置工具数据类型以静态字段储存在这个类中。
     * 由于这些工具数据类型实例时全局唯一的，你可以放心使用 `==` 甚至 `===` 而无需使用 `equals` 方法。
     */
    ToolStats: typeof Internal.pelemenguin$TConModifierJS.Alias.ToolStats;
    /**
     * 创建一个自定义强化对象。
     * - - - - -
     * @param hookRegisterer 该对象自己的 `registerHooks` 方法。
     * @returns              创建的 {@linkcode TConModifierJS.BaseModifier} 对象。
     */
    customModifier(hookRegisterer: (hookBuilder: Internal.pelemenguin$TConModifierJS.Alias.ModuleHookMap$Builder) => void)
        : Internal.pelemenguin$TConModifierJS.BaseModifier;
    /**
     * @param modifierId 强化 ID。
     * @returns          创建的 Builder 对象。
     */
    createModifier(modifierId: string): Internal.pelemenguin$TConModifierJS.TConModifierBuilder
}
