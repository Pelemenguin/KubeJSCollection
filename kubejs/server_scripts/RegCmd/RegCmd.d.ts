// @ts-nocheck

declare namespace RegCmd {

    namespace Alias {

        /** `com.mojang.brigadier.builder.ArgumentBuilder` */
        type ArgumentBuilder<S, T extends ArgumentBuilder<S, T>> = Internal.ArgumentBuilder<S, T>;
        /** `com.mojang.brigadier.context.CommandContext` */
        type CommandContext<S>                                   = Internal.CommandContext<S>;

        /** `dev.latvian.mods.kubejs.command.CommandRegistryEventJS` */
        type CommandRegistryEventJS = Internal.CommandRegistryEventJS;

        /** `net.minecraft.commands.CommandSourceStack` */
        type CommandSourceStack = Internal.CommandSourceStack;

    }

    class CmdBuilder {
        constructor(commandArguments: ParsedArgument[]);
        protected commandArguments: ParsedArgument[];
        protected executeFunction: (context: Alias.CommandContext<Alias.CommandSourceStack>) => number;
        protected requirementPredicate: (context: Alias.CommandSourceStack) => boolean;
        executes(executeFunction: (context: Internal.CommandContext<Alias.CommandSourceStack>) => number): this;
        requires(requirementPredicate: (context: Alias.CommandSourceStack) => boolean): this;
        requiresModerator(): this;
        requiresOperator(): this;
        requiresServerAdmin(): this;
        requiresServerOwner(): this;
        registerToEvent(event: Alias.CommandRegistryEventJS): void;
    }
    
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
    function defineCommand(usage: string): CmdBuilder;

}

declare const RegCmd: RegCmd;
