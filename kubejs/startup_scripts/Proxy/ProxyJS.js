// priority: 2147483647

/// <reference path="ProxyJS.d.ts" />

const ProxyJS = (() => {

const $NativeObject = Java.loadClass("dev.latvian.mods.rhino.NativeObject");
const $Context      = Java.loadClass("dev.latvian.mods.rhino.Context");

/** @type {typeof ProxyJS} */
let exported = {
    proxy: function(target, handler) {
        /** @type {InstanceType<$Context>} */
        let context = $NativeObject.__javaObject__.getField("localContext").get(target);
        let proxy = new JavaAdapter(
            $NativeObject,
            {
                get: function(_cx, name, start) {
                    return handler.get ? handler.get(target, name, start) : target[name];
                }
            },
            context
        );
        return proxy;
    }
};

return Object.freeze(exported);

})();
