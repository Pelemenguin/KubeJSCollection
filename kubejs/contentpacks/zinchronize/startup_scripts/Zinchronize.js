// priority: 2147483647

/// <reference path="../probe/Zinchronize.d.ts" />

const Zinchronize = (() => {

/** @type {Zinchronize.Zinc.TAG} */
const TAG_SYMBOL = Symbol.for("zincTag");
/** @type {Zinchronize.Zinc.DATA} */
const DATA_SYMBOL = Symbol.for("zincData");

/** @type {typeof Zinchronize.Zinc} */
let Zinc = function(/** @type {Internal.CompoundTag} */ tag, data) {
    if (!tag) tag = NBT.compoundTag();
    this[TAG_SYMBOL] = tag;
    this[DATA_SYMBOL] = data;

    this.data = {};
    for (let key in data) {
        let k = key;
        this.defineProperty(k);
    }
}

/** @type {Zinchronize.Zinc["defineProperty"]} */
Zinc.prototype.defineProperty = function(k) {
    let tag = this[TAG_SYMBOL];
    let data = this.data;
    let initVal = this[DATA_SYMBOL][k];
    let getter = function() {
        if (!tag.contains(k)) return undefined;
        let type = tag.getTagType(k);
        switch (type) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                return tag.getDouble(k);
            case 8:
                return tag.getString(k);
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
        } else if (typeof value === "string") {
            tag.putString(k, value);
        } else {
            throw new Error("Unknown type to put into NBT: " + value);
        }
    };
    Object.defineProperty(data, k, {
        get: getter,
        set: setter,
        configurable: true
    });
    if (!tag.contains(k)) data[k] = initVal;
};

/** @type {typeof Zinchronize} */
let exported = {
    Zinc: Zinc
};

return Object.freeze(exported);

})();

ContentPacks.putShared("pelemenguin.zinchronize", Zinchronize);
