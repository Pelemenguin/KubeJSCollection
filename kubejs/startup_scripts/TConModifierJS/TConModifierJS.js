// priority: 2147483647

const TConModifierJS = (() => {

/**
 * @type {TConModifierJS["CONFIGS"]}
 */
const CONFIGS = {

// ================================
// ||          CONFIGS           ||
// ================================

MODIFIERS_NAMESPACE: "kubejs",
GLOBAL_PROPERTY_NAME: "pelemenguin$tconstruct_modifier_js",
BASE_MODIFIER_CLASS_NAME: "pelemenguin.tconmodifierjs.BaseModifier"

// ================================
// ||       END OF CONFIGS       ||
// ================================

};

Object.freeze(CONFIGS);





//#region Java Classes

// Java
const $String = Java.loadClass("java.lang.String");

// KubeJS
const $KubeJS = Java.loadClass("dev.latvian.mods.kubejs.KubeJS");

// Rhino
const $Context             = Java.loadClass("dev.latvian.mods.rhino.Context");
const $DefiningClassLoader = Java.loadClass("dev.latvian.mods.rhino.DefiningClassLoader");
const $NativeJavaClass     = Java.loadClass("dev.latvian.mods.rhino.NativeJavaClass");

// Tinker's Construct
const $Modifier                  = Java.loadClass("slimeknights.tconstruct.library.modifiers.Modifier");
const $ModifierHooks             = Java.loadClass("slimeknights.tconstruct.library.modifiers.ModifierHooks");
const $ModifierDeferredRegister  = Java.loadClass("slimeknights.tconstruct.library.modifiers.util.ModifierDeferredRegister");
const $ToolStats                 = Java.loadClass("slimeknights.tconstruct.library.tools.stat.ToolStats");

// Hooks // All of them used `tryLoadClass` to prevent user's TiC version is too low

/** @type {Internal.EquipmentChangeModifierHook} */
const $EquipmentChangeModifierHook = Java.tryLoadClass("slimeknights.tconstruct.library.modifiers.hook.armor.EquipmentChangeModifierHook");
/** @type {Internal.ConditionalStatModifierHook} */
const $ConditionalStatModifierHook = Java.tryLoadClass("slimeknights.tconstruct.library.modifiers.hook.build.ConditionalStatModifierHook");
/** @type {Internal.InventoryTickModifierHook} */
const $InventoryTickModifierHook   = Java.tryLoadClass("slimeknights.tconstruct.library.modifiers.hook.interaction.InventoryTickModifierHook");

//#endregion

//#region - Constants
const startupScriptManager = $KubeJS.getStartupScriptManager();
const context = startupScriptManager.context;
const topLevelScope = startupScriptManager.topLevelScope;
//#endregion

//#region - Internal Helper Methods
/** @type {<K extends keyof Internal.pelemenguin$TConModifierJS.TheGlobal>(property: K, supplier: () => Internal.pelemenguin$TConModifierJS.TheGlobal[K]) => Internal.pelemenguin$TConModifierJS.TheGlobal[K]} */
const getFromGlobalOrCreate = (property, supplier) => {
    if (!theGlobal[property]) {
        theGlobal[property] = supplier();
    }
    return theGlobal[property];
};

const $Class_forName = Java.getClass().getClass().getMethod("forName", Java.loadClass("java.lang.String"));

/**
 * @param {string} className 
 * @returns {typeof any}
 */
const loadSpecial = (className) => {
    return new $NativeJavaClass(context, topLevelScope, $Class_forName.invoke(null, className));
}

//#endregion

//#region - Load Special Java Classes

// Java
/** @type {Internal.StandardCharsets} */
const $StandardCharsets = loadSpecial("java.nio.charset.StandardCharsets");

// Minecraft Forge
/** @type {Internal.FMLJavaModLoadingContext} */
const $FMLJavaModLoadingContext = loadSpecial("net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext");

// ASM

/** @type {Internal.ClassWriter} */
const $ClassWriter = loadSpecial("org.objectweb.asm.ClassWriter");
/** @type {Internal.Opcodes} */
const $Opcodes = loadSpecial("org.objectweb.asm.Opcodes");

//#endregion

//#region - Initialization

/** @type {Internal.pelemenguin$TConModifierJS.TheGlobal} */
let theGlobal;
let firstLoaded;
if (CONFIGS.GLOBAL_PROPERTY_NAME in global) {
    theGlobal = global[CONFIGS.GLOBAL_PROPERTY_NAME];
    firstLoaded = false;
} else {
    theGlobal = {};
    global[CONFIGS.GLOBAL_PROPERTY_NAME] = theGlobal;
    firstLoaded = true;
}

let classLoader = getFromGlobalOrCreate("classLoader", () => new $DefiningClassLoader());

//#endregion

//#region - Base Modifier Class

/**
 * @type {Internal.Class<Internal.pelemenguin$TConModifierJS.BaseModifier>}
 */
const RawBaseModifierClass = (() => {

if (!firstLoaded) {
    try {
        return classLoader.loadClass(CONFIGS.BASE_MODIFIER_CLASS_NAME);
    } catch (e) {
        console.error(e);
    }
}

let thisClassName = CONFIGS.BASE_MODIFIER_CLASS_NAME.replace(/\./g, '/');

let cw = new $ClassWriter($ClassWriter.COMPUTE_FRAMES | $ClassWriter.COMPUTE_MAXS);

cw.visit(
    $Opcodes.V17,
    $Opcodes.ACC_PUBLIC | $Opcodes.ACC_SUPER,
    thisClassName,
    null,
    "slimeknights/tconstruct/library/modifiers/Modifier",
    null
);

// private Consumer<ModuleHookMap.Builder> hooksRegisterer;
let hooksRegistererField = cw.visitField(
    $Opcodes.ACC_PRIVATE,
    "hooksRegisterer", "Ljava/util/function/Consumer;",
    null, null
);
hooksRegistererField.visitEnd();

// import slimeknights.tconstruct.library.module.ModuleHookMap;
// public constructor(Consumer<ModuleHookMap.Builder> builder) {
//     ModuleHookMap.Builder hookBuilder = ModuleHookMap.builder(); // static method builder()
//     builder.accept(hookBuilder);
//     ModuleHookMap hookMap = hookBuilder.build()
//     super(hookMap);
//     this.hooksRegisterer = builder;
// }
let cons = cw.visitMethod(
    $Opcodes.ACC_PUBLIC,
    "<init>", "(Ljava/util/function/Consumer;)V",
    null, null
);
cons.visitCode();
cons.visitVarInsn($Opcodes.ALOAD, 0);
cons.visitVarInsn($Opcodes.ALOAD, 1);
cons.visitMethodInsn($Opcodes.INVOKESTATIC, "slimeknights/tconstruct/library/module/ModuleHookMap", "builder", "()Lslimeknights/tconstruct/library/module/ModuleHookMap$Builder;", false);
cons.visitInsn($Opcodes.DUP);
cons.visitVarInsn($Opcodes.ASTORE, 2);
cons.visitMethodInsn($Opcodes.INVOKEINTERFACE, "java/util/function/Consumer", "accept", "(Ljava/lang/Object;)V", true);
cons.visitVarInsn($Opcodes.ALOAD, 2);
cons.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "slimeknights/tconstruct/library/module/ModuleHookMap$Builder", "build", "()Lslimeknights/tconstruct/library/module/ModuleHookMap;", false);
cons.visitMethodInsn($Opcodes.INVOKESPECIAL, "slimeknights/tconstruct/library/modifiers/Modifier", "<init>", "(Lslimeknights/tconstruct/library/module/ModuleHookMap;)V", false);
cons.visitVarInsn($Opcodes.ALOAD, 0);
cons.visitVarInsn($Opcodes.ALOAD, 1);
cons.visitFieldInsn($Opcodes.PUTFIELD, thisClassName, "hooksRegisterer", "Ljava/util/function/Consumer;");
cons.visitInsn($Opcodes.RETURN);
cons.visitMaxs(0, 0);
cons.visitEnd();

// @Override
// protected void registerHooks(ModuleHookMap.Builder hookBuilder) {
//     this.hooksRegisterer.accept(hookBuilder);
// }
let regHooks = cw.visitMethod(
    $Opcodes.ACC_PROTECTED,
    "registerHooks", "(Lslimeknights/tconstruct/library/module/ModuleHookMap;)V",
    null, null
);
regHooks.visitCode();
regHooks.visitVarInsn($Opcodes.ALOAD, 0);
regHooks.visitFieldInsn($Opcodes.GETFIELD, thisClassName, "hooksRegisterer", "Ljava/util/function/Consumer;");
regHooks.visitVarInsn($Opcodes.ALOAD, 1);
regHooks.visitMethodInsn($Opcodes.INVOKEINTERFACE, "java/util/function/Consumer", "accept", "(Ljava/lang/Object;)V", true);
regHooks.visitInsn($Opcodes.RETURN);
regHooks.visitMaxs(0, 0);
regHooks.visitEnd();

cw.visitEnd();

let code = cw.toByteArray();

return classLoader.defineClass(CONFIGS.BASE_MODIFIER_CLASS_NAME, code);

})();

/**
 * @type {typeof Internal.pelemenguin$TConModifierJS.BaseModifier}
 */
const BaseModifierClass = new $NativeJavaClass(context, startupScriptManager.topLevelScope, RawBaseModifierClass);

//#endregion

//#region - Modifier Builder and Registration

let modifiersRegistry = getFromGlobalOrCreate("modifiers", () => $ModifierDeferredRegister.create(CONFIGS.MODIFIERS_NAMESPACE));
let createdBuilders = getFromGlobalOrCreate("createdBuilders", () => {return {};});
let registeredModifiers = getFromGlobalOrCreate("registeredModifiers", () => {return {};});

/** @type {typeof Internal.pelemenguin$TConModifierJS.TConModifierBuilder} */
let TConModifierBuilderClass = getFromGlobalOrCreate("builderClass", () => function(modifierId) {
    this.modifierId = modifierId;
    this.methods = {};
});

TConModifierBuilderClass.create = (modifierId) => {
    if (createdBuilders[modifierId]) {
        return createdBuilders[modifierId];
    }
    let builder = new TConModifierBuilderClass(modifierId);
    createdBuilders[modifierId] = builder;
    return builder;
}

/** @type {Internal.pelemenguin$TConModifierJS.TConModifierBuilder} */
TConModifierBuilderClass.prototype = {
    onInventoryTick: function (callback) {
        this.methods.onInventoryTick = (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) => {
                try {
                    callback(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7)
                } catch (e) {
                    console.error(`Error during "onInventoryTick" of modifier ${this.modifierId}: ` + e)
                }
            };
        return this;
    },
    onEquip: function(callback) {
        this.methods.onEquip = (arg0, arg1, arg2) => {
            try {
                callback(arg0, arg1, arg2)
            } catch (e) {
                console.error(`Error during "onEquip" of modifier ${this.modifierId}: ` + e)
            }
        }
        if (!this.methods.onUnequip) this.methods.onUnequip = () => {};
        if (!this.methods.onEquipmentChange) this.methods.onEquipmentChange = () => {};
        return this;
    },
    onUnequip: function (callback) {
        this.methods.onEquip = (arg0, arg1, arg2) => {
            try {
                callback(arg0, arg1, arg2)
            } catch (e) {
                console.error(`Error during "onUnequip" of modifier ${this.modifierId}: ` + e)
            }
        }
        if (!this.methods.onEquip) this.methods.onEquip = () => {};
        if (!this.methods.onEquipmentChange) this.methods.onEquipmentChange = () => {};
        return this;
    },
    onEquipmentChange: function (callback) {
        this.methods.onEquipmentChange = (arg0, arg1, arg2, arg3) => {
            try {
                callback(arg0, arg1, arg2, arg3);
            } catch (e) {
                console.error(`Error during "onEquipmentChange" of modifier ${this.modifierId}: ` + e)
            }
        }
        if (!this.methods.onEquip) this.methods.onEquip = () => {};
        if (!this.methods.onUnequip) this.methods.onUnequip = () => {};
        return this;
    },
    modifyStat: function(callback) {
        this.methods.modifyStat = (arg0, arg1, arg2, arg3, arg4, arg5) => {
                try {
                    let result = callback(arg0, arg1, arg2, arg3, arg4, arg5);
                    if (result === undefined) {
                        return arg4;
                    }
                    return result;
                } catch (e) {
                    console.error(`Error during "modifyStat" of modifier ${this.modifierId}: ` + e)
                    return arg4;
                }
            };
        return this;
    },
    build: function() {
        if (!registeredModifiers[this.modifierId]) {
            let outerThis = this;
            let built = modifiersRegistry.register(this.modifierId, () => new BaseModifierClass((hooksBuilder) => {
                let methodGroup = this.methods;
                if (methodGroup.modifyStat) {
                    hooksBuilder.addHook(new JavaAdapter($ConditionalStatModifierHook, {
                        modifyStat: function(arg0, arg1, arg2, arg3, arg4, arg5) {
                            return outerThis.methods.modifyStat(arg0, arg1, arg2, arg3, arg4, arg5)
                        }
                    }), $ModifierHooks.CONDITIONAL_STAT);
                }
                // TODO: TOOL_ACTION
                if (methodGroup.onEquip) {
                    hooksBuilder.addHook($Context.jsToJava(context, {
                        onEquip: function (arg0, arg1, arg2) {
                            console.info("I'm called")
                            outerThis.methods.onEquip(arg0, arg1, arg2);
                        },
                        onUnequip: function(arg0, arg1, arg2) {
                            outerThis.methods.onUnequip(arg0, arg1, arg2);
                        },
                        onEquipmentChange: function (arg0, arg1, arg2, arg3) {
                            outerThis.methods.onEquipmentChange(arg0, arg1, arg2, arg3);
                        }
                    }, $EquipmentChangeModifierHook), $ModifierHooks.EQUIPMENT_CHANGE);
                }
                if (methodGroup.onInventoryTick) {
                    hooksBuilder.addHook(new JavaAdapter($InventoryTickModifierHook, {
                        onInventoryTick: function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
                            outerThis.methods.onInventoryTick(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7)
                        }
                    }), $ModifierHooks.INVENTORY_TICK);
                }
            }));
            registeredModifiers[this.modifierId] = built;
        }
        return registeredModifiers[this.modifierId];
    }
}

if (firstLoaded) {
    modifiersRegistry.register($FMLJavaModLoadingContext.get().getModEventBus());
}

//#endregion

/** @type {TConModifierJS} */
const resultObject = {

    // Constants
    MODIFIERS: modifiersRegistry,
    CONFIGS: CONFIGS,

    // Created classes
    BaseModifier: BaseModifierClass,
    TConModifierBuilder: TConModifierBuilderClass,

    // Pre-loaded classes
    ToolStats: $ToolStats,
    ModifierHooks: $ModifierHooks,

    // Tool methods
    customModifier: (hookRegisterer) => {
        return new BaseModifierClass(hookRegisterer);
    },
    createModifier: (modifierId) => {
        return TConModifierBuilderClass.create(modifierId);
    }

};

Object.setPrototypeOf(resultObject, null);
Object.freeze(resultObject);

return resultObject;

})();

console.info("TConModifierJS initialization complete!")
