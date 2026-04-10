// priority: 2147483647

/// <reference path="ProxyJS.d.ts" />

const ProxyJS = (() => {

/** @type {typeof Object} */
const $Object = Java.loadClass("java.lang.Object");

const $BaseFunction     = Java.loadClass("dev.latvian.mods.rhino.BaseFunction");
const $Context          = Java.loadClass("dev.latvian.mods.rhino.Context");
const $Function         = Java.loadClass("dev.latvian.mods.rhino.Function");
const $Scriptable       = Java.loadClass("dev.latvian.mods.rhino.Scriptable");
const $ScriptableObject = Java.loadClass("dev.latvian.mods.rhino.ScriptableObject");

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

/**
 * @type {<T>(target: T, handler: ProxyHandler<T>): T}
 */
let proxy = function(target, handler) {
    let isFunction = typeof target === "function";

    /** @type {InstanceType<$ScriptableObject>} */
    let scriptableObjectMethods = {
        get: function(_cx, name, start) {
            return handler.get ? handler.get(target, name, start) : target[name];
        },
        getClassName: function() {
            return Array.isArray(target) ? "Array" : "Proxy";
        }
    }
    if (isFunction) {
        scriptableObjectMethods.call = function(_cx, _scope, thisObj, args) {
            return handler.apply ? handler.apply(target, thisObj, args) : target.apply(thisObj, args);
        };
        scriptableObjectMethods.construct = function(cx, scope, args) {
            return handler.construct ? handler.construct(target, args) : $Function.__javaObject__.getMethod("construct",
                $Context, $Scriptable, $Object.__javaObject__.arrayType()).invoke(target, cx, scope, args);
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
        construct: function(target, argArray) {
            return proxy(argArray[0], argArray[1]);
        }
    })
};

return Object.freeze(exported);

})();

var Proxy = ProxyJS.Proxy;
