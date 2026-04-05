// @ts-nocheck

declare namespace RegCmd {

    namespace Alias {

        /** `java.util.Collection` */
        type Collection<E> = Internal.Collection<E>;
        /** `java.util.function.Predicate` */
        type Predicate<T>  = Internal.Predicate<T>;

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
        type ChatFormatting                 = Internal.ChatFormatting;
        /** `net.minecraft.advancements.critereon.MinMaxBounds` */
        type MinMaxBounds<T extends number> = Internal.MinMaxBounds<T>;
        type MinMaxBounds$Doubles           = Internal.MinMaxBounds$Doubles;
        /** `net.minecraft.commands.CommandBuildContext` */
        type CommandBuildContext            = Internal.CommandBuildContext;
        /** `net.minecraft.commands.CommandFunction` */
        type CommandFunction                = Internal.CommandFunction;
        /** `net.minecraft.commands.CommandSourceStack` */
        type CommandSourceStack             = Internal.CommandSourceStack;
        /** `net.minecraft.commands.arguments.AngleArgument` */
        type AngleArgument                  = Internal.AngleArgument;
        type AngleArgument$SingleAngle      = Internal.AngleArgument$SingleAngle;
        /** `net.minecraft.commands.arguments.EntityAnchorArgument` */
        type EntityAnchorArgument           = Internal.EntityAnchorArgument;
        type EntityAnchorArgument$Anchor    = Internal.EntityAnchorArgument$Anchor;
        /** `net.minecraft.commands.arguments.blocks.BlockInput` */
        type BlockInput                     = Internal.BlockInput;
        /** `net.minecraft.commands.arguments.blocks.BlockPredicateArgument` */
        type BlockPredicateArgument         = Internal.BlockPredicateArgument;
        type BlockPredicateArgument$Result  = Internal.BlockPredicateArgument$Result;
        /** `net.minecraft.commands.arguments.coordinates.Coordinates` */
        type Coordinates                    = Internal.Coordinates;
        /** `net.minecraft.commands.arguments.item.FunctionArgument` */
        type FunctionArgument               = Internal.FunctionArgument;
        type FunctionArgument$Result        = Internal.FunctionArgument$Result;
        /** `net.minecraft.commands.arguments.selector.EntitySelector` */
        type CommandEntitySelector          = net.minecraft.commands.arguments.selector.EntitySelector;
        /** `net.minecraft.core.BlockPos` */
        type BlockPos                       = globalThis.BlockPos;
        /** `net.minecraft.network.chat.Component` */
        type Component                      = net.minecraft.network.chat.Component;
        /** `net.minecraft.resources.ResourceLocation` */
        type ResourceLocation               = globalThis.ResourceLocation;
        /** `net.minecraft.server.level.ColumnPos` */
        type ColumnPos                      = Internal.ColumnPos;
        /** `net.minecraft.server.level.ServerLevel` */
        type ServerLevel                    = Internal.ServerLevel;
        /** `net.minecraft.world.entity.Entity` */
        type Entity                         = Internal.Entity;
        /** `net.minecraft.world.level.block.state.pattern.BlockInWorld` */
        type BlockInWorld                   = Internal.BlockInWorld;
    }

    class CmdBuilder<P extends {[argName: string]: CommandArgumentType<unknown, unknown>}> {
        constructor(commandArguments: ParsedArgument[]);
        protected commandArguments: ParsedArgument[];
        protected executeFunction: (context: Alias.CommandContext<Alias.CommandSourceStack>, args: Readonly<{[argName in keyof P]: P[argName] extends CommandArgumentType<any, infer R> ? R : never}>) => number;
        protected requirementPredicate: (context: Alias.CommandSourceStack) => boolean;
        protected args: P;
        protected defaultValues: Partial<{[s in keyof P]: () => P[S] extends CommandArgumentType<any, infer R> ? R : never}>;
        executes(executeFunction: (context: Alias.CommandContext<Alias.CommandSourceStack>, args: Readonly<{[argName in keyof P]: P[argName] extends CommandArgumentType<any, infer R> ? R : never}>) => number): this;
        requires(requirementPredicate: (context: Alias.CommandSourceStack) => boolean): this;
        requiresModerator(): this;
        requiresOperator(): this;
        requiresServerAdmin(): this;
        requiresServerOwner(): this;
        argType<S extends string, T, R>(argName: S, type: CommandArgumentType<T, R>): CmdBuilder<P & {[s in S]: CommandArgumentType<T, R>}>
        argDefault<S extends keyof P>(argName: S, defaultValue: () => P[S] extends CommandArgumentType<any, infer R> ? R : never): this;
        registerToEvent(event: Alias.CommandRegistryEventJS): void;
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
        function gameProfile(): CommandArgumentType<any, Alias.Collection<Alias.GameProfile>>;
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
