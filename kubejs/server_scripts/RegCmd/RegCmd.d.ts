// @ts-nocheck

declare namespace RegCmd {

    namespace Alias {

        /** `java.lang.Enum` */
        type Enum<E extends Enum<E>> = Internal.Enum<E>;

        /** `java.util.Collection` */
        type Collection<E>              = Internal.Collection<E>;
        /** `java.util.EnumSet` */
        type EnumSet<E extends Enum<E>> = Internal.EnumSet<E>;
        /** `java.util.UUID` */
        type UUID                       = Internal.UUID;
        /** `java.util.function.Predicate` */
        type Predicate<T>               = Internal.Predicate<T>;

        /** `com.mojang.authlib.GameProfile` */
        type GameProfile                    = Internal.GameProfile;

        /** `com.mojang.brigadier.arguments.ArgumentType` */
        type ArgumentType<T>                                     = Internal.ArgumentType<T>;
        /** `com.mojang.brigadier.builder.ArgumentBuilder` */
        type ArgumentBuilder<S, T extends ArgumentBuilder<S, T>> = Internal.ArgumentBuilder<S, T>;
        /** `com.mojang.brigadier.context.CommandContext` */
        type CommandContext<S>                                   = Internal.CommandContext<S>;

        /** `dev.latvian.mods.kubejs.command.CommandRegistryEventJS` */
        type CommandRegistryEventJS = Internal.CommandRegistryEventJS;

        /** `net.minecraft.ChatFormatting` */
        type ChatFormatting                     = Internal.ChatFormatting;
        /** `net.minecraft.advancements.critereon.MinMaxBounds` */
        type MinMaxBounds<T extends number>     = Internal.MinMaxBounds<T>;
        type MinMaxBounds$Doubles               = Internal.MinMaxBounds$Doubles;
        type MinMaxBounds$Ints                  = Internal.MinMaxBounds$Ints;
        /** `net.minecraft.commands.CommandBuildContext` */
        type CommandBuildContext                = Internal.CommandBuildContext;
        /** `net.minecraft.commands.CommandFunction` */
        type CommandFunction                    = Internal.CommandFunction;
        /** `net.minecraft.commands.CommandSourceStack` */
        type CommandSourceStack                 = Internal.CommandSourceStack;
        /** `net.minecraft.commands.arguments.AngleArgument` */
        type AngleArgument                      = Internal.AngleArgument;
        type AngleArgument$SingleAngle          = Internal.AngleArgument$SingleAngle;
        /** `net.minecraft.commands.arguments.EntityAnchorArgument` */
        type EntityAnchorArgument               = Internal.EntityAnchorArgument;
        type EntityAnchorArgument$Anchor        = Internal.EntityAnchorArgument$Anchor;
        /** `net.minecraft.commands.arguments.GameProfileArgument` */
        type GameProfileArgument                = Internal.GameProfileArgument;
        type GameProfileArgument$Result         = Internal.GameProfileArgument$Result;
        /** `net.minecraft.commands.arguments.MessageArgument` */
        type MessageArgument                    = Internal.MessageArgument;
        type MessageArgument$Message            = Internal.MessageArgument$Message;
        /** `net.minecraft.commands.arguments.NbtPathArgument` */
        type NbtPathArgument                    = Internal.NbtPathArgument;
        type NbtPathArgument$NbtPath            = Internal.NbtPathArgument$NbtPath;
        /** `net.minecraft.commands.arguments.OperationArgument` */
        type OperationArgument                  = Internal.OperationArgument;
        type OperationArgument$Operation        = Internal.OperationArgument$Operation;
        /** `net.minecraft.commands.arguments.ResourceOrTagArgument` */
        type ResourceOrTagArgument<T>           = Internal.ResourceOrTagArgument<T>;
        type ResourceOrTagArgument$Result<T>    = Internal.ResourceOrTagArgument$Result<T>;
        /** `net.minecraft.commands.arguments.ResourceOrTagKeyArgument` */
        type ResourceOrTagKeyArgument<T>        = Internal.ResourceOrTagKeyArgument<T>;
        type ResourceOrTagKeyArgument$Result<T> = Internal.ResourceOrTagKeyArgument$Result<T>;
        /** `net.minecraft.commands.arguments.ScoreHolderArgument` */
        type ScoreHolderArgument                = Internal.ScoreHolderArgument;
        type ScoreHolderArgument$Result         = Internal.ScoreHolderArgument$Result;
        /** `net.minecraft.commands.arguments.blocks.BlockInput` */
        type BlockInput                         = Internal.BlockInput;
        /** `net.minecraft.commands.arguments.blocks.BlockPredicateArgument` */
        type BlockPredicateArgument             = Internal.BlockPredicateArgument;
        type BlockPredicateArgument$Result      = Internal.BlockPredicateArgument$Result;
        /** `net.minecraft.commands.arguments.coordinates.Coordinates` */
        type Coordinates                        = Internal.Coordinates;
        /** `net.minecraft.commands.arguments.item.FunctionArgument` */
        type FunctionArgument                   = Internal.FunctionArgument;
        type FunctionArgument$Result            = Internal.FunctionArgument$Result;
        /** `net.minecraft.commands.arguments.item.ItemInput` */
        type ItemInput                          = Internal.ItemInput;
        /** `net.minecraft.commands.arguments.item.ItemPredicateArgument` */
        type ItemPredicateArgument              = Internal.ItemPredicateArgument;
        type ItemPredicateArgument$Result       = Internal.ItemPredicateArgument$Result;
        /** `net.minecraft.commands.arguments.selector.EntitySelector` */
        type CommandEntitySelector              = net.minecraft.commands.arguments.selector.EntitySelector;
        /** `net.minecraft.core.BlockPos` */
        type BlockPos                           = globalThis.BlockPos;
        /** `net.minecraft.core.Direction` */
        type Direction                          = Internal.Direction;
        type Direction$Axis                     = Internal.Direction$Axis;
        /** `net.minecraft.core.Holder` */
        type Holder<T>                          = Internal.Holder<T>;
        type Holder$Reference<T>                = Internal.Holder$Reference<T>;
        /** `net.minecraft.core.Registry` */
        type Registry<T>                        = Internal.Registry<T>;
        /** `net.minecraft.core.particles.ParticleOptions` */
        type ParticleOptions                    = Internal.ParticleOptions;
        /** `net.minecraft.nbt.CompoundTag` */
        type CompoundTag                        = Internal.CompoundTag;
        /** `net.minecraft.nbt.Tag */
        type Tag                                = Internal.Tag;
        /** `net.minecraft.network.chat.Component` */
        type Component                          = net.minecraft.network.chat.Component;
        /** `net.minecraft.resources.ResourceKey` */
        type ResourceKey<T>                     = Internal.ResourceKey<T>
        /** `net.minecraft.resources.ResourceLocation` */
        type ResourceLocation                   = globalThis.ResourceLocation;
        /** `net.minecraft.server.level.ColumnPos` */
        type ColumnPos                          = Internal.ColumnPos;
        /** `net.minecraft.server.level.ServerLevel` */
        type ServerLevel                        = Internal.ServerLevel;
        /** `net.minecraft.world.entity.Entity` */
        type Entity                             = Internal.Entity;
        /** `net.minecraft.world.level.GameType` */
        type GameType                           = Internal.GameType;
        /** `net.minecraft.world.level.block.Mirror` */
        type Mirror                             = Internal.Mirror;
        /** `net.minecraft.world.level.block.Rotation` */
        type Rotation                           = Internal.Rotation;
        /** `net.minecraft.world.level.block.state.pattern.BlockInWorld` */
        type BlockInWorld                       = Internal.BlockInWorld;
        /** `net.minecraft.world.level.levelgen.Heightmap` */
        type Heightmap                          = Internal.Heightmap;
        type Heightmap$Types                    = Internal.Heightmap$Types;
        /** `net.minecraft.world.phys.Vec2` */
        type Vec2                               = Internal.Vec2;
        /** `net.minecraft.world.phys.Vec3` */
        type Vec3                               = globalThis.Vec3d;
        /** `net.minecraft.world.scores.Objective` */
        type Objective                          = Internal.Objective;
        /** `net.minecraft.world.scores.PlayerTeam` */
        type PlayerTeam                         = Internal.PlayerTeam;
        /** `net.minecraft.world.scores.criteria.ObjectiveCriteria` */
        type ObjectiveCriteria                  = Internal.ObjectiveCriteria;
    }

    class CmdBuilder<P extends {[argName: string]: CommandArgumentType<unknown, unknown>}> {
        constructor(commandArguments: ParsedArgument[]);
        protected commandArguments: ParsedArgument[];
        protected executeFunction: (context: Alias.CommandContext<Alias.CommandSourceStack>, args: Readonly<{[argName in keyof P]: P[argName] extends CommandArgumentType<any, infer R> ? R : never}>, literals: (string | null)[]) => number;
        protected requirementPredicate: (context: Alias.CommandSourceStack) => boolean;
        protected args: P;
        protected defaultValues: Partial<{[s in keyof P]: () => P[S] extends CommandArgumentType<any, infer R> ? R : never}>;
        protected defaultLiterals: string[];
        protected parallelCommands: CmdBuilder<any>[];
        protected childrenCommands: CmdBuilder<any>[];
        protected buildNode(event: Alias.CommandRegistryEventJS, index: number, literalsSoFar: string[], parentNode: Alias.ArgumentBuilder<Alias.CommandSourceStack, any>, childrenRoots: Alias.ArgumentBuilder<Alias.CommandSourceStack, any>[]): Alias.ArgumentBuilder<Alias.CommandSourceStack, any>[]?;
        protected genArgs(context: Alias.CommandContext<Alias.CommandSourceStack>): Readonly<{[argName in keyof P]: P[argName] extends CommandArgumentType<any, infer R> ? R : never}>;
        executes(executeFunction: (context: Alias.CommandContext<Alias.CommandSourceStack>, args: Readonly<{[argName in keyof P]: P[argName] extends CommandArgumentType<any, infer R> ? R : never}>, literals: (string | null)[]) => number): this;
        clearRequirements(): this;
        requires(requirementPredicate: (context: Alias.CommandSourceStack) => boolean): this;
        requiresModerator(): this;
        requiresOperator(): this;
        requiresServerAdmin(): this;
        requiresServerOwner(): this;
        argType<S extends string, T, R>(argName: S, type: CommandArgumentType<T, R>): CmdBuilder<Omit<P, S> & {[s in S]: CommandArgumentType<T, R>}>
        argDefault<S extends keyof P>(argName: S, defaultValue: () => P[S] extends CommandArgumentType<any, infer R> ? R : never): this;
        literalDefault(index: number, literal: string): this;
        or(usage: string): CmdBuilder<P>;
        then(usage: string): CmdBuilder<P>;
        registerToEvent(event: Alias.CommandRegistryEventJS, registerer: (command: Alias.ArgumentBuilder<Alias.CommandSourceStack, any>) => void, isRoot: boolean): void;
    }

    namespace ArgTypes {
        function bool(): CommandArgumentType<boolean, boolean>;
        function double(): CommandArgumentType<number, number>;
        function doubleBetween(min: number, max: number): CommandArgumentType<number, number>
        function doubleAbove(min: number): CommandArgumentType<number, number>;
        function doubleBelow(max: number): CommandArgumentType<number, number>;
        function float(): CommandArgumentType<number, number>;
        function floatBetween(min: number, max: number): CommandArgumentType<number, number>
        function floatAbove(min: number): CommandArgumentType<number, number>;
        function floatBelow(max: number): CommandArgumentType<number, number>;
        function integer(): CommandArgumentType<number, number>;
        function integerBetween(min: number, max: number): CommandArgumentType<number, number>
        function integerAbove(min: number): CommandArgumentType<number, number>;
        function integerBelow(max: number): CommandArgumentType<number, number>;
        function long(): CommandArgumentType<number, number>;
        function longBetween(min: number, max: number): CommandArgumentType<number, number>
        function longAbove(min: number): CommandArgumentType<number, number>;
        function longBelow(max: number): CommandArgumentType<number, number>;
        function string(): CommandArgumentType<string, string>;
        function word(): CommandArgumentType<string, string>;
        function greedyString(): CommandArgumentType<string, string>;
        function angle(): CommandArgumentType<Alias.AngleArgument$SingleAngle, number>;
        function blockPos(): CommandArgumentType<Alias.Coordinates, Alias.BlockPos>;
        function blockPredicate(): CommandArgumentType<Alias.BlockPredicateArgument$Result, Alias.Predicate<Alias.BlockInWorld>>;
        function blockState(): CommandArgumentType<Alias.BlockInput, Alias.BlockInput>;
        function color(): CommandArgumentType<Alias.ChatFormatting, Alias.ChatFormatting>;
        function columnPos(): CommandArgumentType<Alias.Coordinates, Alias.ColumnPos>;
        function component(): CommandArgumentType<Alias.Component, Alias.Component>;
        function dimension(): CommandArgumentType<Alias.ResourceLocation, Alias.ServerLevel>;
        function entity(): CommandArgumentType<Alias.CommandEntitySelector, Alias.Entity>;
        function entities(): CommandArgumentType<Alias.CommandEntitySelector, Alias.Collection<Alias.Entity>>;
        function entityAnchor(): CommandArgumentType<Alias.EntityAnchorArgument$Anchor, Alias.EntityAnchorArgument$Anchor>;
        function floatRange(): CommandArgumentType<Alias.MinMaxBounds$Doubles, Alias.MinMaxBounds$Doubles>;
        function functions(): CommandArgumentType<Alias.FunctionArgument$Result, Alias.Collection<Alias.CommandFunction>>;
        function gameProfile(): CommandArgumentType<Alias.GameProfileArgument$Result, Alias.Collection<Alias.GameProfile>>;
        function gameMode(): CommandArgumentType<Alias.GameType, Alias.GameType>;
        function heightmap(): CommandArgumentType<Alias.Heightmap$Types, Alias.Heightmap$Types>;
        function intRange(): CommandArgumentType<Alias.MinMaxBounds$Ints, Alias.MinMaxBounds$Ints>;
        function itemPredicate(): CommandArgumentType<Alias.BlockPredicateArgument$Result, Alias.Predicate<Alias.ItemStack>>;
        function itemSlot(): CommandArgumentType<number, number>;
        function item(): CommandArgumentType<Alias.ItemInput, Alias.ItemInput>;
        function message(): CommandArgumentType<Alias.MessageArgument$Message, Alias.Component>;
        function nbtCompound(): CommandArgumentType<Alias.CompoundTag, Alias.CompoundTag>;
        function nbtPath(): CommandArgumentType<Alias.NbtPathArgument$NbtPath, Alias.NbtPathArgument$NbtPath>;
        function nbtTag(): CommandArgumentType<Alias.Tag, Alias.Tag>;
        function objective(): CommandArgumentType<string, Alias.Objective>;
        function writableObjective(): CommandArgumentType<string, Alias.Objective>;
        function objectiveCriteria(): CommandArgumentType<Alias.ObjectiveCriteria, Alias.ObjectiveCriteria>;
        function operation(): CommandArgumentType<Alias.OperationArgument$Operation, Alias.OperationArgument$Operation>;
        function particle(): CommandArgumentType<Alias.ParticleOptions, Alias.ParticleOptions>;
        function resource<T>(resKey: Alias.ResourceKey<Alias.Registry<T>>): CommandArgumentType<Alias.Holder$Reference<T>, Alias.Holder$Reference<T>>;
        function resourceLocation(): CommandArgumentType<Alias.ResourceLocation, Alias.ResourceLocation>;
        function resourceOrTag<T>(resKey: Alias.ResourceKey<Alias.Registry<T>>): CommandArgumentType<Alias.ResourceOrTagArgument$Result<T>, Alias.ResourceOrTagArgument$Result<T>>;
        function resourceOrTagKey<T>(resKey: Alias.ResourceKey<Alias.Registry<T>>): CommandArgumentType<Alias.ResourceOrTagKeyArgument$Result<T>, Alias.ResourceOrTagKeyArgument$Result<T>>;
        function rotation(): CommandArgumentType<Alias.Coordinates, Alias.Coordinates>;
        function scoreHolder(): CommandArgumentType<Alias.ScoreHolderArgument$Result, string>;
        function scoreHolders(): CommandArgumentType<Alias.ScoreHolderArgument$Result, Alias.Collection<string>>;
        function scoreboardSlot(): CommandArgumentType<number, number>;
        function swizzle(): CommandArgumentType<Alias.EnumSet<Alias.Direction$Axis>, Alias.EnumSet<Alias.Direction$Axis>>;
        function team(): CommandArgumentType<string, Alias.PlayerTeam>;
        function templateMirror(): CommandArgumentType<Alias.Mirror, Alias.Mirror>;
        function templateRotation(): CommandArgumentType<Alias.Rotation, Alias.Rotation>;
        function time(minimum: number = 0): CommandArgumentType<number, number>;
        function uuid(): CommandArgumentType<Alias.UUID, Alias.UUID>;
        function vec2(centerCorrect: boolean = false): CommandArgumentType<Alias.Coordinates, Alias.Vec2>;
        function vec3(centerCorrect: boolean = false): CommandArgumentType<Alias.Coordinates, Alias.Vec3>;
    }

    type CommandArgumentType<T, R> = {
        getType(context: Alias.CommandBuildContext): Alias.ArgumentType<T>,
        getValue(context: Alias.CommandContext<Alias.CommandSourceStack>, argName: string): R
    };

    type ParsedArgument = ({
        type: "LITERAL",
        literal: string
    } | {
        type: "MULTI_LITERAL",
        literals: string[]
    } | {
        type: "ARGUMENT",
        name: string
    }) & {optional: boolean};

    function parseCommandUsage(usage: string): ParsedArgument[];
    function defineCommand(usage: string): CmdBuilder<{}>;

}

declare const RegCmd: RegCmd;
