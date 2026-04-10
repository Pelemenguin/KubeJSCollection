// priority: 2147483647

/// <reference path="CodecJS.d.ts" />

const CodecJS = (() => {

/** @type {typeof CodecJS} */
const exported = {
};

//#region - Load Java classes

/** @type {CodecJS.Alias.$Codec<any>} */
const $Codec = Java.loadClass("com.mojang.serialization.Codec");

const $NbtOps = Java.loadClass("net.minecraft.nbt.NbtOps");

//#endregion

//#region - Built-in Codecs

exported.NbtOps = $NbtOps.INSTANCE;

exported.Builtins = {
    BOOL: $Codec.BOOL,
    BYTE: $Codec.BYTE,
    BYTE_BUFFER: $Codec.BYTE_BUFFER,
    DOUBLE: $Codec.DOUBLE,
    FLOAT: $Codec.FLOAT,
    INT: $Codec.INT,
    INT_STREAM: $Codec.INT_STREAM,
    LONG: $Codec.LONG,
    LONG_STREAM: $Codec.LONG_STREAM,
    PASSTHROUGH: $Codec.PASSTHROUGH,
    SHORT: $Codec.SHORT,
    STRING: $Codec.STRING,
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
};

exported.fromNbt = function(tag, codec, handleError) {
    if (handleError == undefined) {
        handleError = (error) => {
            console.error(`Failed to decode object: ${error}`);
        };
    }
    return codec.parse(exported.NbtOps, tag)
        .resultOrPartial(handleError)
        .orElse(null);
};

//#endregion

return Object.freeze(exported);

})();
