// priority: 2147483646

/// <reference path="Zinchronize.d.ts" />

const Zinchronize = (() => {

const $Tag = Java.loadClass("net.minecraft.nbt.Tag");

const $NativeObject = Java.loadClass("dev.latvian.mods.rhino.NativeObject");
const $Context      = Java.loadClass("dev.latvian.mods.rhino.Context");

/** @type {typeof Zinchronize} */
let exported = {
    syncBetween: function(obj, tag) {
        /** @type {InstanceType<$Context>} */
        let context = $NativeObject.__javaObject__.getField("localContext").get(obj);
        let proxy = new JavaAdapter(
            $NativeObject,
            {
                put: function(_cx, name, _start, value) {
                    obj[name] = value;
                    tag.putInt(name, value);
                }
            },
            context
        );
        return proxy;
    }
};

return Object.freeze(exported);

})();
