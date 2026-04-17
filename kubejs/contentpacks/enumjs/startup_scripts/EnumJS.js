// priority: 2147483647

/// <reference path="../probe/EnumJS.d.ts" />

/** @type {typeof EnumJS} */
const EnumJS = (() => {

//#region - Class Filter

const $NativeJavaClass  = Java.loadClass("dev.latvian.mods.rhino.NativeJavaClass");
const $ScriptableObject = Java.loadClass("dev.latvian.mods.rhino.ScriptableObject");

const $Class_forName = Java.getClass().getClass().getMethod("forName", Java.loadClass("java.lang.String"));
let loadRaw = (className) => $Class_forName.invoke(null, className);

/** @type {Internal.Context} */
const currentContext = loadRaw("dev.latvian.mods.kubejs.script.ScriptManager").getMethod("getCurrentContext").invoke(null);
const topLevelScope  = $ScriptableObject.getTopLevelScope({});
/** @return {any} */
let loadSpecial = (className) => new $NativeJavaClass(currentContext, topLevelScope, loadRaw(className));

//#endregion

//#region - Java Classes

// Java
const $Integer = Java.loadClass("java.lang.Integer");

// ASM
const $ClassWriter = loadSpecial("org.objectweb.asm.ClassWriter");
const $Opcodes     = loadSpecial("org.objectweb.asm.Opcodes");
const $Type        = loadSpecial("org.objectweb.asm.Type");

// Rhino
const $DefiningClassLoader = Java.loadClass("dev.latvian.mods.rhino.DefiningClassLoader");

const EnumJSClassLoader = new $DefiningClassLoader();

//#endregion

//#region - Helpers

let generateField = function(cw, className, c) {
    cw.visitField($Opcodes.ACC_PUBLIC | $Opcodes.ACC_STATIC | $Opcodes.ACC_FINAL | $Opcodes.ACC_ENUM, c, "L" + className + ";", null, null).visitEnd();
};

let clinitField = function(mv, className, c, original) {
    mv.visitTypeInsn($Opcodes.NEW, className);
    mv.visitInsn($Opcodes.DUP);
    mv.visitLdcInsn(c);
    mv.visitLdcInsn($Integer["valueOf(int)"](original));
    mv.visitMethodInsn($Opcodes.INVOKESPECIAL, className, "<init>", "(Ljava/lang/String;I)V", false);
    mv.visitFieldInsn($Opcodes.PUTSTATIC, className, c, "L" + className + ";");
};

let generateEnumCode = function(cw, internalName, components) {
    // Enum components
    components.forEach(c => generateField(cw, internalName, c));

    // $VALUE array
    cw.visitField($Opcodes.ACC_PRIVATE | $Opcodes.ACC_STATIC | $Opcodes.ACC_FINAL | $Opcodes.ACC_SYNTHETIC, "$VALUES", "[L" + internalName + ";", null, null).visitEnd();

    // Constructor
    let ctor = cw.visitMethod($Opcodes.ACC_PRIVATE, "<init>", "(Ljava/lang/String;I)V", null, null);
    ctor.visitCode();
    ctor.visitVarInsn($Opcodes.ALOAD, 0);
    ctor.visitVarInsn($Opcodes.ALOAD, 1);
    ctor.visitVarInsn($Opcodes.ILOAD, 2);
    ctor.visitMethodInsn($Opcodes.INVOKESPECIAL, "java/lang/Enum", "<init>", "(Ljava/lang/String;I)V", false);
    ctor.visitInsn($Opcodes.RETURN);
    ctor.visitMaxs(0, 0);
    ctor.visitEnd();

    // <clinit>
    let clinit = cw.visitMethod($Opcodes.ACC_STATIC, "<clinit>", "()V", null, null);
    clinit.visitCode();

    components.forEach((c, index) => clinitField(clinit, internalName, c, index));

    // $VALUES array init
    clinit.visitLdcInsn($Integer["valueOf(int)"](components.length));
    clinit.visitTypeInsn($Opcodes.ANEWARRAY, internalName);
    components.forEach((c, index) => {
        clinit.visitInsn($Opcodes.DUP);
        clinit.visitLdcInsn($Integer["valueOf(int)"](index));
        clinit.visitFieldInsn($Opcodes.GETSTATIC, internalName, c, "L" + internalName + ";");
        clinit.visitInsn($Opcodes.AASTORE);
    });
    clinit.visitFieldInsn($Opcodes.PUTSTATIC, internalName, "$VALUES", "[L" + internalName + ";");

    clinit.visitInsn($Opcodes.RETURN);
    clinit.visitMaxs(0, 0);
    clinit.visitEnd();

    // values()
    let values = cw.visitMethod($Opcodes.ACC_PUBLIC | $Opcodes.ACC_STATIC, "values", "()[L" + internalName + ";", null, null);
    values.visitCode();
    values.visitFieldInsn($Opcodes.GETSTATIC, internalName, "$VALUES", "[L" + internalName + ";");
    values.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "[L" + internalName + ";", "clone", "()Ljava/lang/Object;", false);
    values.visitTypeInsn($Opcodes.CHECKCAST, "[L" + internalName + ";");
    values.visitInsn($Opcodes.ARETURN);
    values.visitMaxs(0, 0);
    values.visitEnd();

    // valueOf(String)
    let valueOf = cw.visitMethod($Opcodes.ACC_PUBLIC | $Opcodes.ACC_STATIC, "valueOf", "(Ljava/lang/String;)L" + internalName + ";", null, null);
    valueOf.visitCode();
    valueOf.visitLdcInsn($Type.getType("L" + internalName + ";"));
    valueOf.visitVarInsn($Opcodes.ALOAD, 0);
    valueOf.visitMethodInsn($Opcodes.INVOKESTATIC, "java/lang/Enum", "valueOf", "(Ljava/lang/Class;Ljava/lang/String;)Ljava/lang/Enum;", false);
    valueOf.visitTypeInsn($Opcodes.CHECKCAST, internalName);
    valueOf.visitInsn($Opcodes.ARETURN);
    valueOf.visitMaxs(0, 0);
    valueOf.visitEnd();
}

//#endregion

/** @type {typeof EnumJS} */
let exported = {
    EnumClassBuilder: function(className) {
        this.className = className;
    },
    createEnum(className) {
        return new exported.EnumClassBuilder(className);
    }
};

/** @type {EnumJS.EnumClassBuilder["build"]} */
exported.EnumClassBuilder.prototype.build = function() {
    /** @type {string[]} */
    let components;
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
        components = arguments[0];
    } else {
        components = [];
        for (let i = 0; i < arguments.length; i++) {
            let cur = arguments[i];
            if (typeof cur != "string") {
                throw new TypeError("Enum component names must be strings, but got " + cur);
            }
            components.push(cur);
        }
    }
    let className = this.className + ""; // Make sure this is a JS string, not a Java String,
                                         // as Java String's replace method is different from JS's.
    let internalName = className.replace(/\./g, "/");
    let cw = new $ClassWriter($ClassWriter.COMPUTE_MAXS | $ClassWriter.COMPUTE_FRAMES);
    cw.visit($Opcodes.V17, $Opcodes.ACC_PUBLIC | $Opcodes.ACC_FINAL | $Opcodes.ACC_ENUM | $Opcodes.ACC_SUPER, internalName, null, "java/lang/Enum", null);

    generateEnumCode(cw, internalName, components);

    let bytes = cw.toByteArray();
    let clazz = EnumJSClassLoader.defineClass(className, bytes);
    return new $NativeJavaClass(currentContext, topLevelScope, clazz);
}

return Object.freeze(exported);

})();

try {
    ContentPacks.putShared("pelemenguin.enumjs", EnumJS);
} catch (e) {
    // Ignored, means we are not in KubeLoader environment
}
