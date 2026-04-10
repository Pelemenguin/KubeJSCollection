// priority: 2147483647

/// <reference path="Zinchronize.d.ts" />

const Zinchronize = (() => {

const $Tag = Java.loadClass("net.minecraft.nbt.Tag");

/** @type {typeof Zinchronize} */
let exported = {
    syncBetween: function(obj, tag) {
        /** @type {typeof obj} */
        let proxy = {};

        for (let key in obj) {
            let k = key;
            Object.defineProperty(proxy, k, {
                get: function() {
                    let type = tag.getTagType(k);
                    let result;
                    switch (type) {
                        case $Tag.TAG_END:        result = null;                       break;
                        case $Tag.TAG_BYTE:       result = tag.getByte(k);             break;
                        case $Tag.TAG_SHORT:      result = tag.getShort(k);            break;
                        case $Tag.TAG_INT:        result = tag.getInt(k);              break;
                        case $Tag.TAG_LONG:       result = tag.getLong(k);             break;
                        case $Tag.TAG_FLOAT:      result = tag.getFloat(k);            break;
                        case $Tag.TAG_DOUBLE:     result = tag.getDouble(k);           break;
                        case $Tag.TAG_BYTE_ARRAY: result = tag.getByteArray(k);        break;
                        case $Tag.TAG_STRING:     result = tag.getString(k);           break;
                        case $Tag.TAG_LIST:       result = tag.getList(k).toArray([]); break; // TODO: Handle recursively in TAG_LIST
                        case $Tag.TAG_COMPOUND:   result = tag.getCompound(k);         break; //       and TAG_COMPOUND
                        case $Tag.TAG_INT_ARRAY:  result = tag.getIntArray(k);         break;
                        case $Tag.TAG_LONG_ARRAY: result = tag.getLongArray(k);        break;
                        default: result = undefined;
                    }
                    obj[k] = result;
                    return result;
                },
                set: function(newVal) {
                    let valType = typeof newVal;
                    switch (valType) {
                        case "string": {
                            tag.putString(k, newVal);
                            break;
                        }
                        case "number": {
                            let originalType = -1;
                            if (tag.contains(k)) {
                                originalType = tag.getTagType(k);
                            }
                            switch (originalType) {
                                case $Tag.TAG_BYTE:   tag.putByte(k, newVal);
                                case $Tag.TAG_SHORT:  tag.putShort(k, newVal);
                                case $Tag.TAG_INT:    tag.putInt(k, newVal);
                                case $Tag.TAG_LONG:   tag.putLong(k, newVal);
                                case $Tag.TAG_FLOAT:  tag.putFloat(k, newVal);
                                case $Tag.TAG_DOUBLE: tag.putDouble(k, newVal);
                                default: tag.putDouble(k, newVal); // numbers in JavaScript are all doubles
                                                                   // so if the original type is not a number, we will just put it as a double.
                            }
                            break;
                        }
                        case "bigint": {
                            // Is there really bigint in Rhino?
                            tag.putLong(k, newVal);
                            break;
                        }
                        case "boolean": {
                            tag.putBoolean(k, newVal);
                            break;
                        }
                        case "symbol": {
                            // Rhino is ES5 so there isn't symbols I think
                            break;
                        }
                        case "undefined": {
                            tag.remove(k);
                            break;
                        }
                        case "object": {
                            if (newVal === null) {
                                tag.remove(k);
                            }
                            // TODO: Allow recursive
                            break;
                        }
                        case "function": {
                            // ohno we do not support this
                            break;
                        }
                    }
                    obj[k] = newVal;
                },
                enumerable: true,
                configurable: false
            });
        }

        return proxy;
    }
};

return exported;

})();
