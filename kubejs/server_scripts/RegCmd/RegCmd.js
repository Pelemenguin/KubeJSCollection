// priority: 2147483647

/// <reference path="./RegCmd.d.ts" />

const RegCmd = (() => {

const $Integer = Java.loadClass("java.lang.Integer");
const $Long    = Java.loadClass("java.lang.Long");

const $BoolArgumentType    = Java.loadClass("com.mojang.brigadier.arguments.BoolArgumentType");
const $DoubleArgumentType  = Java.loadClass("com.mojang.brigadier.arguments.DoubleArgumentType");
const $FloatArgumentType   = Java.loadClass("com.mojang.brigadier.arguments.FloatArgumentType");
const $IntegerArgumentType = Java.loadClass("com.mojang.brigadier.arguments.IntegerArgumentType");
const $LongArgumentType    = Java.loadClass("com.mojang.brigadier.arguments.LongArgumentType");
const $StringArgumentType  = Java.loadClass("com.mojang.brigadier.arguments.StringArgumentType");

const $AngleArgument          = Java.loadClass("net.minecraft.commands.arguments.AngleArgument");
const $ColorArgument          = Java.loadClass("net.minecraft.commands.arguments.ColorArgument");
const $ComponentArgument      = Java.loadClass("net.minecraft.commands.arguments.ComponentArgument");
const $DimensionArgument      = Java.loadClass("net.minecraft.commands.arguments.DimensionArgument");
const $EntityArgument         = Java.loadClass("net.minecraft.commands.arguments.EntityArgument");
const $EntityAnchorArgument   = Java.loadClass("net.minecraft.commands.arguments.EntityAnchorArgument");
const $GameProfileArgument    = Java.loadClass("net.minecraft.commands.arguments.GameProfileArgument");
const $RangeArgument$Floats   = Java.loadClass("net.minecraft.commands.arguments.RangeArgument$Floats");
const $BlockPredicateArgument = Java.loadClass("net.minecraft.commands.arguments.blocks.BlockPredicateArgument");
const $BlockStateArgument     = Java.loadClass("net.minecraft.commands.arguments.blocks.BlockStateArgument");
const $BlockPosArgument       = Java.loadClass("net.minecraft.commands.arguments.coordinates.BlockPosArgument");
const $ColumnPosArgument      = Java.loadClass("net.minecraft.commands.arguments.coordinates.ColumnPosArgument");
const $FunctionArgument       = Java.loadClass("net.minecraft.commands.arguments.item.FunctionArgument");

/** @type {RegCmd.CmdBuilder[]} */
const ALL_BUILDERS = [];

/** @type {typeof RegCmd} */
let exported = {
    parseCommandUsage: (usage) => {
        let parts = usage.split(/ +/g);
        if (parts.length == 0) {
            throw new Error("Usage cannot be empty");
        }
        if (parts[0].startsWith('/')) {
            parts[0] = parts[0].substring(1);
        }
        /** @type {RegCmd.ParsedArgument[]} */
        let results = [];
        let begunOptional = false;
        for (let p of parts) {
            /** @type {RegCmd.ParsedArgument} */
            let cur = {
                optional: false
            };

            // [xxx] => xxx is optional
            if (p.startsWith('[') && p.endsWith(']')) {
                begunOptional = true;
                cur.optional = true;
                p = p.substring(1, p.length - 1);

                // Special check
                // [aaa|bbb] for optional multi-literal
                if (p.includes('|')) {
                    cur.type = "MULTI_LITERAL";
                    cur.literals = p.split('|');
                    results.push(cur);
                    continue;
                }
            } else if (begunOptional) {
                throw new Error("Cannot have required arguments after optional arguments");
            }

            // <xxx> => xxx is an argument name
            if (p.startsWith('<') && p.endsWith('>')) {
                cur.type = "ARGUMENT";
                cur.name = p.substring(1, p.length - 1);
                results.push(cur);
                continue;
            }

            // (xxx) => xxx is a multi-literal
            if (p.startsWith('(') && p.endsWith(')')) {
                cur.type = "MULTI_LITERAL";
                cur.literals = p.substring(1, p.length - 1).split('|');
                results.push(cur);
                continue;
            }

            // xxx => xxx is a literal
            cur.type = "LITERAL";
            // Cannot include brackets
            if (p.search(/[[\]<>|]/) != -1) {
                throw new Error(`Invalid literal: ${p}`);
            }
            cur.literal = p;
            results.push(cur);
        }

        return results;
    },
    defineCommand: (usage) => {
        let result = new CmdBuilder(exported.parseCommandUsage(usage));
        ALL_BUILDERS.push(result);
        return result;
    },
    CmdBuilder: function(commandArguments) {
        this.commandArguments = commandArguments;
        this.executeFunction = () => 0;
        this.requirementPredicate = () => true;
        this.args = {};
        this.defaultValues = {};
    },
    ArgTypes: {
        bool: () => {
            return {
                getType: () => $BoolArgumentType.bool(),
                getValue: (context, argName) => $BoolArgumentType.getBool(context, argName)
            }
        },
        double: () => {
            return {
                getType: () => $DoubleArgumentType.doubleArg(),
                getValue: (context, argName) => $DoubleArgumentType.getDouble(context, argName)
            };
        },
        doubleBetween: (min, max) => {
            return {
                getType: () => $DoubleArgumentType.doubleArg(min, max),
                getValue: (context, argName) => $DoubleArgumentType.getDouble(context, argName)
            };
        },
        doubleAbove: (min) => {
            return RegCmd.ArgTypes.doubleBetween(min, Number.POSITIVE_INFINITY);
        },
        doubleBelow: (max) => {
            return RegCmd.ArgTypes.doubleBetween(Number.NEGATIVE_INFINITY, max);
        },
        float: () => {
            return {
                getType: () => $FloatArgumentType.floatArg(),
                getValue: (context, argName) => $FloatArgumentType.getFloat(context, argName)
            };
        },
        floatBetween: (min, max) => {
            return {
                getType: () => $FloatArgumentType.floatArg(min, max),
                getValue: (context, argName) => $FloatArgumentType.getFloat(context, argName)
            };
        },
        floatAbove: (min) => {
            return RegCmd.ArgTypes.floatBetween(min, Number.POSITIVE_INFINITY);
        },
        floatBelow: (max) => {
            return RegCmd.ArgTypes.floatBetween(Number.NEGATIVE_INFINITY, max);
        },
        integer: () => {
            return {
                getType: () => $IntegerArgumentType.integer(),
                getValue: (context, argName) => context.getArgument(argName, $Integer)
            }
        },
        integerBetween: (min, max) => {
            return {
                getType: () => $IntegerArgumentType.integer(min, max),
                getValue: (context, argName) => $IntegerArgumentType.getInteger(context, argName)
            };
        },
        integerAbove: (min) => {
            return RegCmd.ArgTypes.integerBetween(min, $Integer.MAX_VALUE);
        },
        integerBelow: (max) => {
            return RegCmd.ArgTypes.integerBetween($Integer.MIN_VALUE, max);
        },
        long: () => {
            return {
                getType: () => $LongArgumentType.longArg(),
                getValue: (context, argName) => $LongArgumentType.getLong(context, argName)
            };
        },
        longBetween: (min, max) => {
            return {
                getType: () => $LongArgumentType.longArg(min, max),
                getValue: (context, argName) => $LongArgumentType.getLong(context, argName)
            };
        },
        longAbove: (min) => {
            return RegCmd.ArgTypes.longBetween(min, $Long.MAX_VALUE);
        },
        longBelow: (max) => {
            return RegCmd.ArgTypes.longBetween($Long.MIN_VALUE, max);
        },
        string: () => {
            return {
                getType: () => $StringArgumentType.string(),
                getValue: (context, argName) => $StringArgumentType.getString(context, argName)
            };
        },
        word: () => {
            return {
                getType: () => $StringArgumentType.word(),
                getValue: (context, argName) => $StringArgumentType.getString(context, argName)
            };
        },
        greedyString: () => {
            return {
                getType: () => $StringArgumentType.greedyString(),
                getValue: (context, argName) => $StringArgumentType.getString(context, argName)
            };
        },
        angle: () => {
            return {
                getType: () => $AngleArgument.angle(),
                getValue: (context, argName) => $AngleArgument.getAngle(context, argName)
            };
        },
        blockPos: () => {
            return {
                getType: () => $BlockPosArgument.blockPos(),
                getValue: (context, argName) => $BlockPosArgument.getBlockPos(context, argName)
            };
        },
        blockPredicate: () => {
            return {
                getType: (context) => $BlockPredicateArgument.blockPredicate(context),
                getValue: (context, argName) => $BlockPredicateArgument.getBlockPredicate(context, argName)
            };
        },
        blockState: () => {
            return {
                getType: (context) => $BlockStateArgument.block(context),
                getValue: (context, argName) => $BlockStateArgument.getBlock(context, argName)
            };
        },
        color: () => {
            return {
                getType: () => $ColorArgument.color(),
                getValue: (context, argName) => $ColorArgument.getColor(context, argName)
            };
        },
        columnPos: () => {
            return {
                getType: () => $ColumnPosArgument.columnPos(),
                getValue: (context, argName) => $ColumnPosArgument.getColumnPos(context, argName)
            };
        },
        component: () => {
            return {
                getType: () => $ComponentArgument.textComponent(),
                getValue: (context, argName) => $ComponentArgument.getComponent(context, argName)
            };
        },
        dimension: () => {
            return {
                getType: () => $DimensionArgument.dimension(),
                getValue: (context, argName) => $DimensionArgument.getDimension(context, argName)
            };
        },
        entity: () => {
            return {
                getType: () => $EntityArgument.entity(),
                getValue: (context, argName) => $EntityArgument.getEntity(context, argName)
            };
        },
        entities: () => {
            return {
                getType: () => $EntityArgument.entities(),
                getValue: (context, argName) => $EntityArgument.getEntities(context, argName)
            };
        },
        entityAnchor: () => {
            return {
                getType: () => $EntityAnchorArgument.anchor(),
                getValue: (context, argName) => $EntityAnchorArgument.getAnchor(context, argName)
            };
        },
        floatRange: () => {
            return {
                getType: () => $RangeArgument$Floats.floatRange(),
                getValue: (context, argName) => $RangeArgument$Floats.getRange(context, argName)
            };
        },
        functions: () => {
            return {
                getType: () => $FunctionArgument.functions(),
                getValue: (context, argName) => $FunctionArgument.getFunctions(context, argName)
            };
        },
        gameProfile: () => {
            return {
                getType: () => $GameProfileArgument.gameProfile(),
                getValue: (context, argName) => $GameProfileArgument.getGameProfiles(context, argName)
            };
        }
    }
};

let CmdBuilder = exported.CmdBuilder;

/** @type {RegCmd.CmdBuilder["registerToEvent"]} */
CmdBuilder.prototype.registerToEvent = function(event) {
    const Commands = event.commands;

    if (this.commandArguments[0].type != "LITERAL") {
        throw new Error("First argument must be a literal");
    }

    /** @type {RegCmd.Alias.ArgumentBuilder<RegCmd.Alias.CommandSourceStack, RegCmd.Alias.ArgumentBuilder<?, ?>>[]} */
    let cur = []; 
    let last = null;
    for (let i = this.commandArguments.length - 1; i >= 0; i--) {
        let part = this.commandArguments[i];
        switch (part.type) {
            case "LITERAL": {
                let created = Commands.literal(part.literal);
                cur.forEach(a => created.then(a));
                cur = [created];
                break;
            }
            case "MULTI_LITERAL": {
                let creating = [];
                for (let literal of part.literals) {
                    let created = Commands.literal(literal);
                    cur.forEach(a => created.then(a));
                    creating.push(created);
                }
                cur = creating;
                break;
            }
            case "ARGUMENT": {
                /** @type {RegCmd.CommandArgumentType<?, ?>} */
                let type = this.args[part.name];
                let created = Commands.argument(part.name, type.getType(event.context));
                cur.forEach(a => created.then(a));
                cur = [created];
                break;
            }
            default: {
                throw new Error(`Unknown argument type: ${part.type}`);
            }
        }

        if (last == null || last.optional) {
            cur.forEach(a => {
                a.executes((context) => {
                    let args = {};
                    for (let arg in this.args) {
                        /** @type {RegCmd.CommandArgumentType<?>} */
                        let type = this.args[arg];
                        let value;
                        try {
                            value = type.getValue(context, arg)
                        } catch (e) {
                            let def = this.defaultValues[arg];
                            if (def == undefined) {
                                value = undefined;
                            } else {
                                value = def()
                            }
                        }
                        args[arg] = value;
                    }
                    Object.freeze(args);
                    return this.executeFunction(context, args);
                })
            });
        }

        last = part;
    }

    cur.forEach(a => {
        a.requires(this.requirementPredicate);
        event.register(a)
    });
}
/** @type {RegCmd.CmdBuilder["executes"]} */
CmdBuilder.prototype.executes = function(executeFunction) {
    this.executeFunction = executeFunction;
    return this;
}
/** @type {RegCmd.CmdBuilder["requires"]} */
CmdBuilder.prototype.requires = function(requirementFunction) {
    let last = this.requirementPredicate;
    this.requirementPredicate = (s) => requirementFunction(s) && last(s);
    return this;
}
/** @type {RegCmd.CmdBuilder["requiresModerator"]} */
CmdBuilder.prototype.requiresModerator = function() {
    this.requires(s => s.hasPermission(1));
    return this;
}
/** @type {RegCmd.CmdBuilder["requiresOperator"]} */
CmdBuilder.prototype.requiresOperator = function() {
    this.requires(s => s.hasPermission(2));
    return this;
}
/** @type {RegCmd.CmdBuilder["requiresServerAdmin"]} */
CmdBuilder.prototype.requiresAdmin = function() {
    this.requires(s => s.hasPermission(3));
    return this;
}
/** @type {RegCmd.CmdBuilder["requiresServerOwner"]} */
CmdBuilder.prototype.requiresServerOwner = function() {
    this.requires(s => s.hasPermission(4));
    return this;
}
/** @type {RegCmd.CmdBuilder["argType"]} */
CmdBuilder.prototype.argType = function(argName, type) {
    this.args[argName] = type;
    return this;
}
/** @type {RegCmd.CmdBuilder["argDefault"]} */
CmdBuilder.prototype.argDefault = function(argName, defaultValue) {
    this.defaultValues[argName] = defaultValue;
    return this;
}

ServerEvents.commandRegistry(event => {
    for (let builder of ALL_BUILDERS) {
        builder.registerToEvent(event);
    }
})

return exported;

})();
