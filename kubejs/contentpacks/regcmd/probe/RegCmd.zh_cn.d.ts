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
 * RegCmd 是一个简化命令注册的 KubeJS JavaScript 库。
 * 
 * ## 使用
 * 
 * ### 基础命令
 * 
 * 使用 {@linkcode RegCmd.defineCommand} 以开始定义命令。
 * 
 * 以一个简单的 `/example` 命令为例：
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/example") // 命令格式
 * >     .executes((context) => {
 * >         // context.getSource().sendSuccess(Component, boolean) 是 KubeJS 提供的标准的返回命令成功提示的方法
 * >         // 下面的 true 表示会被广播给管理员，例如 /gamemode 这类作弊命令需要通知管理员的会使用 true
 * >         // 而其它一些普通命令没必要通知管理员的可以填入 false
 * >         context.getSource().sendSuccess(Component.literal("命令被执行！"), true);
 * >         // 命令返回值，大于 0 表示成功，0 表示失败
 * >         return 1;
 * >     });
 * > ```
 * 
 * ### 字面量
 * 
 * 若希望在命令中加入字面量，使用以下格式：
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/example literal")
 * >     .executes((context) => {
 * >         context.getSource().sendSuccess(Component.literal("你调用了 /example literal！"), true);
 * >         return 1;
 * >     });
 * > ```
 * 
 * 这样定义的命令必须以 `/example literal` 被调用，不能更改 `literal` 这个单词。
 * 
 * ### 选择字面量
 * 
 * 可以通过 `(字面量A|字面量B)` 的形式添加选择字面量。下面的命令要么以 `/greet hello` 被调用，要么以 `/greet goodbye` 被调用：
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/greet (hello|goodbye)")
 * >     .executes((context) => {
 * >         context.getSource().sendSuccess(Component.literal("但是我不知道是 hello 还是 goodbye"), true);
 * >         return 1;
 * >     });
 * > ```
 * 
 * 为了知道选择的字面量，使用回调函数的第三个参数来获取选择的字面量：
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/greet (hello|goodbye)")
 * >     .executes((context, args, literals) => {
 * >         const greetType = literals[1]; // 获取索引为 1 的字面量
 * >         if (greetType == "hello") {
 * >             context.getSource().sendSuccess(Component.literal("你好啊！"), true);
 * >         } else {
 * >             context.getSource().sendSuccess(Component.literal("再见！"), true);
 * >         }
 * >         return 1;
 * >     });
 * > ```
 * 
 * ### 字面量索引
 * 
 * 字面量的索引以根命令为 `0` 开始计数，例如：
 * 
 * > ```text
 * > /example literal (hello|goodbye) third
 * >  0       1       2               3
 * > ```
 * 
 * 这就是说：
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/example literal (hello|goodbye) third")
 * >     .executes((context, args, literal) => {
 * >         literal[0] // -> "example"
 * >         literal[1] // -> "literal"
 * >         literal[2] // -> "hello" 或 "goodbye"，取决于玩家调用命令时的输入
 * >         literal[3] // -> "third"
 * >     });
 * > ```
 * 
 * ### 命令参数
 * 
 * 命令格式中可以使用 `<参数名>` 来定义参数，并使用 {@linkcode CmdBuilder.argType} 来定义参数类型：
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/double <num>")
 * >     // 定义参数 num 是一个整数类型：
 * >     .argType("num", RegCmd.ArgTypes.integer())
 * >     .executes((context, args) => {
 * >         // args 中已经帮你加载好了命令中的参数
 * >         const { num } = args;
 * >         let result = num * 2;
 * >         context.getSource().sendSuccess(Component.literal(result.toFixed()), true);
 * >         return result;
 * >     });
 * > ```
 * 
 * 也可以定义多个参数，以及与字面量混合使用：
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
 * 这里出现的参数类型（{@linkcode ArgTypes.integer}，{@linkcode ArgTypes.integerAbove}）以及更多可用的参数类型，参见 {@linkcode ArgTypes}。
 * 
 * ### 可选字面量与可选参数
 * 
 * 使用 `[]` 表示可选。各命令格式的可选变体如下表所示：
 * 
 * |      命令格式      |      可选变体      |
 * |:-------------------|:-------------------|
 * |`字面量`            |`[字面量]`          |
 * |`(字面量A\|字面量B)`|`[字面量A\|字面量B]`|
 * |`<参数名>`          |`[<参数名>]`        |
 * 
 * 当一个可选参数未在命令填入时指定，则该项为 `null`。
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/greet [hello|goodbye]")
 * >     .executes((context, args, literals) => {
 * >         const greetType = literals[1];
 * >         if (greetType == null) {
 * >             context.getSource().sendSuccess(Component.literal("我不知道你是刚来还是要走 :("), true);
 * >             return 0;
 * >         }
 * >         if (greetType == "hello") {
 * >             context.getSource().sendSuccess(Component.literal("你好啊！"), true);
 * >         } else {
 * >             context.getSource().sendSuccess(Component.literal("再见！"), true);
 * >         }
 * >         return 1;
 * >     });
 * > ```
 * 
 * ### 可选字面量与可选参数的默认值
 * 
 * {@linkcode CmdBuilder.argDefault} 与 {@linkcode CmdBuilder.literalDefault} 能够分别设置可选参数与可选字面量的默认值。
 * 
 * > ```javascript
 * > RegCmd.defineCommand("/calc add <int1> [<int2>]")
 * >     .argType("int1", RegCmd.ArgTypes.integerAbove(0))
 * >     .argType("int2", RegCmd.ArgTypes.integerAbove(0)).argDefault("int2", () => 0) // 若 int2 未指定，则默认为 0
 * >     .executes((context, args) => {
 * >         const { int1, int2 } = args;
 * >         let result = int1 + int2;
 * >         context.getSource().sendSuccess(Component.literal(result.toFixed()), true);
 * >         return result;
 * >     });
 * > RegCmd.defineCommand("/greet [hello|goodbye]")
 * >     .literalDefault(1, "hello") // 若索引为 1 的字面量未选择，则默认为 hello
 * >     // 不能为无法选择的字面量设置默认值，例如这里索引 0 处的 greet
 * >     .executes((context, args, literals) => {
 * >         if (literals[1] == "hello") {
 * >             context.getSource().sendSuccess(Component.literal("你好！"), true);
 * >         } else {
 * >             context.getSource().sendSuccess(Component.literal("再见！"), true);
 * >         }
 * >         return 1;
 * >     });
 * > ```
 * 
 * 可以在可选参数后面放置必选参数：
 * 
 * > ```javascript
 * > let secretValue = 0;
 * > RegCmd.defineCommand("/secret [set] <value>")
 * >     .argType("value", RegCmd.ArgTypes.integer())
 * >     .executes((context, args, literals) => {
 * >         if (literals[1] == null) {
 * >             context.getSource().sendSuccess(Component.literal("你的秘密数值是：" + secretValue), true);
 * >         } else {
 * >             const newValue = args.value;
 * >             secretValue = newValue;
 * >             context.getSource().sendSuccess(Component.literal("已将秘密设置设置为：" + secretValue), true);
 * >         }
 * >         return 1;
 * >     });
 * > ```
 * 
 * `/secret [set] <value>` 表示：可以以 `/secret` 调用（因为 `[set]` 可选）；
 * 但是不能以 `/secret set` 调用，因为 `[set]` 可选字面量后有一个必选参数 `<value>`。
 * 
 * 即：要么以 `/secret` 调用，要么以 `/secret set <value>` 调用。
 * 
 * 这里值得注意的是：当以 `/secret` 调用时，`<value>` 的值将会为 `null`。
 * 也就是说，一个必选参数**并不一定恒不为 `null`**；如果这个必选参数前面存在可选参数，那么这个必选参数是有可能为 `null` 的。
 * 
 * ### 命令要求
 * 
 * 有些命令带有作弊属性，可能对服务器上其它玩家造成影响，
 * 这时就可以通过 {@linkcode CmdBuilder.requires} 来设置要求以限定只有满足要求的玩家才能执行命令。
 * 
 * ### 命令分支
 * 
 * 使用 {@linkcode CmdBuilder.or} 或 {@linkcode CmdBuilder.then} 方法来创建分支。
 * 具体使用方法参见这两个方法的文档。
 * 
 * ## 类型定义
 * 
 * 由于在 Minecraft 1.20.1 版本上同时存在 ProbeJS 6 与 ProbeJS 7，
 * 它们生成的类型定义文件格式大相径庭。
 * 为了获得正确的类型提示，可以前往 {@linkcode Alias} 命名空间更改别名以匹配你自己的 ProbeJS 生成的类型定义。
 * 
 * ## KubeLoader
 * @since 1.0.1
 * 
 * 该模块支持通过 KubeLoader 加载。
 * 当使用 KubeLoader 加载时，使用：
 * 
 * > ```javascript
 * > const RegCmd = ContentPacks.getShared("pelemenguin.regcmd");
 * > // 或更严谨地：
 * > const RegCmd = ContentPacks.getShared("server", "pelemenguin.regcmd");
 * > ```
 * 
 * 来将其加载的你自己的脚本中。
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
     * 为文档而预定义的别名。
     * 
     * 如果这些与 ProbeJS 生成的文件不匹配，
     * 你可以更改这里以确保你的文档能正常工作。
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
     * 构建命令定义的类。
     */
    class CmdBuilder<P extends {[argName: string]: CommandArgumentType<unknown, unknown>}> {
        /**
         * 构建一个新的 `CmdBuilder`。
         * 
         * **注意**：通过构造函数创建的 `CmdBuilder` 不会主动注册。改为使用 {@linkcode defineCommand}。
         * 
         * @param commandArguments 通过 {@linkcode parseCommandUsage} 获得的命令参数数组
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
         * 设置命令的执行函数。
         * 
         * 执行函数需要三个参数：`context`、`args`，与 `literals`。
         * 其中，`context` 是命令执行的上下文，与 KubeJS 提供的命令注册中 `executes` 方法所需要的回调的参数相同。
         * `args` 是提取出的命令参数，`literals` 是当前命令分支的字面量数组。
         * 
         * 前往 {@link RegCmd `RegCmd` 的模块文档}以查看更详细的用法。
         * 
         * @param executeFunction 执行函数
         * @return                当前 `CmdBuilder` 实例
         */
        executes(executeFunction: (context: Alias.CommandContext<Alias.CommandSourceStack>, args: Readonly<{[argName in keyof P]: P[argName] extends CommandArgumentType<any, infer R> ? R : never}>, literals: (string | null)[]) => number): this;
        /**
         * 清除当前所有命令要求。
         * 
         * 适用于当 {@linkcode or} 或 {@linkcode then} 方法产生的分支与根命令要求不相同时。
         * 
         * @return 当前 `CmdBuilder` 实例
         */
        clearRequirements(): this;
        /**
         * 添加一个谓词，用于检查命令执行的权限等要求。
         * 
         * 例如：
         * 
         * > ```javascript
         * > RegCmd.defineCommand("/accelerate <motion>")
         * >     .argType("motion", RegCmd.ArgTypes.vec3())
         * >     // 玩家至少有 2 级权限才能执行（一般作弊命令的权限）
         * >     .requires(s => s.hasPermission(2))
         * >     .executes((context, args) => {
         * >         let player = context.getSource().getPlayer();
         * >         if (player == null) {
         * >             context.getSource().sendFailure(Component.literal("调用者不是玩家"));
         * >             return 0;
         * >         }
         * >         player.addDeltaMovement(args.motion);
         * >         context.getSource().sendSuccess(Component.literal("已对调用者添加加速度"), true);
         * >         return 1;
         * >     });
         * > ```
         * 
         * 或者使用预设好的 {@linkcode CmdBuilder.requiresOperator} 方法，这与 `.requires(s => s.hasPermission(2))` 是等价的：
         * 
         * > ```javascript
         * > RegCmd.defineCommand("/accelerate <motion>")
         * >     .argType("motion", RegCmd.ArgTypes.vec3())
         * >     .requiresOperator()
         * >     // 后续内容
         * > ```
         * 
         * @param requirementPredicate 一个函数，接受一个 `CommandSourceStack` 作为参数，并返回一个布尔值，表示是否满足执行命令的要求。
         * @return                     当前 `CmdBuilder` 实例
         */
        requires(requirementPredicate: (context: Alias.CommandSourceStack) => boolean): this;
        /**
         * 要求执行命令的玩家至少具有权限等级 1。
         * 
         * 原版 Minecraft 中没有任何命令是此权限等级的。
         * 
         * @return 当前 `CmdBuilder` 实例
         */
        requiresModerator(): this;
        /**
         * 要求执行命令的玩家至少具有操作员权限（权限等级 2）。
         * 
         * 原版 Minecraft 中大多数作弊命令（如 `/gamemode`）都需要此权限等级。
         * 
         * @return 当前 `CmdBuilder` 实例
         */
        requiresOperator(): this;
        /**
         * 要求执行命令的玩家至少具有管理员权限（权限等级 3）。
         * 
         * 原版 Minecraft 中一些管理服务器的命令（如 `/op`，`/deop` 等）需要此权限等级。
         * 
         * @return 当前 `CmdBuilder` 实例
         */
        requiresServerAdmin(): this;
        /**
         * 要求执行命令的玩家必须是服务器拥有者（权限等级 4）。
         * 
         * 原版 Minecraft 中一些直接控制服务器的命令（如 `/stop`）需要此权限等级。
         * 
         * @return 当前 `CmdBuilder` 实例
         */
        requiresServerOwner(): this;
        /**
         * 指定一个命令中的参数的类型。
         * 
         * @param argName 参数名
         * @param type    参数类型，使用 {@linkcode ArgTypes} 中的方法来获得各种类型的参数
         * @return        当前 `CmdBuilder` 实例，并更新类型参数
         */
        argType<S extends string, T, R>(argName: S, type: CommandArgumentType<T, R>): CmdBuilder<Omit<P, S> & {[s in S]: CommandArgumentType<T, R>}>;
        /**
         * 为一个可选参数设置默认值。
         * 
         * @param argName      参数名
         * @param defaultValue 一个函数，返回当该参数未在命令中指定时的默认值。参数类型与 {@linkcode argType} 中为该参数设置的类型一致。
         * @return             当前 `CmdBuilder` 示例
         */
        argDefault<S extends keyof P>(argName: S, defaultValue: () => P[S] extends CommandArgumentType<any, infer R> ? R : never): this;
        /**
         * 为一个参数设置建议函数。当玩家在聊天框输入命令时，
         * 建议函数会被调用以提供输入补全。
         * 
         * > ```javascript
         * > RegCmd.defineCommand("/greet <arg> [literal]")
         * >     .argType("arg", RegCmd.ArgTypes.string())
         * >     .argSuggests("arg", (context, builder, args, literals) => {
         * >         // `literals` 为 [example] 而非 [example, arg, literal]
         * >         // 因为我们无法获取位于这个参数之后的字面量
         * >
         * >         builder.suggest("hello");
         * >         builder.suggest("goodbye");
         * >         // 现在玩家输入参数 <arg> 会看到补全 "hello" 与 "goodbye"
         * >     })
         * >     .executes((context, args, literals) => {
         * >         // 你自己的 executes 函数
         * >     });
         * > ```
         * 
         * @param argName    参数名
         * @param suggestion 建议函数
         * @return           当前 `CmdBuilder` 示例
         * 
         * @since 1.0.1
         */
        argSuggests<S extends keyof P>(argName: S, suggestion: (context: Alias.CommandContext<Alias.CommandSourceStack>, builder: Alias.SuggestionsBuilder, args: Readonly<{[argName in keyof P]: P[argName] extends CommandArgumentType<any, infer R> ? R : never}>, literals: (string | null)) => void): this;
        /**
         * 为一个可选字面量设置默认值。
         * 
         * @param index   字面量索引
         * @param literal 默认值
         */
        literalDefault(index: number, literal: string): this;
        /**
         * 创建一个与当前命令平行的分支。新分支与当前分支共享父命令和命令参数，但不共享字面量和执行函数。
         * 
         * 例如：
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
         * >     // 通过 or 创建的平行命令分支会继承原先的所有参数类型与默认值
         * >     .executes((context, args) => {
         * >         const { int1, int2 } = args;
         * >         let result = int1 - int2;
         * >         context.getSource().sendSuccess(Component.literal(result.toFixed()), true);
         * >         return result;
         * >     });
         * > ```
         * 
         * @param usage 新分支的命令格式，格式规则与 {@linkcode defineCommand} 中的命令格式相同
         * @return      新的 `CmdBuilder` 实例，代表新分支
         */
        or(usage: string): CmdBuilder<P>;
        /**
         * 创建一个新的子命令分支。新分支以当前命令为父命令，并继承当前命令的所有参数类型与默认值，但不共享字面量和执行函数。
         * 
         * 例如：
         * 
         * > ```javascript
         * > let secret = 0;
         * > RegCmd.defineCommand("/secret")
         * >     .executes((context) => {
         * >         context.getSource().sendSuccess(Component.literal("你的秘密数值是：" + secret), true);
         * >         return 1;
         * >     })
         * >     .then("set <value>")
         * >     .argType("value", RegCmd.ArgTypes.integer())
         * >     .executes((context, args) => {
         * >         const newValue = args.value;
         * >         secret = newValue;
         * >         context.getSource().sendSuccess(Component.literal("已将秘密设置设置为：" + secret), true);
         * >     });
         * > ```
         * 
         * 这实际上会创建两个命令用法：`/secret` 与 `/secret set <value>`。
         * 
         * **注意**：自变量索引是从子命令分支开始重新计算的，也就是说，在上面的例子中，`<value>` 的索引为 `1`，而不是 `2`。
         * 
         * > ```javascript
         * > let secret = 0;
         * > RegCmd.defineCommand("/secret")
         * >     .executes((context, args, literals) => {
         * >         literals[0]; // -> "secret"
         * >     })
         * >     .then("set <value>")
         * >     .executes((context, args, literals) => {
         * >         literals[0]; // -> "set"，而不是 "secret"
         * >         literals[1]; // -> null，因为 `set` 是一个参数，而不是一个字面量
         * >     });
         * > ```
         * 
         * @param usage 新分支的命令格式，格式规则与 {@linkcode defineCommand} 中的命令格式相同
         * @return      新的 `CmdBuilder` 实例，代表新分支
         */
        then(usage: string): CmdBuilder<P>;
        /**
         * 将当前 `CmdBuilder` 实例注册到一个 `CommandRegistryEventJS` 事件中。
         * 
         * 通常不需要直接调用这个方法，因为通过 {@linkcode defineCommand} 产生的 `CmdBuilder` 会在命令注册时自动调用它。
         * 
         * @param event      要注册到的事件
         * @param registerer 一个函数，接受一个 `ArgumentBuilder` 作为参数，用于将当前命令的根节点注册到事件中。对于根命令，这个 `registerer` 是 `(c) => event.register(c)`
         * @param isRoot     一个布尔值，表示当前 `CmdBuilder` 是否为根命令。
         */
        registerToEvent(event: Alias.CommandRegistryEventJS, registerer: (command: Alias.ArgumentBuilder<Alias.CommandSourceStack, any>) => void, isRoot: boolean): void;
    }

    /**
     * 所有内置命令参数类型。
     */
    namespace ArgTypes {
        /**
         * 布尔值参数类型。
         * 
         * 若命令参数 `<arg>` 为该类型，则 `<arg>` 必须为 `true` 或 `false`。
         * 
         * @return 创建的类型
         */
        function bool(): CommandArgumentType<boolean, boolean>;
        /**
         * 双精度浮点数参数类型（无范围限制）。
         * 
         * 可接受任意双精度浮点数（例如 `1.5`、`-2.3`）。
         * 
         * @return 创建的类型
         */
        function double(): CommandArgumentType<number, number>;
        /**
         * 双精度浮点数参数类型（限定范围，包含端点）。
         * 
         * @param min 最小值（包含）
         * @param max 最大值（包含）
         * @return 创建的类型
         */
        function doubleBetween(min: number, max: number): CommandArgumentType<number, number>;
        /**
         * 双精度浮点数参数类型（大于等于最小值）。
         * 
         * @param min 最小值（包含）
         * @return 创建的类型
         */
        function doubleAbove(min: number): CommandArgumentType<number, number>;
        /**
         * 双精度浮点数参数类型（小于等于最大值）。
         * 
         * @param max 最大值（包含）
         * @return 创建的类型
         */
        function doubleBelow(max: number): CommandArgumentType<number, number>;
        /**
         * 单精度浮点数参数类型（无范围限制）。
         * 
         * @return 创建的类型
         */
        function float(): CommandArgumentType<number, number>;
        /**
         * 单精度浮点数参数类型（限定范围，包含端点）。
         * 
         * @param min 最小值（包含）
         * @param max 最大值（包含）
         * @return 创建的类型
         */
        function floatBetween(min: number, max: number): CommandArgumentType<number, number>;
        /**
         * 单精度浮点数参数类型（大于等于最小值）。
         * 
         * @param min 最小值（包含）
         * @return 创建的类型
         */
        function floatAbove(min: number): CommandArgumentType<number, number>;
        /**
         * 单精度浮点数参数类型（小于等于最大值）。
         * 
         * @param max 最大值（包含）
         * @return 创建的类型
         */
        function floatBelow(max: number): CommandArgumentType<number, number>;
        /**
         * 整数参数类型（无范围限制）。
         * 
         * @return 创建的类型
         */
        function integer(): CommandArgumentType<number, number>;
        /**
         * 整数参数类型（限定范围，包含端点）。
         * 
         * @param min 最小值（包含）
         * @param max 最大值（包含）
         * @return 创建的类型
         */
        function integerBetween(min: number, max: number): CommandArgumentType<number, number>;
        /**
         * 整数参数类型（大于等于最小值）。
         * 
         * @param min 最小值（包含）
         * @return 创建的类型
         */
        function integerAbove(min: number): CommandArgumentType<number, number>;
        /**
         * 整数参数类型（小于等于最大值）。
         * 
         * @param max 最大值（包含）
         * @return 创建的类型
         */
        function integerBelow(max: number): CommandArgumentType<number, number>;
        /**
         * 长整型参数类型（无范围限制）。
         * 
         * @return 创建的类型
         */
        function long(): CommandArgumentType<number, number>;
        /**
         * 长整型参数类型（限定范围，包含端点）。
         * 
         * @param min 最小值（包含）
         * @param max 最大值（包含）
         * @return 创建的类型
         */
        function longBetween(min: number, max: number): CommandArgumentType<number, number>;
        /**
         * 长整型参数类型（大于等于最小值）。
         * 
         * @param min 最小值（包含）
         * @return 创建的类型
         */
        function longAbove(min: number): CommandArgumentType<number, number>;
        /**
         * 长整型参数类型（小于等于最大值）。
         * 
         * @param max 最大值（包含）
         * @return 创建的类型
         */
        function longBelow(max: number): CommandArgumentType<number, number>;
        /**
         * 普通字符串参数类型（允许空格，但需要用双引号包裹）。
         * 
         * 例如：`"hello world"`。
         * 
         * @return 创建的类型
         */
        function string(): CommandArgumentType<string, string>;
        /**
         * 单词字符串参数类型（不允许空格，允许 `-._+`）。
         * 
         * 适合用于标识符、玩家名等。
         * 
         * @return 创建的类型
         */
        function word(): CommandArgumentType<string, string>;
        /**
         * 贪婪字符串参数类型（消耗剩余所有输入，必须放在命令末尾）。
         * 
         * 例如：`/say <message>` 中 `<message>` 可使用贪婪字符串。
         * （但是在原版 Minecraft 中，`/say` 命令的参数为一个 {@linkcode message} 类型以支持目标选择器。参见 {@linkcode message}）
         * 
         * @return 创建的类型
         */
        function greedyString(): CommandArgumentType<string, string>;
        /**
         * 角度参数类型（例如 `~`、`~5`、`10`）。
         * 
         * 表示水平旋转角度。-180.0为北，-90.0为东，0.0为南，90.0为西，180.0为北。
         * 
         * @return 创建的类型，返回值类型为 `number`（角度值）
         */
        function angle(): CommandArgumentType<Alias.AngleArgument$SingleAngle, number>;
        /**
         * 方块坐标参数类型（例如 `0 0 0`、`~1 ~2 ~-3`）。
         * 
         * @return 创建的类型，返回值类型为 `BlockPos`
         */
        function blockPos(): CommandArgumentType<Alias.Coordinates, Alias.BlockPos>;
        /**
         * 方块谓词参数类型（例如 `minecraft:stone`、`#minecraft:logs`、`minecraft:oak_fence[waterlogged=true]`）。
         * 
         * @return 创建的类型，返回值类型为 `Predicate<BlockInWorld>`
         */
        function blockPredicate(): CommandArgumentType<Alias.BlockPredicateArgument$Result, Alias.Predicate<Alias.BlockInWorld>>;
        /**
         * 方块状态参数类型（例如 `minecraft:stone`、`minecraft:oak_fence[waterlogged=true]`）。
         * 
         * @return 创建的类型，返回值类型为 `BlockInput`
         */
        function blockState(): CommandArgumentType<Alias.BlockInput, Alias.BlockInput>;
        /**
         * 颜色参数类型（例如 `red`、`blue`、`gold`）。
         * 
         * 解析为 Minecraft 聊天颜色枚举。
         * 
         * @return 创建的类型，返回值类型为 `ChatFormatting`
         */
        function color(): CommandArgumentType<Alias.ChatFormatting, Alias.ChatFormatting>;
        /**
         * 列坐标参数类型（例如 `0 0`、`~ ~`、`~5 ~-2`），用于二维水平位置。
         * 
         * @return 创建的类型，返回值类型为 `ColumnPos`
         */
        function columnPos(): CommandArgumentType<Alias.Coordinates, Alias.ColumnPos>;
        /**
         * 文本组件参数类型（例如 `"Hello"`、`{"text":"Hello"}`）。
         * 
         * @return 创建的类型，返回值类型为 `Component`
         */
        function component(): CommandArgumentType<Alias.Component, Alias.Component>;
        /**
         * 维度参数类型（例如 `minecraft:overworld`）。
         * 
         * 解析为对应的 `ServerLevel` 对象。
         * 
         * @return 创建的类型，返回值类型为 `ServerLevel`
         */
        function dimension(): CommandArgumentType<Alias.ResourceLocation, Alias.ServerLevel>;
        /**
         * 单个实体参数类型（例如 `@p`、`@e[type=player,limit=1]`、玩家名）。
         * 
         * 若选择的目标不能保证为单个实体（例如 `@e`），则命令解析将失败。
         * 
         * @return 创建的类型，返回值类型为 `Entity`
         */
        function entity(): CommandArgumentType<Alias.CommandEntitySelector, Alias.Entity>;
        /**
         * 多个实体参数类型（例如 `@a`、`@e[type=minecraft:pig]`、玩家名列表）。
         * 
         * 返回包含所有选中实体的集合。
         * 
         * @return 创建的类型，返回值类型为 `Collection<Entity>`
         */
        function entities(): CommandArgumentType<Alias.CommandEntitySelector, Alias.Collection<Alias.Entity>>;
        /**
         * 实体锚点参数类型（例如 `eyes`、`feet`）。
         * 
         * 用于 `/teleport` 等命令中指定相对于实体的位置。
         * 
         * @return 创建的类型，返回值类型为 `EntityAnchorArgument$Anchor`
         */
        function entityAnchor(): CommandArgumentType<Alias.EntityAnchorArgument$Anchor, Alias.EntityAnchorArgument$Anchor>;
        /**
         * 浮点数范围参数类型（例如 `1.2`、`0.5..1.5`、`..2.0`、`3.0..`）。
         * 
         * @return 创建的类型，返回值类型为 `MinMaxBounds$Doubles`
         */
        function floatRange(): CommandArgumentType<Alias.MinMaxBounds$Doubles, Alias.MinMaxBounds$Doubles>;
        /**
         * 函数参数类型（例如 `minecraft:my_function`、`#minecraft:my_tag`）。
         * 
         * 解析为一个或多个函数（支持标签）。
         * 
         * @return 创建的类型，返回值类型为 `Collection<CommandFunction>`
         */
        function functions(): CommandArgumentType<Alias.FunctionArgument$Result, Alias.Collection<Alias.CommandFunction>>;
        /**
         * 游戏档案（玩家 UUID 和名称）参数类型。
         * 
         * 通常用于 `/give` 等需要玩家档案的命令。
         * 
         * @return 创建的类型，返回值类型为 `Collection<GameProfile>`
         */
        function gameProfile(): CommandArgumentType<Alias.GameProfileArgument$Result, Alias.Collection<Alias.GameProfile>>;
        /**
         * 游戏模式参数类型（例如 `survival`、`creative`、`adventure`、`spectator`）。
         * 
         * @return 创建的类型，返回值类型为 `GameType`
         */
        function gameMode(): CommandArgumentType<Alias.GameType, Alias.GameType>;
        /**
         * 高度图类型参数类型（例如 `world_surface`、`ocean_floor`、`motion_blocking`）。
         * 
         * @return 创建的类型，返回值类型为 `Heightmap$Types`
         */
        function heightmap(): CommandArgumentType<Alias.Heightmap$Types, Alias.Heightmap$Types>;
        /**
         * 整数范围参数类型（例如 `5`、`1..10`、`..3`、`7..`）。
         * 
         * @return 创建的类型，返回值类型为 `MinMaxBounds$Ints`
         */
        function intRange(): CommandArgumentType<Alias.MinMaxBounds$Ints, Alias.MinMaxBounds$Ints>;
        /**
         * 物品谓词参数类型（例如 `minecraft:stone`、`#minecraft:logs`、`*`、`minecraft:stone{count:5}`）。
         * 
         * @return 创建的类型，返回值类型为 `Predicate<ItemStack>`
         */
        function itemPredicate(): CommandArgumentType<Alias.BlockPredicateArgument$Result, Alias.Predicate<Alias.ItemStack>>;
        /**
         * 物品栏槽位参数类型（例如 `0`、`container.5`、`hotbar.0`、`inventory.0`）。
         * 
         * 返回槽位的整数索引。
         * 
         * @return 创建的类型，返回值类型为 `number`
         */
        function itemSlot(): CommandArgumentType<number, number>;
        /**
         * 物品参数类型（例如 `minecraft:stone`、`minecraft:diamond_sword{damage:5}`）。
         * 
         * 返回包含物品 NBT 信息的对象。
         * 
         * @return 创建的类型，返回值类型为 `ItemInput`
         */
        function item(): CommandArgumentType<Alias.ItemInput, Alias.ItemInput>;
        /**
         * 消息参数类型（支持选择器）。
         * 
         * 例如 `@p Hello!`。
         * 
         * @return 创建的类型，返回值类型为 `Component`
         */
        function message(): CommandArgumentType<Alias.MessageArgument$Message, Alias.Component>;
        /**
         * NBT 复合标签参数类型（例如 `{name:"Steve", age:30}`）。
         * 
         * @return 创建的类型，返回值类型为 `CompoundTag`
         */
        function nbtCompound(): CommandArgumentType<Alias.CompoundTag, Alias.CompoundTag>;
        /**
         * NBT 路径参数类型（例如 `foo`、`foo.bar`、`foo[0]`、`foo[]`）。
         * 
         * 用于 `/data` 命令。
         * 
         * @return 创建的类型，返回值类型为 `NbtPathArgument$NbtPath`
         */
        function nbtPath(): CommandArgumentType<Alias.NbtPathArgument$NbtPath, Alias.NbtPathArgument$NbtPath>;
        /**
         * 任意 NBT 标签参数类型（可解析为数字、字符串、列表或复合标签）。
         * 
         * @return 创建的类型，返回值类型为 `Tag`
         */
        function nbtTag(): CommandArgumentType<Alias.Tag, Alias.Tag>;
        /**
         * 只读计分板目标参数类型（例如 `scoreboard`、`deaths`）。
         * 
         * 返回计分板目标对象，不能用于写操作。
         * 
         * @return 创建的类型，返回值类型为 `Objective`
         */
        function objective(): CommandArgumentType<string, Alias.Objective>;
        /**
         * 可写计分板目标参数类型（例如 `scoreboard`、`deaths`）。
         * 
         * 返回计分板目标对象，可用于修改分数。
         * 
         * @return 创建的类型，返回值类型为 `Objective`
         */
        function writableObjective(): CommandArgumentType<string, Alias.Objective>;
        /**
         * 计分板准则参数类型（例如 `dummy`、`minecraft.killed:minecraft.zombie`）。
         * 
         * @return 创建的类型，返回值类型为 `ObjectiveCriteria`
         */
        function objectiveCriteria(): CommandArgumentType<Alias.ObjectiveCriteria, Alias.ObjectiveCriteria>;
        /**
         * 计分板操作类型参数类型（例如 `+=`、`-=`、`*=`、`/=`、`=`、`><`）。
         * 
         * @return 创建的类型，返回值类型为 `OperationArgument$Operation`
         */
        function operation(): CommandArgumentType<Alias.OperationArgument$Operation, Alias.OperationArgument$Operation>;
        /**
         * 粒子参数类型（例如 `minecraft:poof`、`minecraft:block minecraft:stone`、`minecraft:dust 1.0 0.0 0.0 1.0`）。
         * 
         * @return 创建的类型，返回值类型为 `ParticleOptions`
         */
        function particle(): CommandArgumentType<Alias.ParticleOptions, Alias.ParticleOptions>;
        /**
         * 资源键参数类型（例如 `minecraft:stone`），返回注册表项的 `Holder.Reference`。
         * 
         * @param resKey 注册表的 `ResourceKey`（例如 `Registries.ITEM`）
         * @return       创建的类型，返回值类型为 `Holder.Reference<T>`
         */
        function resource<T>(resKey: Alias.ResourceKey<Alias.Registry<T>>): CommandArgumentType<Alias.Holder$Reference<T>, Alias.Holder$Reference<T>>;
        /**
         * 资源位置参数类型（例如 `minecraft:stone`）。
         * 
         * 只返回标识符，不验证注册表中是否存在。
         * 
         * @return 创建的类型，返回值类型为 `ResourceLocation`
         */
        function resourceLocation(): CommandArgumentType<Alias.ResourceLocation, Alias.ResourceLocation>;
        /**
         * 资源或标签参数类型（例如 `minecraft:stone` 或 `#minecraft:planks`）。
         * 
         * 返回包含资源键或标签的对象。
         * 
         * @param resKey 注册表的 `ResourceKey`
         * @return       创建的类型，返回值类型为 `ResourceOrTagArgument$Result<T>`
         */
        function resourceOrTag<T>(resKey: Alias.ResourceKey<Alias.Registry<T>>): CommandArgumentType<Alias.ResourceOrTagArgument$Result<T>, Alias.ResourceOrTagArgument$Result<T>>;
        /**
         * 资源键或标签键参数类型，返回键而非对象。
         * 
         * @param resKey 注册表的 `ResourceKey`
         * @return       创建的类型，返回值类型为 `ResourceOrTagKeyArgument$Result<T>`
         */
        function resourceOrTagKey<T>(resKey: Alias.ResourceKey<Alias.Registry<T>>): CommandArgumentType<Alias.ResourceOrTagKeyArgument$Result<T>, Alias.ResourceOrTagKeyArgument$Result<T>>;
        /**
         * 旋转参数类型（例如 `0 0`、`~ ~`、`~10 ~-20`），返回包含方位角和俯仰角的 `Coordinates` 对象。
         * 
         * @return 创建的类型，返回值类型为 `Coordinates`
         */
        function rotation(): CommandArgumentType<Alias.Coordinates, Alias.Coordinates>;
        /**
         * 单个计分板持有者参数类型（例如 `@p`、`Steve`、`@e[limit=1]`）。
         * 
         * 返回持有者的名称（字符串）。
         * 
         * @return 创建的类型，返回值类型为 `string`
         */
        function scoreHolder(): CommandArgumentType<Alias.ScoreHolderArgument$Result, string>;
        /**
         * 多个计分板持有者参数类型（例如 `@a`、`Steve Alex`、`@e`）。
         * 
         * 返回持有者名称的集合。
         * 
         * @return 创建的类型，返回值类型为 `Collection<string>`
         */
        function scoreHolders(): CommandArgumentType<Alias.ScoreHolderArgument$Result, Alias.Collection<string>>;
        /**
         * 计分板显示位置参数类型（例如 `list`、`sidebar`、`belowName`）。
         * 
         * @return 创建的类型，返回值类型为 `number`
         */
        function scoreboardSlot(): CommandArgumentType<number, number>;
        /**
         * 坐标轴集合参数类型（例如 `x`、`xy`、`xz`、`xyz`），用于 `//` 或 `~` 坐标。
         * 
         * @return 创建的类型，返回值类型为 `EnumSet<Direction$Axis>`
         */
        function swizzle(): CommandArgumentType<Alias.EnumSet<Alias.Direction$Axis>, Alias.EnumSet<Alias.Direction$Axis>>;
        /**
         * 队伍参数类型（例如 `red`、`blue`）。
         * 
         * @return 创建的类型，返回值类型为 `PlayerTeam`
         */
        function team(): CommandArgumentType<string, Alias.PlayerTeam>;
        /**
         * 结构镜像参数类型（例如 `none`、`left_right`、`front_back`）。
         * 
         * @return 创建的类型，返回值类型为 `Mirror`
         */
        function templateMirror(): CommandArgumentType<Alias.Mirror, Alias.Mirror>;
        /**
         * 结构旋转参数类型（例如 `none`、`clockwise_90`、`clockwise_180`、`counterclockwise_90`）。
         * 
         * @return 创建的类型，返回值类型为 `Rotation`
         */
        function templateRotation(): CommandArgumentType<Alias.Rotation, Alias.Rotation>;
        /**
         * 时间参数类型（例如 `10t`、`5s`、`1d`），返回以刻为单位的整数。
         * 
         * @param minimum 最小允许时间（以刻为单位），默认为 `0`
         * @return 创建的类型，返回值类型为 `number`
         */
        function time(minimum: number = 0): CommandArgumentType<number, number>;
        /**
         * UUID 参数类型（例如 `550e8400-e29b-41d4-a716-446655440000`）。
         * 
         * @return 创建的类型，返回值类型为 `UUID`
         */
        function uuid(): CommandArgumentType<Alias.UUID, Alias.UUID>;
        /**
         * 二维向量参数类型（例如 `0 0`、`~ ~`、`^ ^`），用于相对世界坐标或局部坐标。
         * 
         * @param centerCorrect 是否对中心进行修正（例如将 `0 0` 修正到 `0.5 0.5`）
         * @return              创建的类型，返回值类型为 `Vec2`
         */
        function vec2(centerCorrect: boolean = false): CommandArgumentType<Alias.Coordinates, Alias.Vec2>;
        /**
         * 三维向量参数类型（例如 `0 0 0`、`~ ~ ~`、`^ ^ ^`）。
         * 
         * @param centerCorrect 是否对中心进行修正（例如将 `0 0 0` 修正到 `0.5 0.5 0.5`）
         * @return              创建的类型，返回值类型为 `Vec3`
         */
        function vec3(centerCorrect: boolean = false): CommandArgumentType<Alias.Coordinates, Alias.Vec3>;
    }

    /**
     * 命令参数类型的定义。包含两个函数：`getType` 用于获取该参数在命令构建中的类型，`getValue` 用于从命令上下文中提取该参数的值。
     */
    type CommandArgumentType<T, R> = {
        /**
         * 获取该参数在命令构建中的类型。这个类型用于在 {@linkcode CmdBuilder.argType} 方法中指定参数类型。
         * 
         * @param context 命令构建上下文
         * @return        该参数在命令构建中的类型
         */
        getType(context: Alias.CommandBuildContext): Alias.ArgumentType<T>,
        /**
         * 从命令执行上下文中提取该参数的值。这个函数会在命令执行时被调用，`context` 是命令执行的上下文，`argName` 是参数名（即在命令格式中用 `<argName>` 指定的名称）。
         * 
         * @param context 命令执行上下文
         * @param argName 参数名
         */
        getValue(context: Alias.CommandContext<Alias.CommandSourceStack>, argName: string): R
    };

    /**
     * {@linkcode parseCommandUsage} 结果数组中的对象格式。
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
     * `RegCmd` 内部使用的用于解析命令格式的方法。
     * 
     * @param usage 一个表示命令格式的字符串
     * @return      解析出的命令参数的数组
     */
    function parseCommandUsage(usage: string): ParsedArgument[];
    /**
     * 开始命令定义。定义结束后无需使用 `build` 等方法（其实根本没有），这些命令会被自动注册。
     * 
     * ## 命令格式：
     * 
     * |格式                |描述                                                            |
     * |--------------------|----------------------------------------------------------------|
     * |`字面量`            |一个命令字面量。输入时必须原样输入                              |
     * |`[字面量]`          |表示该自变量可选                                                |
     * |`(字面量A\|字面量B)`|表示从两个字面量中任选其一。可以使用 `\|` 连接更多字面量以供选择|
     * |`[字面量A\|字面量B]`|`(字面量A\|字面量B)` 的可选版本                                 |
     * |`<参数名>`          |一个命令参数。输入时须遵循对应参数类型的格式                    |
     * |`[<参数名>]`        |`<参数名>` 的可选版本                                           |
     * 
     * @param usage 一个表示命令格式的字符串
     * @return      创建的 {@linkcode CmdBuilder}，用于构建命令
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
