// priority: 2147483647

/// <reference path="../probe/Zinchronize.d.ts" />

const Zinchronize = (() => {

/** @type {typeof Zinchronize} */
let exported = {
    syncToNBT(tag, data) {
        if (!tag) tag = NBT.compoundTag();
        for (let key in data) {
            let k = key;
            let getter = function() {
                let type = tag.getTagType(k);
                switch (type) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        return tag.getDouble(k);
                    default:
                        throw new Error("Unknown tag type: " + type);
                }
            };
            let setter = function(value) {
                if (typeof value === "number") {
                    let type = tag.contains(k) ? tag.getTagType(k) : -1;
                    switch (type) {
                        case 1:  tag.putByte(k, value);  break;
                        case 2:  tag.putShort(k, value); break;
                        case 3:  tag.putInt(k, value);   break;
                        case 4:  tag.putLong(k, value);  break;
                        case 5:  tag.putFloat(k, value); break;
                        default: tag.putDouble(k, value);
                    }
                } else {
                    throw new Error("Unknown type to put into NBT: " + value);
                }
            };
            Object.defineProperty(data, k, {
                get: getter,
                set: setter,
                configurable: true
            });
        }
        return data;
    }
};

return Object.freeze(exported);

})();

ContentPacks.putShared("pelemenguin.zinchronize", Zinchronize);
