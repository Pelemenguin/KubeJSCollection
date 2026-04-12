// @ts-nocheck

/*
 * MIT License
 * 
 * Copyright (c) 2026 Pelemenguin
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * RegCmd is a KubeJS JavaScript library that simplifies command registration.
 * 
 * ## Usage
 * 
 * ### Basic Commands
 * 
 * Use {@linkcode RegCmd.defineCommand} to start defining a command.
 * 
 * Take a simple `/example` command as an example:
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/example") // command format
 * >     .executes((context) => {
 * >         // context.getSource().sendSuccess(Component, boolean) is the standard method provided by KubeJS to return a success message
 * >         // The true below means it will be broadcast to operators, e.g., cheat commands like /gamemode need to notify operators, so true is used
 * >         // For other normal commands that don't need to notify operators, false can be used
 * >         context.getSource().sendSuccess(Component.literal("Command executed!"), true);
 * >         // Command return value: greater than 0 indicates success, 0 indicates failure
 * >         return 1;
 * >     });
 * > ```
 * 
 * ### Literals
 * 
 * To include literals in a command, use the following format:
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/example literal")
 * >     .executes((context) => {
 * >         context.getSource().sendSuccess(Component.literal("You invoked /example literal!"), true);
 * >         return 1;
 * >     });
 * > ```
 * 
 * Commands defined this way must be invoked as `/example literal`; the word `literal` cannot be changed.
 * 
 * ### Choice Literals
 * 
 * You can add choice literals using the `(literalA|literalB)` form. The following command can be invoked either as `/greet hello` or `/greet goodbye`:
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/greet (hello|goodbye)")
 * >     .executes((context) => {
 * >         context.getSource().sendSuccess(Component.literal("But I don't know whether it's hello or goodbye"), true);
 * >         return 1;
 * >     });
 * > ```
 * 
 * To know which literal was chosen, use the third parameter of the callback function:
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/greet (hello|goodbye)")
 * >     .executes((context, args, literals) => {
 * >         const greetType = literals[1]; // get the literal at index 1
 * >         if (greetType == "hello") {
 * >             context.getSource().sendSuccess(Component.literal("Hello!"), true);
 * >         } else {
 *             context.getSource().sendSuccess(Component.literal("Goodbye!"), true);
 * >         }
 * >         return 1;
 * >     });
 * > ```
 * 
 * ### Literal Index
 * 
 * Literal indices start counting from the root command as `0`, for example:
 * 
 * > ```text
 * > /example literal (hello|goodbye) third
 * >  0       1       2               3
 * > ```
 * 
 * That is:
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/example literal (hello|goodbye) third")
 * >     .executes((context, args, literal) => {
 * >         literal[0] // -> "example"
 * >         literal[1] // -> "literal"
 * >         literal[2] // -> "hello" or "goodbye", depending on the player's input
 * >         literal[3] // -> "third"
 * >     });
 * > ```
 * 
 * ### Command Arguments
 * 
 * You can use `<argumentName>` in the command format to define arguments, and use {@linkcode CmdBuilder.argType} to specify the argument type:
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/double <num>")
 * >     // define the argument num as an integer type:
 * >     .argType("num", RegCmd.ArgTypes.integer())
 * >     .executes((context, args) => {
 * >         // args already contains the command arguments for you
 * >         const { num } = args;
 * >         let result = num * 2;
 * >         context.getSource().sendSuccess(Component.literal(result.toFixed()), true);
 * >         return result;
 * >     });
 * > ```
 * 
 * You can also define multiple arguments and mix them with literals:
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/calc add <int1> <int2>")
 * >     .argType("int1", RegCmd.ArgTypes.integerAbove(0))
 * >     .argType("int2", RegCmd.ArgTypes.integerAbove(0))
 * >     .executes((context, args) => {
 * >         const { int1, int2 } = args;
 * >         let result = int1 + int2;
 * >         context.getSource().sendSuccess(Component.literal(result.toFixed()), true);
 * >         return result;
 * >     });
 * > ```
 * 
 * The argument types shown here ({@linkcode ArgTypes.integer}, {@linkcode ArgTypes.integerAbove}) and more available argument types can be found in {@linkcode ArgTypes}.
 * 
 * ### Optional Literals and Optional Arguments
 * 
 * Use `[]` to indicate optional parts. The optional variants for each command format are shown in the table below:
 * 
 * |      Command Format     |     Optional Variant     |
 * |:------------------------|:-------------------------|
 * |`literal`                |`[literal]`               |
 * |`(literalA\|literalB)`   |`[literalA\|literalB]`    |
 * |`<argumentName>`         |`[<argumentName>]`        |
 * 
 * When an optional argument is not specified in the command input, its value will be `null`.
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/greet [hello|goodbye]")
 * >     .executes((context, args, literals) => {
 * >         const greetType = literals[1];
 * >         if (greetType == null) {
 * >             context.getSource().sendSuccess(Component.literal("I don't know if you just arrived or are leaving :("), true);
 * >             return 0;
 * >         }
 * >         if (greetType == "hello") {
 * >             context.getSource().sendSuccess(Component.literal("Hello!"), true);
 * >         } else {
 * >             context.getSource().sendSuccess(Component.literal("Goodbye!"), true);
 * >         }
 * >         return 1;
 * >     });
 * > ```
 * 
 * ### Default Values for Optional Literals and Optional Arguments
 * 
 * {@linkcode CmdBuilder.argDefault} and {@linkcode CmdBuilder.literalDefault} can be used to set default values for optional arguments and optional literals respectively.
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/calc add <int1> [<int2>]")
 * >     .argType("int1", RegCmd.ArgTypes.integerAbove(0))
 * >     .argType("int2", RegCmd.ArgTypes.integerAbove(0)).argDefault("int2", () => 0) // if int2 is not specified, default to 0
 * >     .executes((context, args) => {
 * >         const { int1, int2 } = args;
 * >         let result = int1 + int2;
 * >         context.getSource().sendSuccess(Component.literal(result.toFixed()), true);
 * >         return result;
 * >     });
 * > RegCmd.defineCommand("/greet [hello|goodbye]")
 * >     .literalDefault(1, "hello") // if the literal at index 1 is not chosen, default to hello
 * >     // Cannot set a default value for a literal that cannot be chosen, e.g., the literal at index 0 "greet"
 * >     .executes((context, args, literals) => {
 * >         if (literals[1] == "hello") {
 * >             context.getSource().sendSuccess(Component.literal("Hello!"), true);
 * >         } else {
 * >             context.getSource().sendSuccess(Component.literal("Goodbye!"), true);
 * >         }
 * >         return 1;
 * >     });
 * > ```
 * 
 * You can place required arguments after optional ones:
 * 
 * > ```javascript
 * > let secretValue = 0;
 * > RegCmd.defineCommand("/secret [set] <value>")
 * >     .argType("value", RegCmd.ArgTypes.integer())
 * >     .executes((context, args, literals) => {
 * >         if (literals[1] == null) {
 * >             context.getSource().sendSuccess(Component.literal("Your secret value is: " + secretValue), true);
 * >         } else {
 * >             const newValue = args.value;
 * >             secretValue = newValue;
 * >             context.getSource().sendSuccess(Component.literal("Secret value set to: " + secretValue), true);
 * >         }
 * >         return 1;
 * >     });
 * > ```
 * 
 * `/secret [set] <value>` means: you can invoke it as `/secret` (because `[set]` is optional);
 * but you cannot invoke it as `/secret set` because there is a required argument `<value>` after the optional literal `[set]`.
 * 
 * That is: either invoke it as `/secret`, or as `/secret set <value>`.
 * 
 * It is worth noting that when invoked as `/secret`, the value of `<value>` will be `null`.
 * That means a required argument is **not always non-null**; if a required argument is preceded by optional arguments, it may be `null`.
 * 
 * ### Command Requirements
 * 
 * Some commands have cheat properties and may affect other players on the server.
 * In such cases, you can use {@linkcode CmdBuilder.requires} set requirements to restrict execution to players who meet certain conditions.
 * 
 * ### Command Branches
 * 
 * Use {@linkcode CmdBuilder.or} or {@linkcode CmdBuilder.then} methods to create branches.
 * For detailed usage, refer to the documentation of these methods.
 * 
 * ## Type Definitions
 * 
 * Since both ProbeJS 6 and ProbeJS 7 exist on Minecraft 1.20.1,
 * the type definition files they generate are vastly different in format.
 * To get correct type hints, you can go to the {@linkcode Alias} namespace and change the aliases to match the type definitions generated by your own ProbeJS.
 * 
 * ## KubeLoader
 * @since 1.0.1
 * 
 * This module supports loading via KubeLoader.
 * When using KubeLoader, use:
 * 
 * > ```javascript
 * > const RegCmd = ContentPacks.getShared("pelemenguin.regcmd");
 * > // or more strictly:
 * > const RegCmd = ContentPacks.getShared("server", "pelemenguin.regcmd");
 * > ```
 * 
 * to load it into your own scripts.
 * 
 * ---
 * 
 * @author Pelemenguin
 * @version 1.0.1
 * @license MIT
 * @copyright Pelemenguin 2026
 */
declare namespace RegCmd {

    /**
     * Predefined aliases for documentation.
     * 
     * If these do not match the files generated by ProbeJS,
     * you can change them here to ensure your documentation works properly.
     */
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
        /** `com.mojang.brigadier.suggestion.SuggestionsBuilder` */
        type SuggestionsBuilder                                  = Internal.SuggestionsBuilder;

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

    /**
     * Class for building command definitions.
     */
    class CmdBuilder<P extends {[argName: string]: CommandArgumentType<unknown, unknown>}> {
        /**
         * Constructs a new `CmdBuilder`.
         * 
         * **Note**: A `CmdBuilder` created via the constructor will not be automatically registered. Use {@linkcode defineCommand} instead.
         * 
         * @param commandArguments An array of parsed command arguments obtained via {@linkcode parseCommandUsage}
         */
        constructor(commandArguments: ParsedArgument[]);
        protected commandArguments: ParsedArgument[];
        protected executeFunction: (context: Alias.CommandContext<Alias.CommandSourceStack>, args: Readonly<{[argName in keyof P]: P[argName] extends CommandArgumentType<any, infer R> ? R : never}>, literals: (string | null)[]) => number;
        protected requirementPredicate: (context: Alias.CommandSourceStack) => boolean;
        protected args: P;
        protected defaultValues: Partial<{[s in keyof P]: () => P[S] extends CommandArgumentType<any, infer R> ? R : never}>;
        protected defaultLiterals: string[];
        protected parallelCommands: CmdBuilder<any>[];
        protected childrenCommands: CmdBuilder<any>[];
        protected suggestions: Partial<{[s in keyof P]: Parameters<CmdBuilder<P>["argSuggests"]>[1]}>;
        protected buildNode(event: Alias.CommandRegistryEventJS, index: number, literalsSoFar: string[], parentNode: Alias.ArgumentBuilder<Alias.CommandSourceStack, any>, childrenRoots: Alias.ArgumentBuilder<Alias.CommandSourceStack, any>[]): Alias.ArgumentBuilder<Alias.CommandSourceStack, any>[]?;
        protected genArgs(context: Alias.CommandContext<Alias.CommandSourceStack>): Readonly<{[argName in keyof P]: P[argName] extends CommandArgumentType<any, infer R> ? R : never}>;
        /**
         * Sets the command's execution function.
         * 
         * The execution function takes three parameters: `context`, `args`, and `literals`.
         * `context` is the command execution context, same as the parameter required by the `executes` method in KubeJS command registration.
         * `args` contains the extracted command arguments, and `literals` is an array of literals for the current command branch.
         * 
         * See the {@link RegCmd `RegCmd` module documentation} for more detailed usage.
         * 
         * @param executeFunction The execution function
         * @return                The current `CmdBuilder` instance
         */
        executes(executeFunction: (context: Alias.CommandContext<Alias.CommandSourceStack>, args: Readonly<{[argName in keyof P]: P[argName] extends CommandArgumentType<any, infer R> ? R : never}>, literals: (string | null)[]) => number): this;
        /**
         * Clears all current command requirements.
         * 
         * Useful when branches created by {@linkcode or} or {@linkcode then} have different requirements than the root command.
         * 
         * @return The current `CmdBuilder` instance
         */
        clearRequirements(): this;
        /**
         * Adds a predicate to check permissions or other requirements for command execution.
         * 
         * For example:
         * 
         * > ```javascript
         * > RegCmd.defineCommand("/accelerate <motion>")
         * >     .argType("motion", RegCmd.ArgTypes.vec3())
         * >     // player must have at least permission level 2 to execute (typically cheat commands)
         * >     .requires(s => s.hasPermission(2))
         * >     .executes((context, args) => {
         * >         let player = context.getSource().getPlayer();
         * >         if (player == null) {
         * >             context.getSource().sendFailure(Component.literal("Caller is not a player"));
         * >             return 0;
         * >         }
         * >         player.addDeltaMovement(args.motion);
         * >         context.getSource().sendSuccess(Component.literal("Added acceleration to the caller"), true);
         * >         return 1;
         * >     });
         * > ```
         * 
         * Alternatively, use the predefined {@linkcode CmdBuilder.requiresOperator} method, which is equivalent to `.requires(s => s.hasPermission(2))`:
         * 
         * > ```javascript
         * > RegCmd.defineCommand("/accelerate <motion>")
         * >     .argType("motion", RegCmd.ArgTypes.vec3())
         * >     .requiresOperator()
         * >     // rest of the content
         * > ```
         * 
         * @param requirementPredicate A function that accepts a `CommandSourceStack` as a parameter and returns a boolean indicating whether the command execution requirements are met.
         * @return                     The current `CmdBuilder` instance
         */
        requires(requirementPredicate: (context: Alias.CommandSourceStack) => boolean): this;
        /**
         * Requires the executing player to have at least permission level 1.
         * 
         * No vanilla Minecraft commands use this permission level.
         * 
         * @return The current `CmdBuilder` instance
         */
        requiresModerator(): this;
        /**
         * Requires the executing player to have operator permissions (permission level 2).
         * 
         * Most vanilla cheat commands (such as `/gamemode`) require this permission level.
         * 
         * @return The current `CmdBuilder` instance
         */
        requiresOperator(): this;
        /**
         * Requires the executing player to have admin permissions (permission level 3).
         * 
         * Some server management commands in vanilla Minecraft (such as `/op`, `/deop`) require this permission level.
         * 
         * @return The current `CmdBuilder` instance
         */
        requiresServerAdmin(): this;
        /**
         * Requires the executing player to be the server owner (permission level 4).
         * 
         * Some commands that directly control the server in vanilla Minecraft (such as `/stop`) require this permission level.
         * 
         * @return The current `CmdBuilder` instance
         */
        requiresServerOwner(): this;
        /**
         * Specifies the type of an argument in the command.
         * 
         * @param argName The argument name
         * @param type    The argument type, obtained using methods in {@linkcode ArgTypes}
         * @return        The current `CmdBuilder` instance, with updated type parameter
         */
        argType<S extends string, T, R>(argName: S, type: CommandArgumentType<T, R>): CmdBuilder<Omit<P, S> & {[s in S]: CommandArgumentType<T, R>}>;
        /**
         * Sets a default value for an optional argument.
         * 
         * @param argName      The argument name
         * @param defaultValue A function that returns the default value when the argument is not specified in the command. The type matches the type set for this argument via {@linkcode argType}.
         * @return             The current `CmdBuilder` instance
         */
        argDefault<S extends keyof P>(argName: S, defaultValue: () => P[S] extends CommandArgumentType<any, infer R> ? R : never): this;
        /**
         * Sets a suggestion provider for an argument. When the player types the command in chat,
         * the suggestion function is called to provide input completions.
         * 
         * > ```javascript
         * > RegCmd.defineCommand("/greet <arg> [literal]")
         * >     .argType("arg", RegCmd.ArgTypes.string())
         * >     .argSuggests("arg", (context, builder, args, literals) => {
         * >         // `literals` is e.g. [example] not [example, arg, literal]
         * >         // because we cannot obtain literals that come after this argument
         * >
         * >         builder.suggest("hello");
         * >         builder.suggest("goodbye");
         * >         // Now when the player types the <arg> argument, they will see completions "hello" and "goodbye"
         * >     })
         * >     .executes((context, args, literals) => {
         * >         // your own executes function
         * >     });
         * > ```
         * 
         * @param argName    The argument name
         * @param suggestion The suggestion function
         * @return           The current `CmdBuilder` instance
         * 
         * @since 1.0.1
         */
        argSuggests<S extends keyof P>(argName: S, suggestion: (context: Alias.CommandContext<Alias.CommandSourceStack>, builder: Alias.SuggestionsBuilder, args: Readonly<{[argName in keyof P]: P[argName] extends CommandArgumentType<any, infer R> ? R : never}>, literals: (string | null)) => void): this;
        /**
         * Sets a default value for an optional literal.
         * 
         * @param index   The literal index
         * @param literal The default value
         */
        literalDefault(index: number, literal: string): this;
        /**
         * Creates a parallel branch to the current command. The new branch shares the parent command and command arguments with the current branch, but not the literals or execution function.
         * 
         * For example:
         * 
         * > ```javascript
         * > RegCmd.defineCommand("/calculator add <int1> [<int2>]")
         * >     .argType("int1", RegCmd.ArgTypes.integer())
         * >     .argType("int2", RegCmd.ArgTypes.integer()).argDefault("int2", () => 0)
         * >     .executes((context, args) => {
         * >         const { int1, int2 } = args;
         * >         let result = int1 + int2;
         * >         context.getSource().sendSuccess(Component.literal(result.toFixed()), true);
         * >         return result;
         * >     })
         * >     .or("/calculator sub <int1> [<int2>]")
         * >     // parallel command branches created via or inherit all argument types and default values from the original
         * >     .executes((context, args) => {
         * >         const { int1, int2 } = args;
         * >         let result = int1 - int2;
         * >         context.getSource().sendSuccess(Component.literal(result.toFixed()), true);
         * >         return result;
         * >     });
         * > ```
         * 
         * @param usage The command format of the new branch, following the same rules as in {@linkcode defineCommand}
         * @return      A new `CmdBuilder` instance representing the new branch
         */
        or(usage: string): CmdBuilder<P>;
        /**
         * Creates a new child command branch. The new branch takes the current command as its parent and inherits all argument types and default values from the current command, but does not share literals or the execution function.
         * 
         * For example:
         * 
         * > ```javascript
         * > let secret = 0;
         * > RegCmd.defineCommand("/secret")
         * >     .executes((context) => {
         * >         context.getSource().sendSuccess(Component.literal("You secret value is: " + secret), true);
         * >         return 1;
         * >     })
         * >     .then("set <value>")
         * >     .argType("value", RegCmd.ArgTypes.integer())
         * >     .executes((context, args) => {
         * >         const newValue = args.value;
         * >         secret = newValue;
         * >         context.getSource().sendSuccess(Component.literal("Secret value set to: " + secret), true);
         * >     });
         * > ```
         * 
         * This actually creates two command usages: `/secret` and `/secret set <value>`.
         * 
         * **Note**: Literal indices are recalculated starting from the child branch. That is, in the example above, the index of `<value>` is `1`, not `2`.
         * 
         * > ```javascript
         * > let secret = 0;
         * > RegCmd.defineCommand("/secret")
         * >     .executes((context, args, literals) => {
         * >         literals[0]; // -> "secret"
         * >     })
         * >     .then("set <value>")
         * >     .executes((context, args, literals) => {
         * >         literals[0]; // -> "set", not "secret"
         * >         literals[1]; // -> null, because `set` is an argument, not a literal
         * >     });
         * > ```
         * 
         * @param usage The command format of the new branch, following the same rules as in {@linkcode defineCommand}
         * @return      A new `CmdBuilder` instance representing the new branch
         */
        then(usage: string): CmdBuilder<P>;
        /**
         * Registers the current `CmdBuilder` instance into a `CommandRegistryEventJS` event.
         * 
         * Usually you don't need to call this method directly, because the `CmdBuilder` produced by {@linkcode defineCommand} automatically calls it during command registration.
         * 
         * @param event      The event to register to
         * @param registerer A function that accepts an `ArgumentBuilder` as a parameter, used to register the root node of the current command into the event. For a root command, this `registerer` is `(c) => event.register(c)`
         * @param isRoot     A boolean indicating whether the current `CmdBuilder` is the root command.
         */
        registerToEvent(event: Alias.CommandRegistryEventJS, registerer: (command: Alias.ArgumentBuilder<Alias.CommandSourceStack, any>) => void, isRoot: boolean): void;
    }

    /**
     * All built-in command argument types.
     */
    namespace ArgTypes {
        /**
         * Boolean argument type.
         * 
         * If a command argument `<arg>` is of this type, `<arg>` must be `true` or `false`.
         * 
         * @return The created type
         */
        function bool(): CommandArgumentType<boolean, boolean>;
        /**
         * Double-precision floating point argument type (no range restriction).
         * 
         * Accepts any double-precision floating point number (e.g., `1.5`, `-2.3`).
         * 
         * @return The created type
         */
        function double(): CommandArgumentType<number, number>;
        /**
         * Double-precision floating point argument type (bounded range, inclusive).
         * 
         * @param min Minimum value (inclusive)
         * @param max Maximum value (inclusive)
         * @return The created type
         */
        function doubleBetween(min: number, max: number): CommandArgumentType<number, number>;
        /**
         * Double-precision floating point argument type (greater than or equal to minimum).
         * 
         * @param min Minimum value (inclusive)
         * @return The created type
         */
        function doubleAbove(min: number): CommandArgumentType<number, number>;
        /**
         * Double-precision floating point argument type (less than or equal to maximum).
         * 
         * @param max Maximum value (inclusive)
         * @return The created type
         */
        function doubleBelow(max: number): CommandArgumentType<number, number>;
        /**
         * Single-precision floating point argument type (no range restriction).
         * 
         * @return The created type
         */
        function float(): CommandArgumentType<number, number>;
        /**
         * Single-precision floating point argument type (bounded range, inclusive).
         * 
         * @param min Minimum value (inclusive)
         * @param max Maximum value (inclusive)
         * @return The created type
         */
        function floatBetween(min: number, max: number): CommandArgumentType<number, number>;
        /**
         * Single-precision floating point argument type (greater than or equal to minimum).
         * 
         * @param min Minimum value (inclusive)
         * @return The created type
         */
        function floatAbove(min: number): CommandArgumentType<number, number>;
        /**
         * Single-precision floating point argument type (less than or equal to maximum).
         * 
         * @param max Maximum value (inclusive)
         * @return The created type
         */
        function floatBelow(max: number): CommandArgumentType<number, number>;
        /**
         * Integer argument type (no range restriction).
         * 
         * @return The created type
         */
        function integer(): CommandArgumentType<number, number>;
        /**
         * Integer argument type (bounded range, inclusive).
         * 
         * @param min Minimum value (inclusive)
         * @param max Maximum value (inclusive)
         * @return The created type
         */
        function integerBetween(min: number, max: number): CommandArgumentType<number, number>;
        /**
         * Integer argument type (greater than or equal to minimum).
         * 
         * @param min Minimum value (inclusive)
         * @return The created type
         */
        function integerAbove(min: number): CommandArgumentType<number, number>;
        /**
         * Integer argument type (less than or equal to maximum).
         * 
         * @param max Maximum value (inclusive)
         * @return The created type
         */
        function integerBelow(max: number): CommandArgumentType<number, number>;
        /**
         * Long integer argument type (no range restriction).
         * 
         * @return The created type
         */
        function long(): CommandArgumentType<number, number>;
        /**
         * Long integer argument type (bounded range, inclusive).
         * 
         * @param min Minimum value (inclusive)
         * @param max Maximum value (inclusive)
         * @return The created type
         */
        function longBetween(min: number, max: number): CommandArgumentType<number, number>;
        /**
         * Long integer argument type (greater than or equal to minimum).
         * 
         * @param min Minimum value (inclusive)
         * @return The created type
         */
        function longAbove(min: number): CommandArgumentType<number, number>;
        /**
         * Long integer argument type (less than or equal to maximum).
         * 
         * @param max Maximum value (inclusive)
         * @return The created type
         */
        function longBelow(max: number): CommandArgumentType<number, number>;
        /**
         * Quoted string argument type (allows spaces, but must be enclosed in double quotes).
         * 
         * For example: `"hello world"`.
         * 
         * @return The created type
         */
        function string(): CommandArgumentType<string, string>;
        /**
         * Word string argument type (no spaces allowed, allows `-._+`).
         * 
         * Suitable for identifiers, player names, etc.
         * 
         * @return The created type
         */
        function word(): CommandArgumentType<string, string>;
        /**
         * Greedy string argument type (consumes all remaining input, must be placed at the end of the command).
         * 
         * For example: in `/say <message>`, `<message>` could use a greedy string.
         * (However, in vanilla Minecraft, the `/say` command uses a {@linkcode message} type to support target selectors. See {@linkcode message})
         * 
         * @return The created type
         */
        function greedyString(): CommandArgumentType<string, string>;
        /**
         * Angle argument type (e.g., `~`, `~5`, `10`).
         * 
         * Represents horizontal rotation angle: -180.0 for north, -90.0 for east, 0.0 for south, 90.0 for west, 180.0 for north.
         * 
         * @return The created type; the return value is a `number` (angle value)
         */
        function angle(): CommandArgumentType<Alias.AngleArgument$SingleAngle, number>;
        /**
         * Block position argument type (e.g., `0 0 0`, `~1 ~2 ~-3`).
         * 
         * @return The created type; the return value is `BlockPos`
         */
        function blockPos(): CommandArgumentType<Alias.Coordinates, Alias.BlockPos>;
        /**
         * Block predicate argument type (e.g., `minecraft:stone`, `#minecraft:logs`, `minecraft:oak_fence[waterlogged=true]`).
         * 
         * @return The created type; the return value is `Predicate<BlockInWorld>`
         */
        function blockPredicate(): CommandArgumentType<Alias.BlockPredicateArgument$Result, Alias.Predicate<Alias.BlockInWorld>>;
        /**
         * Block state argument type (e.g., `minecraft:stone`, `minecraft:oak_fence[waterlogged=true]`).
         * 
         * @return The created type; the return value is `BlockInput`
         */
        function blockState(): CommandArgumentType<Alias.BlockInput, Alias.BlockInput>;
        /**
         * Color argument type (e.g., `red`, `blue`, `gold`).
         * 
         * Parses to a Minecraft chat color enum.
         * 
         * @return The created type; the return value is `ChatFormatting`
         */
        function color(): CommandArgumentType<Alias.ChatFormatting, Alias.ChatFormatting>;
        /**
         * Column position argument type (e.g., `0 0`, `~ ~`, `~5 ~-2`), for two-dimensional horizontal positions.
         * 
         * @return The created type; the return value is `ColumnPos`
         */
        function columnPos(): CommandArgumentType<Alias.Coordinates, Alias.ColumnPos>;
        /**
         * Text component argument type (e.g., `"Hello"`, `{"text":"Hello"}`).
         * 
         * @return The created type; the return value is `Component`
         */
        function component(): CommandArgumentType<Alias.Component, Alias.Component>;
        /**
         * Dimension argument type (e.g., `minecraft:overworld`).
         * 
         * Parses to the corresponding `ServerLevel` object.
         * 
         * @return The created type; the return value is `ServerLevel`
         */
        function dimension(): CommandArgumentType<Alias.ResourceLocation, Alias.ServerLevel>;
        /**
         * Single entity argument type (e.g., `@p`, `@e[type=player,limit=1]`, player name).
         * 
         * If the selection does not guarantee a single entity (e.g., `@e`), command parsing will fail.
         * 
         * @return The created type; the return value is `Entity`
         */
        function entity(): CommandArgumentType<Alias.CommandEntitySelector, Alias.Entity>;
        /**
         * Multiple entities argument type (e.g., `@a`, `@e[type=minecraft:pig]`, list of player names).
         * 
         * Returns a collection containing all selected entities.
         * 
         * @return The created type; the return value is `Collection<Entity>`
         */
        function entities(): CommandArgumentType<Alias.CommandEntitySelector, Alias.Collection<Alias.Entity>>;
        /**
         * Entity anchor argument type (e.g., `eyes`, `feet`).
         * 
         * Used in commands like `/teleport` to specify a position relative to an entity.
         * 
         * @return The created type; the return value is `EntityAnchorArgument$Anchor`
         */
        function entityAnchor(): CommandArgumentType<Alias.EntityAnchorArgument$Anchor, Alias.EntityAnchorArgument$Anchor>;
        /**
         * Float range argument type (e.g., `1.2`, `0.5..1.5`, `..2.0`, `3.0..`).
         * 
         * @return The created type; the return value is `MinMaxBounds$Doubles`
         */
        function floatRange(): CommandArgumentType<Alias.MinMaxBounds$Doubles, Alias.MinMaxBounds$Doubles>;
        /**
         * Function argument type (e.g., `minecraft:my_function`, `#minecraft:my_tag`).
         * 
         * Parses to one or more functions (supports tags).
         * 
         * @return The created type; the return value is `Collection<CommandFunction>`
         */
        function functions(): CommandArgumentType<Alias.FunctionArgument$Result, Alias.Collection<Alias.CommandFunction>>;
        /**
         * Game profile (player UUID and name) argument type.
         * 
         * Typically used in commands like `/give` that require player profiles.
         * 
         * @return The created type; the return value is `Collection<GameProfile>`
         */
        function gameProfile(): CommandArgumentType<Alias.GameProfileArgument$Result, Alias.Collection<Alias.GameProfile>>;
        /**
         * Game mode argument type (e.g., `survival`, `creative`, `adventure`, `spectator`).
         * 
         * @return The created type; the return value is `GameType`
         */
        function gameMode(): CommandArgumentType<Alias.GameType, Alias.GameType>;
        /**
         * Heightmap type argument type (e.g., `world_surface`, `ocean_floor`, `motion_blocking`).
         * 
         * @return The created type; the return value is `Heightmap$Types`
         */
        function heightmap(): CommandArgumentType<Alias.Heightmap$Types, Alias.Heightmap$Types>;
        /**
         * Integer range argument type (e.g., `5`, `1..10`, `..3`, `7..`).
         * 
         * @return The created type; the return value is `MinMaxBounds$Ints`
         */
        function intRange(): CommandArgumentType<Alias.MinMaxBounds$Ints, Alias.MinMaxBounds$Ints>;
        /**
         * Item predicate argument type (e.g., `minecraft:stone`, `#minecraft:logs`, `*`, `minecraft:stone{count:5}`).
         * 
         * @return The created type; the return value is `Predicate<ItemStack>`
         */
        function itemPredicate(): CommandArgumentType<Alias.BlockPredicateArgument$Result, Alias.Predicate<Alias.ItemStack>>;
        /**
         * Inventory slot argument type (e.g., `0`, `container.5`, `hotbar.0`, `inventory.0`).
         * 
         * Returns the integer index of the slot.
         * 
         * @return The created type; the return value is `number`
         */
        function itemSlot(): CommandArgumentType<number, number>;
        /**
         * Item argument type (e.g., `minecraft:stone`, `minecraft:diamond_sword{damage:5}`).
         * 
         * Returns an object containing the item's NBT information.
         * 
         * @return The created type; the return value is `ItemInput`
         */
        function item(): CommandArgumentType<Alias.ItemInput, Alias.ItemInput>;
        /**
         * Message argument type (supports selectors).
         * 
         * For example: `@p Hello!`.
         * 
         * @return The created type; the return value is `Component`
         */
        function message(): CommandArgumentType<Alias.MessageArgument$Message, Alias.Component>;
        /**
         * NBT compound tag argument type (e.g., `{name:"Steve", age:30}`).
         * 
         * @return The created type; the return value is `CompoundTag`
         */
        function nbtCompound(): CommandArgumentType<Alias.CompoundTag, Alias.CompoundTag>;
        /**
         * NBT path argument type (e.g., `foo`, `foo.bar`, `foo[0]`, `foo[]`).
         * 
         * Used in the `/data` command.
         * 
         * @return The created type; the return value is `NbtPathArgument$NbtPath`
         */
        function nbtPath(): CommandArgumentType<Alias.NbtPathArgument$NbtPath, Alias.NbtPathArgument$NbtPath>;
        /**
         * Arbitrary NBT tag argument type (can parse to numbers, strings, lists, or compounds).
         * 
         * @return The created type; the return value is `Tag`
         */
        function nbtTag(): CommandArgumentType<Alias.Tag, Alias.Tag>;
        /**
         * Read-only scoreboard objective argument type (e.g., `scoreboard`, `deaths`).
         * 
         * Returns a scoreboard objective object, cannot be used for write operations.
         * 
         * @return The created type; the return value is `Objective`
         */
        function objective(): CommandArgumentType<string, Alias.Objective>;
        /**
         * Writable scoreboard objective argument type (e.g., `scoreboard`, `deaths`).
         * 
         * Returns a scoreboard objective object that can be used to modify scores.
         * 
         * @return The created type; the return value is `Objective`
         */
        function writableObjective(): CommandArgumentType<string, Alias.Objective>;
        /**
         * Scoreboard criterion argument type (e.g., `dummy`, `minecraft.killed:minecraft.zombie`).
         * 
         * @return The created type; the return value is `ObjectiveCriteria`
         */
        function objectiveCriteria(): CommandArgumentType<Alias.ObjectiveCriteria, Alias.ObjectiveCriteria>;
        /**
         * Scoreboard operation type argument type (e.g., `+=`, `-=`, `*=`, `/=`, `=`, `><`).
         * 
         * @return The created type; the return value is `OperationArgument$Operation`
         */
        function operation(): CommandArgumentType<Alias.OperationArgument$Operation, Alias.OperationArgument$Operation>;
        /**
         * Particle argument type (e.g., `minecraft:poof`, `minecraft:block minecraft:stone`, `minecraft:dust 1.0 0.0 0.0 1.0`).
         * 
         * @return The created type; the return value is `ParticleOptions`
         */
        function particle(): CommandArgumentType<Alias.ParticleOptions, Alias.ParticleOptions>;
        /**
         * Resource key argument type (e.g., `minecraft:stone`), returns a `Holder.Reference` of the registry entry.
         * 
         * @param resKey The registry's `ResourceKey` (e.g., `Registries.ITEM`)
         * @return       The created type; the return value is `Holder.Reference<T>`
         */
        function resource<T>(resKey: Alias.ResourceKey<Alias.Registry<T>>): CommandArgumentType<Alias.Holder$Reference<T>, Alias.Holder$Reference<T>>;
        /**
         * Resource location argument type (e.g., `minecraft:stone`).
         * 
         * Returns only the identifier, does not validate existence in the registry.
         * 
         * @return The created type; the return value is `ResourceLocation`
         */
        function resourceLocation(): CommandArgumentType<Alias.ResourceLocation, Alias.ResourceLocation>;
        /**
         * Resource or tag argument type (e.g., `minecraft:stone` or `#minecraft:planks`).
         * 
         * Returns an object containing a resource key or tag.
         * 
         * @param resKey The registry's `ResourceKey`
         * @return       The created type; the return value is `ResourceOrTagArgument$Result<T>`
         */
        function resourceOrTag<T>(resKey: Alias.ResourceKey<Alias.Registry<T>>): CommandArgumentType<Alias.ResourceOrTagArgument$Result<T>, Alias.ResourceOrTagArgument$Result<T>>;
        /**
         * Resource key or tag key argument type, returns the key rather than an object.
         * 
         * @param resKey The registry's `ResourceKey`
         * @return       The created type; the return value is `ResourceOrTagKeyArgument$Result<T>`
         */
        function resourceOrTagKey<T>(resKey: Alias.ResourceKey<Alias.Registry<T>>): CommandArgumentType<Alias.ResourceOrTagKeyArgument$Result<T>, Alias.ResourceOrTagKeyArgument$Result<T>>;
        /**
         * Rotation argument type (e.g., `0 0`, `~ ~`, `~10 ~-20`), returns a `Coordinates` object containing azimuth and elevation.
         * 
         * @return The created type; the return value is `Coordinates`
         */
        function rotation(): CommandArgumentType<Alias.Coordinates, Alias.Coordinates>;
        /**
         * Single scoreboard holder argument type (e.g., `@p`, `Steve`, `@e[limit=1]`).
         * 
         * Returns the holder's name (string).
         * 
         * @return The created type; the return value is `string`
         */
        function scoreHolder(): CommandArgumentType<Alias.ScoreHolderArgument$Result, string>;
        /**
         * Multiple scoreboard holders argument type (e.g., `@a`, `Steve Alex`, `@e`).
         * 
         * Returns a collection of holder names.
         * 
         * @return The created type; the return value is `Collection<string>`
         */
        function scoreHolders(): CommandArgumentType<Alias.ScoreHolderArgument$Result, Alias.Collection<string>>;
        /**
         * Scoreboard display slot argument type (e.g., `list`, `sidebar`, `belowName`).
         * 
         * @return The created type; the return value is `number`
         */
        function scoreboardSlot(): CommandArgumentType<number, number>;
        /**
         * Swizzle (axis set) argument type (e.g., `x`, `xy`, `xz`, `xyz`), used with `//` or `~` coordinates.
         * 
         * @return The created type; the return value is `EnumSet<Direction$Axis>`
         */
        function swizzle(): CommandArgumentType<Alias.EnumSet<Alias.Direction$Axis>, Alias.EnumSet<Alias.Direction$Axis>>;
        /**
         * Team argument type (e.g., `red`, `blue`).
         * 
         * @return The created type; the return value is `PlayerTeam`
         */
        function team(): CommandArgumentType<string, Alias.PlayerTeam>;
        /**
         * Structure mirror argument type (e.g., `none`, `left_right`, `front_back`).
         * 
         * @return The created type; the return value is `Mirror`
         */
        function templateMirror(): CommandArgumentType<Alias.Mirror, Alias.Mirror>;
        /**
         * Structure rotation argument type (e.g., `none`, `clockwise_90`, `clockwise_180`, `counterclockwise_90`).
         * 
         * @return The created type; the return value is `Rotation`
         */
        function templateRotation(): CommandArgumentType<Alias.Rotation, Alias.Rotation>;
        /**
         * Time argument type (e.g., `10t`, `5s`, `1d`), returns an integer in ticks.
         * 
         * @param minimum The minimum allowed time (in ticks), defaults to `0`
         * @return The created type; the return value is `number`
         */
        function time(minimum: number = 0): CommandArgumentType<number, number>;
        /**
         * UUID argument type (e.g., `550e8400-e29b-41d4-a716-446655440000`).
         * 
         * @return The created type; the return value is `UUID`
         */
        function uuid(): CommandArgumentType<Alias.UUID, Alias.UUID>;
        /**
         * Two-dimensional vector argument type (e.g., `0 0`, `~ ~`, `^ ^`), for relative world or local coordinates.
         * 
         * @param centerCorrect Whether to apply center correction (e.g., adjust `0 0` to `0.5 0.5`)
         * @return              The created type; the return value is `Vec2`
         */
        function vec2(centerCorrect: boolean = false): CommandArgumentType<Alias.Coordinates, Alias.Vec2>;
        /**
         * Three-dimensional vector argument type (e.g., `0 0 0`, `~ ~ ~`, `^ ^ ^`).
         * 
         * @param centerCorrect Whether to apply center correction (e.g., adjust `0 0 0` to `0.5 0.5 0.5`)
         * @return              The created type; the return value is `Vec3`
         */
        function vec3(centerCorrect: boolean = false): CommandArgumentType<Alias.Coordinates, Alias.Vec3>;
    }

    /**
     * Definition of a command argument type. Contains two functions: `getType` to obtain the argument's type during command building, and `getValue` to extract the argument's value from the command context.
     */
    type CommandArgumentType<T, R> = {
        /**
         * Gets the argument's type during command building. This type is used in the {@linkcode CmdBuilder.argType} method to specify the argument type.
         * 
         * @param context The command build context
         * @return        The argument's type during command building
         */
        getType(context: Alias.CommandBuildContext): Alias.ArgumentType<T>,
        /**
         * Extracts the argument's value from the command execution context. This function is called when the command is executed. `context` is the command execution context, and `argName` is the argument name (as specified by `<argName>` in the command format).
         * 
         * @param context The command execution context
         * @param argName The argument name
         */
        getValue(context: Alias.CommandContext<Alias.CommandSourceStack>, argName: string): R
    };

    /**
     * The format of objects in the array returned by {@linkcode parseCommandUsage}.
     */
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

    /**
     * Internal method used by `RegCmd` to parse command formats.
     * 
     * @param usage A string representing the command format
     * @return      An array of parsed command arguments
     */
    function parseCommandUsage(usage: string): ParsedArgument[];
    /**
     * Starts a command definition. After definition, no `build` method is needed (in fact, there is none); these commands are automatically registered.
     * 
     * ## Command Format:
     * 
     * | Format               | Description                                                                        |
     * |----------------------|------------------------------------------------------------------------------------|
     * |`literal`             | A command literal. Must be typed exactly as shown                                  |
     * |`[literal]`           | Indicates that the literal is optional                                             |
     * |`(literalA\|literalB)`| Choose one of the literals. Use `\|` to connect more literals for selection        |
     * |`[literalA\|literalB]`| Optional version of `(literalA\|literalB)`                                         |
     * |`<argumentName>`      | A command argument. Input must follow the format of the corresponding argument type|
     * |`[<argumentName>]`    | Optional version of `<argumentName>`                                               |
     * 
     * @param usage A string representing the command format
     * @return      The created {@linkcode CmdBuilder} for building the command
     * 
     * @example
     * RegCmd.defineCommmand("/example");
     * RegCmd.defineCommmand("/example literal");
     * RegCmd.defineCommmand("/example <arg>");
     * RegCmd.defineCommmand("/example (hello|goodbye)");
     * RegCmd.defineCommmand("/example [optional]");
     * RegCmd.defineCommmand("/example [<optionalArg>]");
     * RegCmd.defineCommmand("/example [hello|goodbye|but-optional]");
     */
    function defineCommand(usage: string): CmdBuilder<{}>;

}
