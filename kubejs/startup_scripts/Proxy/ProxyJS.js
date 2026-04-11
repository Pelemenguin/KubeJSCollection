// priority: 2147483647

/// <reference path="ProxyJS.d.ts" />

const ProxyJS = (() => {

const $Integer = Java.loadClass("java.lang.Integer");
const $Object  = Java.loadClass("java.lang.Object");
const $String  = Java.loadClass("java.lang.String");

const $int = $Integer.TYPE;

const $BaseFunction     = Java.loadClass("dev.latvian.mods.rhino.BaseFunction");
const $Context          = Java.loadClass("dev.latvian.mods.rhino.Context");
const $Function         = Java.loadClass("dev.latvian.mods.rhino.Function");
const $NativeJavaObject = Java.loadClass("dev.latvian.mods.rhino.NativeJavaObject");
const $Scriptable       = Java.loadClass("dev.latvian.mods.rhino.Scriptable");
const $ScriptableObject = Java.loadClass("dev.latvian.mods.rhino.ScriptableObject");
const $Symbol           = Java.loadClass("dev.latvian.mods.rhino.Symbol");
const $SymbolScriptable = Java.loadClass("dev.latvian.mods.rhino.SymbolScriptable");

const ClassOfClass = Java.getClass().getClass();

// /** @type {Internal.Context} */
// let context;

// let loadSpecial;
// {
//     let $Class_forName = Java.getClass().getClass().getMethod("forName", Java.loadClass("java.lang.String"))
//     let ScriptManager = $Class_forName.invoke(null, "dev.latvian.mods.kubejs.script.ScriptManager");
//     context = ScriptManager.getMethod("getCurrentContext").invoke(null);
//     let $NativeJavaClass = Java.loadClass("dev.latvian.mods.rhino.NativeJavaClass");

//     /** @param {string} className @returns {typeof any} */
//     loadSpecial = (className) => {
//         return new $NativeJavaClass(context, $ScriptableObject.getTopLevelScope({}), $Class_forName.invoke(null, className));
//     }
// }

let $Scriptable_Get         =       $Scriptable.__javaObject__.getMethod("get", $Context, $String, $Scriptable);
let $Scriptable_Get_byIndex =       $Scriptable.__javaObject__.getMethod("get", $Context, $int,    $Scriptable);
let $SymbolScriptable_Get   = $SymbolScriptable.__javaObject__.getMethod("get", $Context, $Symbol, $Scriptable);

/**
 * @type {<T>(target: T, handler: ProxyHandler<T>): T}
 */
let proxy = function(target, handler) {
    let isFunction = typeof target === "function";

    /** @type {InstanceType<$ScriptableObject>} */
    let scriptableObjectMethods = {
        get: function(cx, name, start) {
            if (handler.get) {
                return handler.get(target, typeof name != "string" ? $String.valueOf(name) + "" : name, start);
            }
            if (typeof name === "symbol") {
                return $SymbolScriptable_Get.invoke(target, cx, name, start);
            } else if (typeof name === "number") {
                if (Number.isInteger(name)) {
                    return $Scriptable_Get_byIndex.invoke(target, cx, $Integer["valueOf(int)"](name), start);
                } else {
                    return $SymbolScriptable_Get.invoke(target, cx, name.toString(), start);
                }
            } else {
                return $Scriptable_Get.invoke(target, cx, $String.valueOf(name), start);
            }
        },
        getClassName: function() {
            return Array.isArray(target) ? "Array" : "Proxy";
        }
    };
    if (isFunction) {
        scriptableObjectMethods.call = function(_cx, _scope, thisObj, args) {
            return handler.apply ? handler.apply(target, thisObj, args) : target.apply(thisObj, args);
        };
        scriptableObjectMethods.construct = function(/** @type {InstanceType<$Context>} */ _cx, _scope, args) {
            let constructed;
            if (handler.construct) {
                constructed = handler.construct(target, args);
            } else {
                constructed = Object.create(target.prototype);
                let result = target.apply(constructed, args);
                if (result !== null && (typeof result === "object" || typeof result === "function")) {
                    constructed = result;
                }
            }
            // TODO: Consider wrapping
            return constructed;
        };
    }
    let proxy = new JavaAdapter(
        isFunction ? $BaseFunction : $ScriptableObject,
        scriptableObjectMethods
    );
    return proxy;
}

/** @type {typeof ProxyJS} */
let exported = {
    Proxy: proxy(function () {}, {
        construct: function(_target, argArray) {
            return proxy(argArray[0], argArray[1]);
        }
    })
};

return Object.freeze(exported);

})();

var Proxy = ProxyJS.Proxy;
