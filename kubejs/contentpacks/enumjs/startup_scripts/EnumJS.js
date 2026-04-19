// priority: 2147483647

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

/// <reference path="../probe/EnumJS.d.ts" />

/**
 * @author Pelemenguin
 * @version 1.1
 * @license MIT
 * @copyright Pelemenguin 2026
 */

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
const $Integer  = Java.loadClass("java.lang.Integer");
const $Function = Java.loadClass("java.util.function.Function");

// ASM
const $ClassWriter = loadSpecial("org.objectweb.asm.ClassWriter");
const $Opcodes     = loadSpecial("org.objectweb.asm.Opcodes");
const $Type        = loadSpecial("org.objectweb.asm.Type");

// Minecraft
const $StringRepresentable = Java.loadClass("net.minecraft.util.StringRepresentable");

// Rhino
const $DefiningClassLoader = Java.loadClass("dev.latvian.mods.rhino.DefiningClassLoader");
const $NativeJavaMethod    = Java.loadClass("dev.latvian.mods.rhino.NativeJavaMethod");

// KubeJS
/** @type {typeof Internal.ScriptManager} */
const $ScriptManager = loadSpecial("dev.latvian.mods.kubejs.script.ScriptManager");

const EnumJSClassLoader = new $DefiningClassLoader();

const $StringRepresentable_getSerizliedName_SRG = "m_7912_";

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

/**
 * @param {string[]} components 
 * @param {EnumJS.EnumClassBuilder["stringRepresentableCode"]} code 
 */
let generateStringRepresentableCode = function(cw, components, code) {
    let getSerizliedName = cw.visitMethod($Opcodes.ACC_PUBLIC, $StringRepresentable_getSerizliedName_SRG, "()Ljava/lang/String;", null, null);
    getSerizliedName.visitCode();
    code(getSerizliedName);
    getSerizliedName.visitMaxs(0, 0);
    getSerizliedName.visitEnd();
};

//#endregion

/** @type {typeof EnumJS} */
let exported = {
    EnumClassBuilder: function(className) {
        this.className = className;
        this.customGetSerializedName = false;
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
    let interfaces = [];
    if (this.stringRepresentableCode || this.customStringRepresentable) {
        interfaces.push("net/minecraft/util/StringRepresentable");
    }
    cw.visit($Opcodes.V17, $Opcodes.ACC_PUBLIC | $Opcodes.ACC_FINAL | $Opcodes.ACC_ENUM | $Opcodes.ACC_SUPER, internalName, null, "java/lang/Enum", interfaces);

    generateEnumCode(cw, internalName, components);

    if (this.customStringRepresentable) {
        // Set this field
        cw.visitField($Opcodes.ACC_PRIVATE | $Opcodes.ACC_STATIC, "$getSerializedNameFunction", "Ljava/util/function/Function;", null, null).visitEnd();
        let getSerizliedName = cw.visitMethod($Opcodes.ACC_PUBLIC, $StringRepresentable_getSerizliedName_SRG, "()Ljava/lang/String;", null, null);
        getSerizliedName.visitCode();
        getSerizliedName.visitFieldInsn($Opcodes.GETSTATIC, internalName, "$getSerializedNameFunction", "Ljava/util/function/Function;");
        getSerizliedName.visitVarInsn($Opcodes.ALOAD, 0);
        getSerizliedName.visitMethodInsn($Opcodes.INVOKEINTERFACE, "java/util/function/Function", "apply", "(Ljava/lang/Object;)Ljava/lang/Object;", true);
        getSerizliedName.visitTypeInsn($Opcodes.CHECKCAST, "java/lang/String");
        getSerizliedName.visitInsn($Opcodes.ARETURN);
        getSerizliedName.visitMaxs(0, 0);
        getSerizliedName.visitEnd();
    } else if (this.stringRepresentableCode) {
        generateStringRepresentableCode(cw, components, this.stringRepresentableCode);
    }

    let bytes = cw.toByteArray();
    let clazz = EnumJSClassLoader.defineClass(className, bytes);
    let result = new $NativeJavaClass(currentContext, topLevelScope, clazz);

    if (this.customStringRepresentable) {
        let field = clazz.getDeclaredField("$getSerializedNameFunction");
        field.setAccessible(true);
        let csr = this.customStringRepresentable;
        field.set(null, new JavaAdapter(
            $Function,
            {
                apply: csr
            }
        ));
    }

    return result;
};

/** @type {EnumJS.EnumClassBuilder["stringRepresentable"]} */
exported.EnumClassBuilder.prototype.stringRepresentable = function(getter) {
    if (getter) {
        this.customStringRepresentable = getter;
    } else {
        this.stringRepresentableCode = (mv) => {
            // return value.name;
            mv.visitVarInsn($Opcodes.ALOAD, 0);
            mv.visitMethodInsn($Opcodes.INVOKEVIRTUAL, this.className.replace(/\./g, "/"), "name", "()Ljava/lang/String;", false);
            mv.visitInsn($Opcodes.ARETURN);
        };
    }
    return this;
};

return Object.freeze(exported);

})();

try {
    ContentPacks.putShared("pelemenguin.enumjs", EnumJS);
} catch (e) {
    // Ignored, means we are not in KubeLoader environment
}
