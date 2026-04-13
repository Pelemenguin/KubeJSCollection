namespace Zinchronize {

    namespace Alias {

        /** `net.minecraft.nbt.CompoundTag` */
        type CompoundTag = Internal.CompoundTag;

    }

    interface TypedCompoundTag<T extends {}> extends Alias.CompoundTag {
        merge<U extends {}>(other: TypedCompoundTag<U>): TypedCompoundTag<T & U>;
        merge(other: Alias.CompoundTag): Alias.CompoundTag;
        getDouble<K extends Extract<keyof T, string>>(key: K): T[K] extends number ? T[K] : 0;
    }

    function syncToNBT<T extends {}>(tag: Alias.CompoundTag, data: T): T;
    function syncToNBT<T extends {}>(tag: TypedCompoundTag<T>): T;
    function syncToNBT(tag: Alias.CompoundTag): any;

}
