declare namespace CodecJS {

    declare namespace Alias {

        /** `java.nio.ByteBuffer` */
        type ByteBuffer = Internal.ByteBuffer;

        /** `java.util.stream.IntStream` */
        type IntStream = Internal.IntStream;
        /** `java.util.stream.LongStream` */
        type LongStream = Internal.LongStream;

        /** `com.mojang.serialization.Codec` */
        type  Codec<A>          = Internal.Codec<A>;
        type $Codec<A>          = Internal.Codec<A>;
        /** `com.mojang.serialization.Dynamic` */
        type Dynamic<T>         = Internal.Dynamic<T>;
        /** `com.mojang.serialization.DynamicOps` */
        type DynamicOps<T>      = Internal.DynamicOps<T>;

        /** `net.minecraft.nbt.NbtOps` */
        type NbtOps           = Internal.NbtOps;
        /** `net.minecraft.nbt.CompoundTag` */
        type CompoundTag      = Internal.CompoundTag;
        /** `net.minecraft.nbt.Tag` */
        type Tag              = Internal.Tag;
        /** `net.minecraft.resources.ResourceLocation` */
        type ResourceLocation = globalThis.ResourceLocation;

    }

    declare namespace Builtins {
        const BOOL: Alias.Codec<boolean>;
        const BYTE: Alias.Codec<number>;
        const BYTE_BUFFER: Alias.Codec<Alias.ByteBuffer>;
        const DOUBLE: Alias.Codec<number>;
        const FLOAT: Alias.Codec<number>;
        const INT: Alias.Codec<number>;
        const INT_STREAM: Alias.Codec<Alias.IntStream>;
        const LONG: Alias.Codec<number>;
        const LONG_STREAM: Alias.Codec<Alias.LongStream>;
        const PASSTHROUGH: Alias.Codec<Alias.Dynamic<any>>;
        const SHORT: Alias.Codec<number>;
        const STRING: Alias.Codec<string>;
        const RESOURCE_LOCATION: Alias.Codec<Alias.ResourceLocation>;
    }

    const NbtOps: Alias.DynamicOps<Alias.Tag>;

    // TODO: Mention in JSDoc that `handleError` is to console.error(message) by default
    function toNbt<T>(obj: T, codec: Alias.Codec<T>, handleError?: (message: string) => void): Alias.Tag;
    function fromNbt<T>(tag: Alias.Tag, codec: Alias.Codec<T>, handleError?: (message: string) => void): T;

}

declare const CodecJS: typeof CodecJS;
