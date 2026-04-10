declare namespace Zinchronize {

    declare namespace Alias {
        
        /** `net.minecraft.nbt.CompoundTag` */
        type CompoundTag = Internal.CompoundTag;

    }

    function syncBetween<T extends {}>(obj: T, tag: Internal.CompoundTag): T;

}

declare const Zinchronize: typeof Zinchronize;
