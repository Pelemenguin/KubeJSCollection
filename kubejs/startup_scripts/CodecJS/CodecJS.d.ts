declare namespace CodecJS {

    declare namespace Alias {

        /** `com.mojang.serialization.Codec` */
        type  Codec<A>     = Internal.Codec<A>;
        type $Codec<A>     = Internal.Codec<A>;
        /** `com.mojang.serialization.DynamicOps` */
        type DynamicOps<T> = Internal.DynamicOps<T>;

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
        const RESOURCE_LOCATION: Alias.Codec<Alias.ResourceLocation>;
    }

    const NbtOps: Alias.DynamicOps<Alias.Tag>;

    // TODO: Mention in JSDoc that `handleError` is to console.error(message) by default
    function toNbt<T>(obj: T, codec: Alias.Codec<T>, handleError?: (message: string) => void): Alias.Tag;
    function fromNbt<T>(tag: Alias.Tag, codec: Alias.Codec<T>, handleError?: (message: string) => void): T;

}

declare const CodecJS: typeof CodecJS;
