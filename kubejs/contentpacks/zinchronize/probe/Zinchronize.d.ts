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

    interface TypeAdapter<T> {
        wrapObjects(compoundTag: Alias.CompoundTag, data: T): T;
    }

    interface PropertyAdapter<T> {
        defineProperty(compoundTag: Alias.CompoundTag, data: T, property: string): void;
    }

    class Zinc<T extends {}> {
        constructor(tag: Alias.CompoundTag, data: T);
        protected [Zinc.TAG]: Alias.CompoundTag;
        protected [Zinc.DATA]: T;
        private static readonly TAG: unique symbol;
        private static readonly DATA: unique symbol;
        readonly data: T;

        defineProperty(property: string): this;
    }

}
