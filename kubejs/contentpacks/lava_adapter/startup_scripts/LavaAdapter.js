// priority: 2147483647

/// <reference path="../probe/LavaAdapter.d.ts" />

const LavaAdapter = (() => {

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
/** @type {typeof Internal.Class} */
const $Class         =    loadSpecial("java.lang.Class");
const $Integer       = Java.loadClass("java.lang.Integer");
const $Object        = Java.loadClass("java.lang.Object");
const $HashSet       = Java.loadClass("java.util.HashSet");
const $HashMap       = Java.loadClass("java.util.HashMap");
const $Set           = Java.loadClass("java.util.Set");
const $AtomicInteger = Java.loadClass("java.util.concurrent.atomic.AtomicInteger");

// ASM
const $ClassWriter = loadSpecial("org.objectweb.asm.ClassWriter");
const $Opcodes     = loadSpecial("org.objectweb.asm.Opcodes");
const $Type        = loadSpecial("org.objectweb.asm.Type");

// Rhino
const $BaseFunction        = Java.loadClass("dev.latvian.mods.rhino.BaseFunction");
const $DefiningClassLoader = Java.loadClass("dev.latvian.mods.rhino.DefiningClassLoader");
const $NativeJavaMethod    = Java.loadClass("dev.latvian.mods.rhino.NativeJavaMethod");
const $NativeJavaObject    = Java.loadClass("dev.latvian.mods.rhino.NativeJavaObject");

const LavaAdapterClassLoader = new $DefiningClassLoader();
const AdapterIdCounter = new $AtomicInteger();

/** @type {Internal.Class<Internal.NativeJavaMethod>} */
const $NativeJavaMethod$class = $NativeJavaMethod.__javaObject__;
/** @type {Internal.Class<Internal.BaseFunction>} */
const $BaseFunction$class = $BaseFunction.__javaObject__;

const $NativeJavaMethod$getFunctionName = $NativeJavaMethod$class.getMethod("getFunctionName");

//#endregion

//#region - Helper functions

/**
 * @param {any} classObject 
 */
let checkAndGetJavaClass = (classObject) => {
    if (classObject instanceof $Class) {
        return new $NativeJavaClass(currentContext, topLevelScope, classObject);
    } else if (classObject.__javaObject__ instanceof $Class) {
        return classObject;
    } else {
        throw new TypeError("Expected a Java Class object, got " + classObject);
    }
};

let getInternalName = (classObject) => {
    if (classObject instanceof $Class) return (classObject.getName() + "").replace(/\./g, "/");
    return (classObject.__javaObject__.getName() + "").replace(/\./g, "/");
}

/**
 * 
 * @param {Internal.Class<?>} clazz 
 * @param {Internal.Set<string>} implemented 
 * @param {Internal.Map<string, Internal.Map<string, Internal.Method>} methodCache 
 * methodName to descriptors
 * @param {Internal.Set<Internal.Class<?>>} metClasses
 */
let getAllMethodOverloads = (clazz, implemented, methodCache, metClasses) => {
    if (metClasses.contains(clazz)) return;
    metClasses.add(clazz);
    while (clazz != null) {
        clazz.getDeclaredMethods().forEach(/** @param {Internal.Method} m */ m => {
            let methodName = m.getName();
            if (!implemented.contains(methodName)) return;
            if (!methodCache.containsKey(methodName)) {
                methodCache.put(methodName, new $HashMap());
            }
            methodCache.get(methodName).putIfAbsent($Type.getMethodDescriptor(m), m);
        });
        clazz.getInterfaces().forEach(i => getAllMethodOverloads(i, implemented, methodCache, metClasses));
        clazz = clazz.getSuperclass();
    }
};

//#endregion

//#region - AdapterBuilder

let AdapterBuilder = function(superClass) {
    this.superClass
    if (superClass) {
        this.superClass = checkAndGetJavaClass(superClass);
    } else {
        this.superClass = $Object;
    }

    this.superInterfaces = [];
    // Java classes has `null` prototype
    // We create a `null` object for searching methods
    this.dummySuperClassPrototype = new $NativeJavaObject(topLevelScope, null, this.superClass, currentContext);
    this.dummySuperInterfacesPrototype = [];
    /** @type {Internal.HashMap<function, function>} */
    this.methodMap = new $HashMap();
};

/** @type {LavaAdapter.AdapterBuilder["implementing"]} */
AdapterBuilder.prototype.implementing = function() {
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
        for (let superInterface of arguments[0]) {
            let got = checkAndGetJavaClass(superInterface);
            this.superInterfaces.push(got);
            this.dummySuperInterfacesPrototype.push(new $NativeJavaObject(topLevelScope, null, got, currentContext));
        }
    } else {
        for (let superInterface of arguments) {
            let got = checkAndGetJavaClass(superInterface);
            this.superInterfaces.push(got);
            this.dummySuperInterfacesPrototype.push(new $NativeJavaObject(topLevelScope, null, got, currentContext));
        }
    }
    return this;
};

/** @type {LavaAdapter.AdapterBuilder["overriding"]} */
AdapterBuilder.prototype.overriding = function(method, implementation) {
    /** @type {undefined | Internal.Method} */
    let foundMethod = undefined;
    if (typeof method === "string") {
        try {
            foundMethod = this.dummySuperClassPrototype[method];
        } catch (e) {
            // So why does Rhino decide to throw an error when method not found
            // instead of returning undefined?
        }
        if (typeof foundMethod !== "function") {
            for (let i of this.dummySuperInterfacesPrototype) {
                try {
                    foundMethod = i[method];
                } catch (e) {}
                if (typeof foundMethod === "function") {
                    break;
                }
            }
        }
        if (typeof foundMethod !== "function") {
            throw new Error("Method \"" + method + "\" not found in superclass or interfaces");
        }
    } else if (typeof method === "function") {
        foundMethod = method;
    }
    if (!$NativeJavaMethod$class.isInstance(foundMethod)) {
        throw new TypeError("Expected a Java method, got " + method);
    }
    if (!$BaseFunction$class.isInstance(implementation)) {
        throw new TypeError("Expected a JavaScript function as implementation, got " + implementation);
    }
    this.methodMap.put(foundMethod, implementation);
    return this;
};

/**
 * @param {string} methodName 
 * @param {string} className 
 * @param {string} methodDescriptor 
 * @param {Internal.Method} method 
 */
let generateMethod = (cw, className, methodName, methodDescriptor, method) => {

    let mv = cw.visitMethod($Opcodes.ACC_PUBLIC, methodName, methodDescriptor, null, null);
    mv.visitCode();

    let parameterCount = method.getParameterCount();
    /** @type {Internal.Class<?>[]} */
    let parameters = method.getParameterTypes();
    /** @type {Internal.Class<?>} */
    let returnType = method.getReturnType();

    /** @type {number} */
    let variableIndicies = [];
    let curIndex = 1;

    for (let c of parameters) {
        if (c.getName() === "long" || c.getName() === "double") {
            variableIndicies.push(curIndex);
            curIndex += 2;
        } else {
            variableIndicies.push(curIndex);
            curIndex ++;
        }
    }

    let implementationSlot = curIndex ++;
    let contextSlot = curIndex ++;
    let wrapFactorySlot = curIndex ++;
    let parentScopeSlot = curIndex ++;
    let argsSlot = curIndex ++;

    // public <returnType> <methodName>(... <actualParameters> ...) {
    //     BaseFunction implementation = $IMPLEMENTATION.get(<methodName>);
    //     Context context = ScriptManager.getCurrentContext();
    //     Scriptable parentScope = implementation.getParentScope();
    //     Object[] args = new Object[<length of actualParameters>];
    //     WrapFactory factory = context.getWrapFactory();
    //     args[0] = factory.wrap(context, parentScope, <actualParameters[0]>, null);
    //             // NOTE: Wrap only reference types
    //             // For primitive types, don't wrap
    //     args[1] = ...;
    //     ...;
    //     # if <returnType> is void
    //     implementation.call(context, scope, $SELF, args);
    //     # if <returnType> is not void
    //     // NOTE: Use corresponding `return` instruction and handle wrapped to primitive
    //     Object result = implementation.call(context, scope, $SELF, args);
    //     return result; // NOTE: Wrap result
    // }

    mv.visitFieldInsn($Opcodes.GETSTATIC, className, "$IMPLEMENTATIONS", "Ldev/latvian/mods/rhino/NativeObject;");
    mv.visitLdcInsn(methodName);
    mv.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "dev/latvian/mods/rhino/NativeObject", "get", "(Ljava/lang/Object;)Ljava/lang/Object;", false);
    mv.visitTypeInsn($Opcodes.CHECKCAST, "dev/latvian/mods/rhino/BaseFunction");
    mv.visitInsn($Opcodes.DUP);
    mv.visitVarInsn($Opcodes.ASTORE, implementationSlot);
    // STACK: { implementation } // LOCALS: { ...<actualParameters>..., implementation }

    mv.visitFieldInsn($Opcodes.GETSTATIC, className, "$CONTEXT", "Ldev/latvian/mods/rhino/Context;");
    mv.visitInsn($Opcodes.DUP);
    mv.visitVarInsn($Opcodes.ASTORE, contextSlot);
    // STACK: { implementation, context } // LOCALS: { ...<actualParameters>..., implementation, context }

    mv.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "dev/latvian/mods/rhino/Context", "getWrapFactory", "()Ldev/latvian/mods/rhino/WrapFactory;", false);
    mv.visitVarInsn($Opcodes.ASTORE, wrapFactorySlot);
    // STACK: { implementation } // LOCALS: { ...<actualParameters>..., implementation, context, wrapFactory }

    mv.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "dev/latvian/mods/rhino/ScriptableObject", "getParentScope", "()Ldev/latvian/mods/rhino/Scriptable;", false);
    mv.visitVarInsn($Opcodes.ASTORE, parentScopeSlot);
    // STACK: { } // LOCALS: { ...<actualParameters>..., implementation, context, wrapFactory, parentScope }

    mv.visitIntInsn($Opcodes.BIPUSH, parameterCount);
    mv.visitTypeInsn($Opcodes.ANEWARRAY, "java/lang/Object");
    // STACK: { args } // LOCALS: { ...<actualParameters>..., implementation, context, wrapFactory, parentScope }

    for (let pIndex = 0; pIndex < parameterCount; pIndex++) {
        let varIndex = variableIndicies[pIndex];
        let type = parameters[pIndex];

        mv.visitInsn($Opcodes.DUP);
        mv.visitLdcInsn($Integer["valueOf(int)"](pIndex));
        // STACK: { args, args, index }

        if (type.isPrimitive()) {
            switch (type.getName()) {
                case "boolean":
                    mv.visitVarInsn($Opcodes.ILOAD, varIndex);
                    mv.visitMethodInsn($Opcodes.INVOKESTATIC, "java/lang/Boolean", "valueOf", "(Z)Ljava/lang/Boolean;", false);
                    break;
                case "char":
                    mv.visitVarInsn($Opcodes.ILOAD, varIndex);
                    mv.visitMethodInsn($Opcodes.INVOKESTATIC, "java/lang/String", "valueOf", "(C)Ljava/lang/String;", false);
                    break;
                // All to double
                case "int": case "short": case "byte":
                    mv.visitVarInsn($Opcodes.ILOAD, varIndex);
                    mv.visitInsn($Opcodes.I2D);
                    mv.visitMethodInsn($Opcodes.INVOKESTATIC, "java/lang/Double", "valueOf", "(D)Ljava/lang/Double;", false);
                    break;
                case "float":
                    mv.visitVarInsn($Opcodes.ILOAD, varIndex);
                    mv.visitInsn($Opcodes.F2D);
                    mv.visitMethodInsn($Opcodes.INVOKESTATIC, "java/lang/Double", "valueOf", "(D)Ljava/lang/Double;", false);
                    break;
                case "long":
                    mv.visitVarInsn($Opcodes.LLOAD, varIndex);
                    mv.visitInsn($Opcodes.L2D);
                    mv.visitMethodInsn($Opcodes.INVOKESTATIC, "java/lang/Double", "valueOf", "(D)Ljava/lang/Double;", false);
                    break;
                case "double":
                    mv.visitVarInsn($Opcodes.DLOAD, varIndex);
                    mv.visitMethodInsn($Opcodes.INVOKESTATIC, "java/lang/Double", "valueOf", "(D)Ljava/lang/Double;", false);
                    break;
                default: throw new Error("Unsupported primitive type: " + type.getName());
            }
            mv.visitInsn($Opcodes.AASTORE);
        } else {
            mv.visitVarInsn($Opcodes.ALOAD, wrapFactorySlot);
            mv.visitVarInsn($Opcodes.ALOAD, contextSlot);
            mv.visitVarInsn($Opcodes.ALOAD, parentScopeSlot);
            // STACK: { args, args, index, wrapFactory, context, parentScope }

            mv.visitVarInsn($Opcodes.ALOAD, varIndex);
            mv.visitInsn($Opcodes.ACONST_NULL);
            // STACK: { args, args, index, wrapFactory, context, parentScope, <param>, null }

            mv.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "dev/latvian/mods/rhino/WrapFactory", "wrap",
                "(Ldev/latvian/mods/rhino/Context;Ldev/latvian/mods/rhino/Scriptable;Ljava/lang/Object;Ljava/lang/Class;)Ljava/lang/Object;", false);
            // STACK: { args, args, index, <wrappedParam> }

            mv.visitInsn($Opcodes.AASTORE);
            // STACK: { args }
        }

    }
    // STACK: { args } // LOCALS: { ...<actualParameters>..., implementation, context, wrapFactory, parentScope }

    mv.visitVarInsn($Opcodes.ASTORE, argsSlot);
    // STACK: { } // LOCALS: { ...<actualParameters>..., implementation, context, wrapFactory, parentScope, args }

    mv.visitVarInsn($Opcodes.ALOAD, implementationSlot);
    mv.visitVarInsn($Opcodes.ALOAD, contextSlot);
    mv.visitVarInsn($Opcodes.ALOAD, parentScopeSlot);
    mv.visitVarInsn($Opcodes.ALOAD, 0);
    mv.visitFieldInsn($Opcodes.GETFIELD, className, "$SELF", "Ldev/latvian/mods/rhino/NativeJavaObject;");
    mv.visitVarInsn($Opcodes.ALOAD, argsSlot);
    mv.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "dev/latvian/mods/rhino/BaseFunction", "call",
        "(Ldev/latvian/mods/rhino/Context;Ldev/latvian/mods/rhino/Scriptable;Ldev/latvian/mods/rhino/Scriptable;[Ljava/lang/Object;)Ljava/lang/Object;", false);
    // STACK: { result } // LOCALS: { ...<actualParameters>..., implementation, context, wrapFactory, parentScope, args }

    if (returnType.isPrimitive()) {
        switch (returnType.getName()) {
            case "void":
                // return;
                mv.visitInsn($Opcodes.POP);
                mv.visitInsn($Opcodes.RETURN);
                break;
            case "boolean":
                // return context.toBoolean(result);
                mv.visitVarInsn($Opcodes.ALOAD, contextSlot);
                mv.visitInsn($Opcodes.SWAP);
                mv.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "dev/latvian/mods/rhino/Context", "toBoolean", "(Ljava/lang/Object;)Z", false);
                mv.visitInsn($Opcodes.IRETURN);
                break;
            case "char":
                // return context.toString(result).charAt(0)
                mv.visitVarInsn($Opcodes.ALOAD, contextSlot);
                mv.visitInsn($Opcodes.SWAP);
                mv.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "dev/latvian/mods/rhino/Context", "toString", "(Ljava/lang/Object;)Ljava/lang/String;", false);
                mv.visitInsn($Opcodes.ICONST_0);
                mv.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "java/lang/String", "charAt", "(I)C", false);
                mv.visitInsn($Opcodes.IRETURN);
                break;
            default:
                // return context.toNumber(result);
                // First convert to double
                // Then visit corresponding D2X and xreturn
                mv.visitVarInsn($Opcodes.ALOAD, contextSlot);
                mv.visitInsn($Opcodes.SWAP);
                mv.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "dev/latvian/mods/rhino/Context", "toNumber", "(Ljava/lang/Object;)D", false);
                switch (returnType.getName()) {
                    case "int": case "short": case "byte":
                        mv.visitInsn($Opcodes.D2I);
                        mv.visitInsn($Opcodes.IRETURN);
                        break;
                    case "float":
                        mv.visitInsn($Opcodes.D2F);
                        mv.visitInsn($Opcodes.FRETURN);
                        break;
                    case "long":
                        mv.visitInsn($Opcodes.D2L);
                        mv.visitInsn($Opcodes.LRETURN);
                        break;
                    case "double":
                        mv.visitInsn($Opcodes.DRETURN);
                        break;
                    default: throw new Error("Unsupported primitive return type: " + returnType.getName());
                }
        }
    } else {
        // return Context.jsToJava(context, result, <class of returnType>);
        mv.visitVarInsn($Opcodes.ALOAD, contextSlot);
        mv.visitInsn($Opcodes.SWAP);
        mv.visitLdcInsn($Type["getType(java.lang.Class)"](returnType));
        mv.visitMethodInsn($Opcodes.INVOKESTATIC, "dev/latvian/mods/rhino/Context", "jsToJava", "(Ldev/latvian/mods/rhino/Context;Ljava/lang/Object;Ljava/lang/Class;)Ljava/lang/Object;", false);
        mv.visitTypeInsn($Opcodes.CHECKCAST, getInternalName(returnType));
        mv.visitInsn($Opcodes.ARETURN);
    }
    // STACK: { }

    mv.visitMaxs(0, 0);
    mv.visitEnd();

};

/**
 * @param {number} varSlot 
 * @param {Internal.Class<?>} type 
 */
let loadArg = (mv, varSlot, type) => {
    if (type.isPrimitive()) {
        switch (type.getName()) {
            case "int": case "char": case "short": case "byte": case "boolean":
                mv.visitVarInsn($Opcodes.ILOAD, varSlot);
                break;
            case "float":
                mv.visitVarInsn($Opcodes.FLOAD, varSlot);
                break;
            case "double":
                mv.visitVarInsn($Opcodes.DLOAD, varSlot);
                break;
            case "long":
                mv.visitVarInsn($Opcodes.LLOAD, varSlot);
                break;
        }
    } else {
        mv.visitVarInsn($Opcodes.ALOAD, varSlot);
    }
};

AdapterBuilder.prototype.asClass = function() {
    let className = "Adapter_" + AdapterIdCounter.getAndIncrement();
    let cw = new $ClassWriter($ClassWriter.COMPUTE_FRAMES | $ClassWriter.COMPUTE_MAXS);
    cw.visit($Opcodes.V17, $Opcodes.ACC_PUBLIC, className, null, getInternalName(this.superClass), this.superInterfaces.map(getInternalName));

    let implementationMap = {};
    this.methodMap.forEach((java, js) => {
        implementationMap[$NativeJavaMethod$getFunctionName.invoke(java)] = js;
    });
    let implemented = $Set.copyOf(Object.keys(implementationMap));

    /** @type {Internal.Map<string, Internal.Map<string, Internal.Method>} */
    let methodCache = new $HashMap();
    let metClasses = new $HashSet();
    getAllMethodOverloads(this.superClass.__javaObject__, implemented, methodCache, metClasses);
    this.superInterfaces.forEach(i => getAllMethodOverloads(i.__javaObject__, implemented, methodCache, metClasses));

    // public static synthetic NativeObject $IMPLEMENTATIONS;
    // public static synthetic Context $CONTEXT;
    // private synthetic NativeJavaObject $SELF;
    cw.visitField($Opcodes.ACC_PUBLIC | $Opcodes.ACC_STATIC | $Opcodes.ACC_SYNTHETIC, "$IMPLEMENTATIONS", "Ldev/latvian/mods/rhino/NativeObject;", null, null).visitEnd();
    cw.visitField($Opcodes.ACC_PUBLIC | $Opcodes.ACC_STATIC | $Opcodes.ACC_SYNTHETIC, "$CONTEXT", "Ldev/latvian/mods/rhino/Context;", null, null).visitEnd();
    cw.visitField($Opcodes.ACC_PRIVATE | $Opcodes.ACC_SYNTHETIC, "$SELF", "Ldev/latvian/mods/rhino/NativeJavaObject;", null, null).visitEnd();

    this.superClass.__javaObject__.getDeclaredConstructors().forEach(/** @param {Internal.Constructor<any>} c */ c => {
        /** @type {Internal.Class<?>[]} */
        let parameters = c.getParameterTypes();
        let descriptor = $Type.getConstructorDescriptor(c);
        let slot = 1;

        let mv = cw.visitMethod($Opcodes.ACC_PUBLIC, "<init>", descriptor, null, null);
        mv.visitCode();

        mv.visitVarInsn($Opcodes.ALOAD, 0);
        mv.visitInsn($Opcodes.DUP);
        for (let p of parameters) {
            loadArg(mv, slot, p);
            slot += (p.getName() === "long" || p.getName() === "double") ? 2 : 1;
        }
        mv.visitMethodInsn($Opcodes.INVOKESPECIAL, getInternalName(this.superClass), "<init>", descriptor, false);
        // this.$SELF = new NativeJavaObject($IMPLEMENTATION.getParentScope(), this, null, $CONTEXT);
        mv.visitTypeInsn($Opcodes.NEW, "dev/latvian/mods/rhino/NativeJavaObject");
        mv.visitInsn($Opcodes.DUP);
        mv.visitFieldInsn($Opcodes.GETSTATIC, className, "$IMPLEMENTATIONS", "Ldev/latvian/mods/rhino/NativeObject;");
        mv.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "dev/latvian/mods/rhino/NativeObject", "getParentScope", "()Ldev/latvian/mods/rhino/Scriptable;", false);
        mv.visitVarInsn($Opcodes.ALOAD, 0);
        mv.visitInsn($Opcodes.ACONST_NULL);
        mv.visitFieldInsn($Opcodes.GETSTATIC, className, "$CONTEXT", "Ldev/latvian/mods/rhino/Context;");
        mv.visitMethodInsn($Opcodes.INVOKESPECIAL, "dev/latvian/mods/rhino/NativeJavaObject", "<init>", "(Ldev/latvian/mods/rhino/Scriptable;Ljava/lang/Object;Ljava/lang/Class;Ldev/latvian/mods/rhino/Context;)V", false);
        mv.visitFieldInsn($Opcodes.PUTFIELD, className, "$SELF", "Ldev/latvian/mods/rhino/NativeJavaObject;");
        mv.visitInsn($Opcodes.RETURN);
        mv.visitMaxs(0, 0);
        mv.visitEnd();
    });

    methodCache.forEach((methodName, descriptorToMethodMap) => {
        descriptorToMethodMap.forEach((descriptor, method) => {
            generateMethod(cw, className, methodName, descriptor, method);
        });
    })

    cw.visitEnd();

    let bytes = cw.toByteArray();
    let clazz = LavaAdapterClassLoader.defineClass(className, bytes);
    let result = new $NativeJavaClass(currentContext, topLevelScope, clazz);

    result.$IMPLEMENTATIONS = implementationMap;
    result.$CONTEXT = currentContext;

    return result;
};

//#endregion

/** @type {typeof LavaAdapter} */
let exported = {
    extending(superClass) {
        return new AdapterBuilder(superClass);
    }
};

return exported;

})();

try {
    ContentPacks.putShared("pelemenguin.lava_adapter", LavaAdapter);
} catch (e) {}
