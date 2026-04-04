// @ts-nocheck

declare namespace RegCmd {

    namespace Alias {

        /** `com.mojang.brigadier.arguments.ArgumentType` */
        type ArgumentType<T>                                     = Internal.ArgumentType<T>;
        /** `com.mojang.brigadier.builder.ArgumentBuilder` */
        type ArgumentBuilder<S, T extends ArgumentBuilder<S, T>> = Internal.ArgumentBuilder<S, T>;
        /** `com.mojang.brigadier.context.CommandContext` */
        type CommandContext<S>                                   = Internal.CommandContext<S>;

        /** `dev.latvian.mods.kubejs.command.CommandRegistryEventJS` */
        type CommandRegistryEventJS = Internal.CommandRegistryEventJS;

        /** `net.minecraft.commands.CommandSourceStack` */
        type CommandSourceStack = Internal.CommandSourceStack;

    }

    class CmdBuilder<P extends {[argName: string]: CommandArgumentType<?>}> {
        constructor(commandArguments: ParsedArgument[]);
        protected commandArguments: ParsedArgument[];
        protected executeFunction: (context: Alias.CommandContext<Alias.CommandSourceStack>, args: Readonly<{[argName in keyof P]: P[argName] extends CommandArgumentType<infer T> ? T : never}>) => number;
        protected requirementPredicate: (context: Alias.CommandSourceStack) => boolean;
        protected args: P;
        protected defaultValues: {[s in keyof P]: () => P[S] extends CommandArgumentType<infer T> ? T : never};
        executes(executeFunction: (context: Alias.CommandContext<Alias.CommandSourceStack>, args: Readonly<{[argName in keyof P]: P[argName] extends CommandArgumentType<infer T> ? T : never}>) => number): this;
        requires(requirementPredicate: (context: Alias.CommandSourceStack) => boolean): this;
        requiresModerator(): this;
        requiresOperator(): this;
        requiresServerAdmin(): this;
        requiresServerOwner(): this;
        paramType<S extends string, T>(paramName: S, type: CommandArgumentType<T>): CmdBuilder<P & {[s in S]: CommandArgumentType<T>}>
        paramDefault<S extends keyof P>(paramName: S, defaultValue: () => P[S] extends CommandArgumentType<infer T> ? T : never): this;
        registerToEvent(event: Alias.CommandRegistryEventJS): void;
    }

    namespace ArgTypes {
        function integer(): CommandArgumentType<number>;
        function integerBetween(min: number, max: number): CommandArgumentType<number>
        function integerAbove(min: number): CommandArgumentType<number>;
        function integerBelow(max: number): CommandArgumentType<number>;
        function long(): CommandArgumentType<number>;
        function longBetween(min: number, max: number): CommandArgumentType<number>
        function longAbove(min: number): CommandArgumentType<number>;
        function longBelow(max: number): CommandArgumentType<number>;
        function float(): CommandArgumentType<number>;
        function floatBetween(min: number, max: number): CommandArgumentType<number>
        function floatAbove(min: number): CommandArgumentType<number>;
        function floatBelow(max: number): CommandArgumentType<number>;
        function double(): CommandArgumentType<number>;
        function doubleBetween(min: number, max: number): CommandArgumentType<number>
        function doubleAbove(min: number): CommandArgumentType<number>;
        function doubleBelow(max: number): CommandArgumentType<number>;
    }

    type CommandArgumentType<T> = {
        getType(): Alias.ArgumentType<T>,
        getValue(context: Alias.CommandContext<Alias.CommandSourceStack>, argName: string): T
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
