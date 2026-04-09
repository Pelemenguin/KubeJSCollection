// priority: 2147483647

/// <reference path="CodecJS.d.ts" />

const CodecJS = (() => {

/** @type {typeof CodecJS} */
const exported = {
};

//#region - Load Java classes

/** @type {Alias.$Codec<any>} */
const $Codec = Java.loadClass("com.mojang.serialization.Codec");

const $NbtOps = Java.loadClass("net.minecraft.nbt.NbtOps");

//#endregion

//#region - Built-in Codecs

exported.NbtOps = $NbtOps.INSTANCE;

exported.Builtins = {
    RESOURCE_LOCATION: ResourceLocation.CODEC
};

//#endregion

//#region - Helper functions

exported.toNbt = function(obj, codec, handleError) {
    if (handleError == undefined) {
        handleError = (error) => {
            console.error(`Failed to encode object: ${error}`);
        };
    }
    return codec.encodeStart(exported.NbtOps, obj)
        .resultOrPartial(handleError)
        .orElse(null);
}

exported.fromNbt = function(tag, codec, handleError) {
    if (handleError == undefined) {
        handleError = (error) => {
            console.error(`Failed to decode object: ${error}`);
        };
    }
    return codec.parse(exported.NbtOps, tag)
        .resultOrPartial(handleError)
        .orElse(null);
}

//#endregion

return Object.freeze(exported);

})();
