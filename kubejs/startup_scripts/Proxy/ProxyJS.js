// priority: 2147483647

/// <reference path="ProxyJS.d.ts" />

const ProxyJS = (() => {

const CONFIG = {

    PROXY_CLASS_NAME: "pelemenguin.proxyjs.NativeProxy"

};

CONFIG.internalProxyClassName = CONFIG.PROXY_CLASS_NAME.replace(/\./g, "/");

Object.freeze(CONFIG);

const $Integer       = Java.loadClass("java.lang.Integer");
const $Object        = Java.loadClass("java.lang.Object");
const $String        = Java.loadClass("java.lang.String");
const $StringBuilder = Java.loadClass("java.lang.StringBuilder");

const $BaseFunction        = Java.loadClass("dev.latvian.mods.rhino.BaseFunction");
const $Context             = Java.loadClass("dev.latvian.mods.rhino.Context");
const $DefiningClassLoader = Java.loadClass("dev.latvian.mods.rhino.DefiningClassLoader");
const $Callable            = Java.loadClass("dev.latvian.mods.rhino.Callable");
const $Function            = Java.loadClass("dev.latvian.mods.rhino.Function");
const $NativeJavaClass     = Java.loadClass("dev.latvian.mods.rhino.NativeJavaClass");
const $NativeJavaObject    = Java.loadClass("dev.latvian.mods.rhino.NativeJavaObject");
const $Scriptable          = Java.loadClass("dev.latvian.mods.rhino.Scriptable");
const $ScriptableObject    = Java.loadClass("dev.latvian.mods.rhino.ScriptableObject");
const $Symbol              = Java.loadClass("dev.latvian.mods.rhino.Symbol");
const $SymbolScriptable    = Java.loadClass("dev.latvian.mods.rhino.SymbolScriptable");

/** @type {Internal.Context} */
let context;

let loadSpecial;
{
    let $Class_forName = Java.getClass().getClass().getMethod("forName", Java.loadClass("java.lang.String"))
    let ScriptManager = $Class_forName.invoke(null, "dev.latvian.mods.kubejs.script.ScriptManager");
    context = ScriptManager.getMethod("getCurrentContext").invoke(null);
    let $NativeJavaClass = Java.loadClass("dev.latvian.mods.rhino.NativeJavaClass");

    /** @param {string} className @returns {typeof any} */
    loadSpecial = (className) => {
        return new $NativeJavaClass(context, $ScriptableObject.getTopLevelScope({}), $Class_forName.invoke(null, className));
    }
}

// ASM
const $ClassWriter = loadSpecial("org.objectweb.asm.ClassWriter");
const $Opcodes     = loadSpecial("org.objectweb.asm.Opcodes");

/** @type {typeof Internal.ScriptManager} */
const $ScriptManager = loadSpecial("dev.latvian.mods.kubejs.script.ScriptManager");

const ProxyJSClassLoader = new $DefiningClassLoader();

let ProxyClass;
//#endregion- Proxy Class
{

    let cw = new $ClassWriter($ClassWriter.COMPUTE_MAXS | $ClassWriter.COMPUTE_FRAMES);
    cw.visit(
        $Opcodes.V17,
        $Opcodes.ACC_PUBLIC | $Opcodes.ACC_SUPER,
        CONFIG.internalProxyClassName,
        null,
        $ScriptableObject.__javaObject__.getName().replace(".", "/"),
        [
            // // TODO: function
            // $Function.__javaObject__.getName().replace(".", "/"),
        ]
    );

    cw.visitField($Opcodes.ACC_PRIVATE, "target", "Ldev/latvian/mods/rhino/Scriptable;", null, null);
    cw.visitField($Opcodes.ACC_PRIVATE, "handler", "Ldev/latvian/mods/rhino/Scriptable;", null, null);

    // Constructor - (scope: Scriptable, prototype: Scriptable, target: Scriptable, handler: Scriptable)
    let ctor = cw.visitMethod($Opcodes.ACC_PUBLIC, "<init>", `(Ldev/latvian/mods/rhino/Scriptable;Ldev/latvian/mods/rhino/Scriptable;Ldev/latvian/mods/rhino/Scriptable;Ldev/latvian/mods/rhino/Scriptable;)V`, null, null);
    ctor.visitCode();
    // super(scope, prototype)
    ctor.visitVarInsn($Opcodes.ALOAD, 0);
    ctor.visitInsn($Opcodes.DUP);
    ctor.visitVarInsn($Opcodes.ALOAD, 1);
    ctor.visitVarInsn($Opcodes.ALOAD, 2);
    ctor.visitMethodInsn($Opcodes.INVOKESPECIAL, $ScriptableObject.__javaObject__.getName().replace(".", "/"), "<init>", "(Ldev/latvian/mods/rhino/Scriptable;Ldev/latvian/mods/rhino/Scriptable;)V", false);
    // this.target = target
    ctor.visitVarInsn($Opcodes.ALOAD, 0);
    ctor.visitVarInsn($Opcodes.ALOAD, 3);
    ctor.visitFieldInsn($Opcodes.PUTFIELD, CONFIG.internalProxyClassName, "target", "Ldev/latvian/mods/rhino/Scriptable;");
    // this.handler = handler
    ctor.visitVarInsn($Opcodes.ALOAD, 0);
    ctor.visitVarInsn($Opcodes.ALOAD, 4);
    ctor.visitFieldInsn($Opcodes.PUTFIELD, CONFIG.internalProxyClassName, "handler", "Ldev/latvian/mods/rhino/Scriptable;");
    ctor.visitInsn($Opcodes.RETURN);
    ctor.visitMaxs(0, 0);
    ctor.visitEnd();

    // Constructor - (target: Scriptable, handler: Scriptable)
    ctor = cw.visitMethod($Opcodes.ACC_PUBLIC, "<init>", "(Ldev/latvian/mods/rhino/Scriptable;Ldev/latvian/mods/rhino/Scriptable;)V", null, null);
    ctor.visitCode();
    // super()
    ctor.visitVarInsn($Opcodes.ALOAD, 0);
    ctor.visitInsn($Opcodes.DUP);
    ctor.visitMethodInsn($Opcodes.INVOKESPECIAL, $ScriptableObject.__javaObject__.getName().replace(".", "/"), "<init>", "()V", false);
    // this.target = target
    ctor.visitVarInsn($Opcodes.ALOAD, 0);
    ctor.visitVarInsn($Opcodes.ALOAD, 1);
    ctor.visitFieldInsn($Opcodes.PUTFIELD, CONFIG.internalProxyClassName, "target", "Ldev/latvian/mods/rhino/Scriptable;");
    // this.handler = handler
    ctor.visitVarInsn($Opcodes.ALOAD, 0);
    ctor.visitVarInsn($Opcodes.ALOAD, 2);
    ctor.visitFieldInsn($Opcodes.PUTFIELD, CONFIG.internalProxyClassName, "handler", `Ldev/latvian/mods/rhino/Scriptable;`);
    ctor.visitInsn($Opcodes.RETURN);
    ctor.visitMaxs(0, 0);
    ctor.visitEnd();

    // Constructor - (scope: Scriptable, prototype: Scriptable, target: Object, handler: Scriptable)
    ctor = cw.visitMethod($Opcodes.ACC_PUBLIC, "<init>", "(Ldev/latvian/mods/rhino/Scriptable;Ldev/latvian/mods/rhino/Scriptable;Ljava/lang/Object;Ldev/latvian/mods/rhino/Scriptable;)V", null, null);
    ctor.visitCode();
    // new $NativeJavaObject(scope, target, target.getClass(), $ScriptManager.getCurrentContext())
    ctor.visitTypeInsn($Opcodes.NEW, $NativeJavaObject.__javaObject__.getName().replace(".", "/"));
    ctor.visitInsn($Opcodes.DUP);
    ctor.visitVarInsn($Opcodes.ALOAD, 1);
    ctor.visitVarInsn($Opcodes.ALOAD, 3);
    ctor.visitInsn($Opcodes.DUP);
    ctor.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "java/lang/Object", "getClass", "()Ljava/lang/Class;", false);
    ctor.visitMethodInsn($Opcodes.INVOKESTATIC, $ScriptManager.__javaObject__.getName().replace(".", "/"), "getCurrentContext", "()Ldev/latvian/mods/rhino/Context;", false);
    ctor.visitMethodInsn($Opcodes.INVOKESPECIAL, $NativeJavaObject.__javaObject__.getName().replace(".", "/"), "<init>", "(Ldev/latvian/mods/rhino/Scriptable;Ljava/lang/Object;Ljava/lang/Class;Ldev/latvian/mods/rhino/Context;)V", false);
    ctor.visitVarInsn($Opcodes.ASTORE, 3);
    // this(scope, prototype, createdNativeJavaObject, handler)
    ctor.visitVarInsn($Opcodes.ALOAD, 0);
    ctor.visitInsn($Opcodes.DUP);
    ctor.visitVarInsn($Opcodes.ALOAD, 1);
    ctor.visitVarInsn($Opcodes.ALOAD, 2);
    ctor.visitVarInsn($Opcodes.ALOAD, 3);
    ctor.visitVarInsn($Opcodes.ALOAD, 4);
    ctor.visitMethodInsn($Opcodes.INVOKESPECIAL, CONFIG.internalProxyClassName, "<init>", "(Ldev/latvian/mods/rhino/Scriptable;Ldev/latvian/mods/rhino/Scriptable;Ldev/latvian/mods/rhino/Scriptable;Ldev/latvian/mods/rhino/Scriptable;)V", false);
    ctor.visitInsn($Opcodes.RETURN);
    ctor.visitMaxs(0, 0);
    ctor.visitEnd();

    /**
     * @type {Record<string, (string | Function)[][]}
     */
    let methods = {
        get: [
            [$Object, $Context, $String, $Scriptable],
            [$Object, $Context, $Symbol, $Scriptable],
            [$Object, $Context, "I", $Scriptable],
        ]
    };

    /** @type {Record<string, (mv: any, signature: (string | Function)[], pushScope: (mv: any) => void) => void>} */
    let trapBytes = {
        get: (mv, overloadParams, pushScope) => {
            // this.handler.get("get")
            mv.visitVarInsn($Opcodes.ALOAD, 0);
            mv.visitFieldInsn($Opcodes.GETFIELD, CONFIG.internalProxyClassName, "handler", "Ldev/latvian/mods/rhino/Scriptable;");
            mv.visitVarInsn($Opcodes.ALOAD, 1);
            mv.visitLdcInsn("get");
            mv.visitVarInsn($Opcodes.ALOAD, 3);
            mv.visitMethodInsn($Opcodes.INVOKEINTERFACE, "dev/latvian/mods/rhino/Scriptable", "get", "(Ldev/latvian/mods/rhino/Context;Ljava/lang/String;Ldev/latvian/mods/rhino/Scriptable;)Ljava/lang/Object;", true);
            // Cast to dev/latvian/mods/rhino/Callable
            mv.visitTypeInsn($Opcodes.CHECKCAST, "dev/latvian/mods/rhino/Callable");
            mv.visitVarInsn($Opcodes.ALOAD, 1);
            pushScope();
            mv.visitVarInsn($Opcodes.ALOAD, 0);
            // arg = new Object[] {this.target, propName(aload / iload 2), start(aload 3)}
            mv.visitInsn($Opcodes.ICONST_3);
            mv.visitTypeInsn($Opcodes.ANEWARRAY, "java/lang/Object");
            mv.visitInsn($Opcodes.DUP);
            mv.visitInsn($Opcodes.ICONST_0);
            mv.visitVarInsn($Opcodes.ALOAD, 0);
            mv.visitFieldInsn($Opcodes.GETFIELD, CONFIG.internalProxyClassName, "target", "Ldev/latvian/mods/rhino/Scriptable;");
            mv.visitInsn($Opcodes.AASTORE);
            mv.visitInsn($Opcodes.DUP);
            mv.visitInsn($Opcodes.ICONST_1);
            if (overloadParams[2] === "I") {
                mv.visitVarInsn($Opcodes.ILOAD, 2);
                mv.visitMethodInsn($Opcodes.INVOKESTATIC, "java/lang/String", "valueOf", "(I)Ljava/lang/String;", false);
            } else {
                mv.visitVarInsn($Opcodes.ALOAD, 2);
            }
            mv.visitInsn($Opcodes.AASTORE);
            mv.visitInsn($Opcodes.DUP);
            mv.visitInsn($Opcodes.ICONST_2);
            mv.visitVarInsn($Opcodes.ALOAD, 3);
            mv.visitInsn($Opcodes.AASTORE);
            // Call it - handler.get("get").call(context, scope, thisObj, args)
            mv.visitMethodInsn($Opcodes.INVOKEINTERFACE, "dev/latvian/mods/rhino/Callable", "call", "(Ldev/latvian/mods/rhino/Context;Ldev/latvian/mods/rhino/Scriptable;Ldev/latvian/mods/rhino/Scriptable;[Ljava/lang/Object;)Ljava/lang/Object;", true);
        }
    }

    for (let methodName in methods) {
        for (let overloadParams of methods[methodName]) {
            let signatureBuilder = new $StringBuilder("(");
            for (let i = 1; i < overloadParams.length; i++) {
                let param = overloadParams[i];
                if (typeof param === "string") {
                    signatureBuilder.append(param);
                } else {
                    signatureBuilder.append("L").append(param.__javaObject__.getName().replace(".", "/")).append(";");
                }
            }
            signatureBuilder.append(")");
            if (typeof overloadParams[0] !== "string") {
                signatureBuilder.append("L").append(overloadParams[0].__javaObject__.getName().replace(".", "/")).append(";");
            } else {
                signatureBuilder.append(overloadParams[0]);
            }

            let signature = signatureBuilder.toString();

            let mv = cw.visitMethod($Opcodes.ACC_PUBLIC, methodName, signature, null, null);

            // For test, let's simply call `target`'s corresponding method
            mv.visitCode();
            // return target.<methodName>(...args);
            mv.visitVarInsn($Opcodes.ALOAD, 0);
            mv.visitFieldInsn($Opcodes.GETFIELD, CONFIG.internalProxyClassName, "target", `Ldev/latvian/mods/rhino/Scriptable;`);
            mv.visitVarInsn($Opcodes.ALOAD, 0);
            for (let i = 1; i < overloadParams.length; i++) {
                switch (overloadParams[i]) {
                    case "I": mv.visitVarInsn($Opcodes.ILOAD, i); break;
                    default:  mv.visitVarInsn($Opcodes.ALOAD, i);
                }
            }
            trapBytes[methodName](mv, overloadParams, () => {
                // $ScriptableObject.getTopLevelScope(this.handler)
                mv.visitVarInsn($Opcodes.ALOAD, 0);
                mv.visitFieldInsn($Opcodes.GETFIELD, CONFIG.internalProxyClassName, "handler", `Ldev/latvian/mods/rhino/Scriptable;`);
                mv.visitMethodInsn($Opcodes.INVOKESTATIC, $ScriptableObject.__javaObject__.getName().replace(".", "/"), "getTopLevelScope", `(Ldev/latvian/mods/rhino/Scriptable;)Ldev/latvian/mods/rhino/Scriptable;`, false);
            });
            if (overloadParams[0] !== "V") {
                mv.visitInsn($Opcodes.ARETURN);
            } else {
                mv.visitInsn($Opcodes.RETURN);
            }
            mv.visitMaxs(0, 0);
            mv.visitEnd();
        }
    }

    cw.visitEnd();
    let classBytes = cw.toByteArray();
    let resultClass = ProxyJSClassLoader.defineClass(CONFIG.PROXY_CLASS_NAME, classBytes);
    ProxyClass = new $NativeJavaClass(context, $ScriptableObject.getTopLevelScope({}), resultClass);

}
//#endregion

/** @type {<T extends {}>(target: T, handler: ProxyHandler<T>): T} */
let proxy = (target, handler) => {
    return new ProxyClass(
        $ScriptableObject.getTopLevelScope(handler),
        target.prototype ? target.prototype : null,
        target,
        handler
    );
};

/** @type {typeof ProxyJS} */
let exported = {
    CONFIG: CONFIG,
    proxy: proxy,
    Proxy: ProxyClass
};

return Object.freeze(exported);

})();

var Proxy = ProxyJS.Proxy;
