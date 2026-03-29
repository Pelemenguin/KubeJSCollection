// @ts-nocheck
namespace Internal {

    namespace pelemenguin$TConModifierJS {

        /**
         * All the aliases of the types defined in the `Internal` namespace (ProbeJS 6).  
         * If you used a different ProbeJS version or typing files with different type names,
         * you can change the type definitions here to match the actual types.
         */
        namespace Alias {

            // Rhino
            /** `dev.latvian.mods.rhino.DefiningClassLoader` */
            type DefiningClassLoader = Internal.DefiningClassLoader;

            // Minecraft
            /** `net.minecraft.world.entity.EquipmentSlot` */
            type EquipmentSlot = Internal.EquipmentSlot;
            /** `net.minecraft.world.entity.LivingEntity` */
            type LivingEntity  = Internal.LivingEntity;
            /** `net.minecraft.world.item.ItemStack` */
            type ItemStack     = Internal.ItemStack;
            /** `net.minecraft.world.level.Level` */
            type Level         = Internal.Level;

            // TConstruct

            /** `slimeknights.tconstruct.library.modifiers.ModifierEntry` */
            type ModifierEntry                            = Internal.ModifierEntry;
            /** `slimeknights.tconstruct.library.modifiers.ModifierHooks` */
            type $ModifierHooks                    = typeof Internal.ModifierHooks;
            /** `slimeknights.tconstruct.library.modifiers.hook.armor` */
            type EquipmentChangeContext                   = Internal.EquipmentChangeContext;
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
            type  ToolStats                               = Internal.ToolStats;
            type $ToolStats                        = typeof Internal.ToolStats;

        }

        /**
         * The base class for all modifiers defined here.
         */
        declare class BaseModifier extends Internal.Modifier {
            /**
             * @param builder The `Consumer` used to register hooks for this modifier
             * - - - - -
             * See
             * 
             * Java Documentations：
             * - [Consumer](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/function/Consumer.html)
             */
            constructor(builder: (registerer: Alias.ModuleHookMap$Builder) => void);
        }
        /**
         * The builder class.  
         */
        declare class TConModifierBuilder {
            /**
             * @deprecated
             * Use {@linkcode create} instead.
             * The method `create` can look up for previously created builders to support reload.
             * - - - - -
             * Constructs a new `TConModifierBuilder`.
             */
            constructor(modifierId: string);
            /**
             * The id of this modifier.
             */
            modifierId: string;
            /**
             * Methods to use.  
             * **Do not modify**!
             */
            methods: TinkerFunctions
            /**
             * Creates a new `TConModifierBuilder`.
             * - - - - -
             * @param modifierId The id of the modifier.
             */
            static create(modifierId: string): TConModifierBuilder;
            /**
             * Sets the `modifyStat` method.
             * 
             * This method is called to get some stats (projectile power, draw speed, etc.) to calculate bonus or malus in real time.
             * - - - - -
             * @param callback The callback function
             * @returns        The builder itself
             * - - - - -
             * @see {@linkcode TinkerFunctions.modifyStat modifyStat}
             * - - - - -
             * Example
             * 
             * The example below created a modifier `test`.
             * It gives a bonus 20% projectile damage when the player's health is below 25%.
             * 
             * @example
             * TConModifierJS.createModifier("test")
             *     .modifyStat((tool, modifier, living, stat, baseValue, multiplier) => {
             *         // Check if it's the stat we want to modify. If not, return the unmodified value.
             *         if (stat != TConModifierJS.ToolStats.PROJECTILE_DAMAGE) return baseValue;
             *         // Calculate and check health percentage
             *         let percentage = living.getHealth() / living.getMaxHealth();
             *         if (percentage < 0.25) {
             *             // Return the modified value
             *             return baseValue * (1 + 0.2 * multiplier);
             * 
             *             // `multiplier` is affected by the tool or other modifiers, providing more extra bonus or malus.
             *             // If you want to ignore them, use:
             *             // return baseValue * 1.2;
             *         } else {
             *             // Not satisfied, return the unmodified value
             *             return baseValue;
             *         }
             *     })
             *     .build()
             */
            modifyStat(callback: TinkerFunctions["modifyStat"]): this;
            onEquip(callback: TinkerFunctions["onEquip"]): this;
            onUnequip(callback: TinkerFunctions["onUnequip"]): this;
            onEquipmentChange(callback: TinkerFunctions["onEquipmentChange"]): this;
            /**
             * Sets the `onInventoryTick` method.
             * 
             * This method is called every tick for a tool in the player's inventory.
             * - - - - -
             * @param callback The callback function
             * @returns        The builder itself
             * - - - - -
             * @see {@linkcode TinkerFunctions.onInventoryTick onInventoryTick}
             * - - - - -
             * Example
             * 
             * ```javascript
             * TConModifierJS.createModifier("test")
             *     .onInventoryTick((tool, modifier, world, holder, itemSlot, isSelected, isCorrectSlot, stack) => {
             *         if (!isSelected) return;
             *         console.info("This gotta be so noisy to print every tick! So I'm now ticking only when held. Game tick: " + world.getTime().toFixed());
             *     })
             *     .build();
             * ```
             */
            onInventoryTick(callback: TinkerFunctions["onInventoryTick"]): this;
            /**
             * Build the modifier.
             * - - - - -
             * @returns A `StaticModifier` object.
             */
            build: () => Alias.StaticModifier<BaseModifier>;
        }
        /**
         * Structure of the object stored in the `global`.  
         * This object should avoid being accessed.
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
         */
        declare interface TinkerFunctions {
            /**
             * Method to modify a stat as the tool is being used
             * - - - - -
             * @param tool         Tool instance
             * @param modifier     Modifier instance
             * @param living       Entity holding the tool
             * @param stat         Stat to be modified, safe to do instance equality
             * @param baseValue    Value before this hook modified the stat
             * @param multiplier   Global multiplier, same value contained in the tool, but fetched for convenience as it's commonly needed for stat bonuses
             * @return             New value of the stat, or baseValue if you choose not to modify this stat
             */
            modifyStat?(tool: Alias.IToolStackView, modifier: Alias.ModifierEntry, living: Alias.LivingEntity, stat: Alias.FloatToolStat, baseValue: number, multiplier: number): number;
            /**
             * Called when a tinker tool is equipped to an entity
             * - - - - -
             * @param tool         Tool equipped
             * @param modifier     Level of the modifier
             * @param context      Context about the event
             * - - - - -
             * @see {@linkcode onUnequip}
             * @see {@linkcode onEquipmentChange}
             */
            onEquip?(tool: Alias.IToolStackView, modifier: Alias.ModifierEntry, context: Alias.EquipmentChangeContext): void;
            /**
             * Called when a tinker tool is unequipped from an entity
             * - - - - -
             * @param tool         Tool unequipped
             * @param modifier     Level of the modifier
             * @param context      Context about the event
             * - - - - -
             * @see {@linkcode onEquip}
             * @see {@linkcode onEquipmentChange}
             */
            onUnequip?(tool: Alias.IToolStackView, modifier: Alias.ModifierEntry, context: Alias.EquipmentChangeContext): void;
            /**
             * Called when a stack in a different slot changed. Not called on the slot that changed
             * - - - - -
             * @param tool      Tool instance
             * @param modifier  Level of the modifier
             * @param context   Context describing the change
             * @param slotType  Slot containing this tool, did not change
             * - - - - -
             * @see {@linkcode onEquip}
             * @see {@linkcode onUnequip}
             */
            onEquipmentChange?(tool: Alias.IToolStackView, modifier: Alias.ModifierEntry, context: Alias.EquipmentChangeContext, slotType: Alias.EquipmentSlot): void;
            /**
             * Called when the stack updates in the player inventory
             * - - - - -
             * @param tool             Current tool instance
             * @param modifier         Modifier running the hook
             * @param world            World containing tool
             * @param holder           Entity holding tool
             * @param itemSlot (`int`) Slot containing this tool. Note this may be from the hotbar, main inventory, or armor inventory
             * @param isSelected       If true, this item is currently in the player's main hand
             * @param isCorrectSlot    If true, this item is in the proper slot. For tools, that is main hand or off hand. For armor, this means its in the correct armor slot
             * @param stack            Item stack instance to check other slots for the tool. Do not modify
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
     */
    MODIFIERS: Internal.pelemenguin$TConModifierJS.Alias.ModifierDeferredRegister;
    /**
     * Current configs.
     */
    CONFIGS: {
        /**
         * Defines the namespace of the modifiers to register.
         */
        MODIFIERS_NAMESPACE: string,
        /**
         * Defines the location to store in `global`.
         */
        GLOBAL_PROPERTY_NAME: string,
        /**
         * Defines the name of the base class of all modifiers.
         */
        BASE_MODIFIER_CLASS_NAME: string
    };
    /**
     * @deprecated Use {@link TConModifierJS.customModifier} instead.
     * - - - - -
     * The base Java class for all modifiers defined here.
     */
    BaseModifier: typeof Internal.pelemenguin$TConModifierJS.BaseModifier;
    /**
     * The JavaScript class of the modifier builders.
     */
    TConModifierBuilder: typeof Internal.pelemenguin$TConModifierJS.TConModifierBuilder;
    /**
     * Collection of all hooks implemented by the mod natively.
     * 
     * This is equivalent to:
     * 
     * ```javascript
     * Java.loadClass("slimeknights.tconstruct.library.modifiers.ModifierHooks");
     * ```
     */
    ModifierHooks: Internal.pelemenguin$TConModifierJS.Alias.$ModifierHooks;
    /**
     * Class handling all tool stats, provided for convenience.
     * 
     * This is equivalent to:
     * 
     * ```javascript
     * Java.loadClass("slimeknights.tconstruct.library.tools.stat.ToolStats");
     * ```
     * 
     * Tinker's Construct stores all its built-in tool stats in static fields of this class.
     * Due to these tool stats instances are universally unique, you can safely compare using `==` or even `===` without calling `equals` method.
     */
    ToolStats: Internal.pelemenguin$TConModifierJS.Alias.$ToolStats;
    /**
     * Creates a custom modifier object.
     * - - - - -
     * @param hookRegisterer The object's own `registerHooks` method.
     * @returns              The created {@linkcode TConModifierJS.BaseModifier} object.
     */
    customModifier(hookRegisterer: (hookBuilder: Internal.pelemenguin$TConModifierJS.Alias.ModuleHookMap$Builder) => void)
        : Internal.pelemenguin$TConModifierJS.BaseModifier;
    /**
     * @param modifierId The id of the modifier.
     * @returns          The created builder.
     */
    createModifier(modifierId: string): Internal.pelemenguin$TConModifierJS.TConModifierBuilder
}
