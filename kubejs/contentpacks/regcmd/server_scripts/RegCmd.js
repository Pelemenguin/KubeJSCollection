// priority: 2147483647

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

/// <reference path="../probe/RegCmd.d.ts" />

const RegCmd = (() => {

const $Integer = Java.loadClass("java.lang.Integer");
const $Long    = Java.loadClass("java.lang.Long");

const $BoolArgumentType    = Java.loadClass("com.mojang.brigadier.arguments.BoolArgumentType");
const $DoubleArgumentType  = Java.loadClass("com.mojang.brigadier.arguments.DoubleArgumentType");
const $FloatArgumentType   = Java.loadClass("com.mojang.brigadier.arguments.FloatArgumentType");
const $IntegerArgumentType = Java.loadClass("com.mojang.brigadier.arguments.IntegerArgumentType");
const $LongArgumentType    = Java.loadClass("com.mojang.brigadier.arguments.LongArgumentType");
const $StringArgumentType  = Java.loadClass("com.mojang.brigadier.arguments.StringArgumentType");

const $AngleArgument             = Java.loadClass("net.minecraft.commands.arguments.AngleArgument");
const $ColorArgument             = Java.loadClass("net.minecraft.commands.arguments.ColorArgument");
const $ComponentArgument         = Java.loadClass("net.minecraft.commands.arguments.ComponentArgument");
const $CompoundTagArgument       = Java.loadClass("net.minecraft.commands.arguments.CompoundTagArgument");
const $DimensionArgument         = Java.loadClass("net.minecraft.commands.arguments.DimensionArgument");
const $EntityArgument            = Java.loadClass("net.minecraft.commands.arguments.EntityArgument");
const $EntityAnchorArgument      = Java.loadClass("net.minecraft.commands.arguments.EntityAnchorArgument");
const $GameProfileArgument       = Java.loadClass("net.minecraft.commands.arguments.GameProfileArgument");
const $GameModeArgument          = Java.loadClass("net.minecraft.commands.arguments.GameModeArgument");
const $HeightmapTypeArgument     = Java.loadClass("net.minecraft.commands.arguments.HeightmapTypeArgument");
const $MessageArgument           = Java.loadClass("net.minecraft.commands.arguments.MessageArgument");
const $NbtPathArgument           = Java.loadClass("net.minecraft.commands.arguments.NbtPathArgument");
const $NbtTagArgument            = Java.loadClass("net.minecraft.commands.arguments.NbtTagArgument");
const $ObjectiveArgument         = Java.loadClass("net.minecraft.commands.arguments.ObjectiveArgument");
const $ObjectiveCriteriaArgument = Java.loadClass("net.minecraft.commands.arguments.ObjectiveCriteriaArgument");
const $OperationArgument         = Java.loadClass("net.minecraft.commands.arguments.OperationArgument");
const $ParticleArgument          = Java.loadClass("net.minecraft.commands.arguments.ParticleArgument");
const $RangeArgument$Floats      = Java.loadClass("net.minecraft.commands.arguments.RangeArgument$Floats");
const $RangeArgument$Ints        = Java.loadClass("net.minecraft.commands.arguments.RangeArgument$Ints");
const $ResourceArgument          = Java.loadClass("net.minecraft.commands.arguments.ResourceArgument");
const $ResourceKeyArgument       = Java.loadClass("net.minecraft.commands.arguments.ResourceKeyArgument");
const $ResourceLocationArgument  = Java.loadClass("net.minecraft.commands.arguments.ResourceLocationArgument");
const $ResourceOrTagArgument     = Java.loadClass("net.minecraft.commands.arguments.ResourceOrTagArgument");
const $ResourceOrTagKeyArgument  = Java.loadClass("net.minecraft.commands.arguments.ResourceOrTagKeyArgument");
const $ScoreHolderArgument       = Java.loadClass("net.minecraft.commands.arguments.ScoreHolderArgument");
const $ScoreboardSlotArgument    = Java.loadClass("net.minecraft.commands.arguments.ScoreboardSlotArgument");
const $SlotArgument              = Java.loadClass("net.minecraft.commands.arguments.SlotArgument");
const $TeamArgument              = Java.loadClass("net.minecraft.commands.arguments.TeamArgument");
const $TemplateMirrorArgument    = Java.loadClass("net.minecraft.commands.arguments.TemplateMirrorArgument");
const $TemplateRotationArgument  = Java.loadClass("net.minecraft.commands.arguments.TemplateRotationArgument");
const $TimeArgument              = Java.loadClass("net.minecraft.commands.arguments.TimeArgument");
const $UuidArgument              = Java.loadClass("net.minecraft.commands.arguments.UuidArgument");
const $BlockPredicateArgument    = Java.loadClass("net.minecraft.commands.arguments.blocks.BlockPredicateArgument");
const $BlockStateArgument        = Java.loadClass("net.minecraft.commands.arguments.blocks.BlockStateArgument");
const $BlockPosArgument          = Java.loadClass("net.minecraft.commands.arguments.coordinates.BlockPosArgument");
const $ColumnPosArgument         = Java.loadClass("net.minecraft.commands.arguments.coordinates.ColumnPosArgument");
const $RotationArgument          = Java.loadClass("net.minecraft.commands.arguments.coordinates.RotationArgument");
const $SwizzleArgument           = Java.loadClass("net.minecraft.commands.arguments.coordinates.SwizzleArgument");
const $Vec2Argument              = Java.loadClass("net.minecraft.commands.arguments.coordinates.Vec2Argument");
const $Vec3Argument              = Java.loadClass("net.minecraft.commands.arguments.coordinates.Vec3Argument");
const $FunctionArgument          = Java.loadClass("net.minecraft.commands.arguments.item.FunctionArgument");
const $ItemArgument              = Java.loadClass("net.minecraft.commands.arguments.item.ItemArgument");
const $ItemPredicateArgument     = Java.loadClass("net.minecraft.commands.arguments.item.ItemPredicateArgument");

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
        for (let p of parts) {
            /** @type {RegCmd.ParsedArgument} */
            let cur = {
                optional: false
            };

            // [xxx] => xxx is optional
            if (p.startsWith('[') && p.endsWith(']')) {
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
        this.defaultLiterals = [];
        for (let i = 0; i < commandArguments.length; i++) {
            this.defaultLiterals.push(null);
        }
        this.parallelCommands = [];
        this.childrenCommands = [];
        this.suggestions = {};
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
        },
        gameMode: () => {
            return {
                getType: () => $GameModeArgument.gameMode(),
                getValue: (context, argName) => $GameModeArgument.getGameMode(context, argName)
            };
        },
        heightmap: () => {
            return {
                getType: () => $HeightmapTypeArgument.heightmap(),
                getValue: (context, argName) => $HeightmapTypeArgument.getHeightmap(context, argName)
            };
        },
        intRange: () => {
            return {
                getType: () => $RangeArgument$Ints.intRange(),
                getValue: (context, argName) => $RangeArgument$Ints.getRange(context, argName)
            };
        },
        itemPredicate: () => {
            return {
                getType: (context) => $ItemPredicateArgument.itemPredicate(context),
                getValue: (context, argName) => $ItemPredicateArgument.getItemPredicate(context, argName)
            };
        },
        itemSlot: () => {
            return {
                getType: () => $SlotArgument.slot(),
                getValue: (context, argName) => $SlotArgument.getSlot(context, argName)
            };
        },
        item: () => {
            return {
                getType: (context) => $ItemArgument.item(context),
                getValue: (context, argName) => $ItemArgument.getItem(context, argName)
            };
        },
        message: () => {
            return {
                getType: () => $MessageArgument.message(),
                getValue: (context, argName) => $MessageArgument.getMessage(context, argName)
            };
        },
        nbtCompound: () => {
            return {
                getType: () => $CompoundTagArgument.compoundTag(),
                getValue: (context, argName) => $CompoundTagArgument.getCompoundTag(context, argName)
            };
        },
        nbtPath: () => {
            return {
                getType: () => $NbtPathArgument.nbtPath(),
                getValue: (context, argName) => $NbtPathArgument.getPath(context, argName)
            };
        },
        nbtTag: () => {
            return {
                getType: () => $NbtTagArgument.nbtTag(),
                getValue: (context, argName) => $NbtTagArgument.getNbtTag(context, argName)
            };
        },
        objective: () => {
            return {
                getType: () => $ObjectiveArgument.objective(),
                getValue: (context, argName) => $ObjectiveArgument.getObjective(context, argName)
            };
        },
        writableObjective: () => {
            return {
                getType: () => $ObjectiveArgument.objective(),
                getValue: (context, argName) => $ObjectiveArgument.getWritableObjective(context, argName)
            };
        },
        objectiveCriteria: () => {
            return {
                getType: () => $ObjectiveCriteriaArgument.criteria(),
                getValue: (context, argName) => $ObjectiveCriteriaArgument.getCriteria(context, argName)
            };
        },
        operation: () => {
            return {
                getType: () => $OperationArgument.operation(),
                getValue: (context, argName) => $OperationArgument.getOperation(context, argName)
            };
        },
        particle: () => {
            return {
                getType: (context) => $ParticleArgument.particle(context),
                getValue: (context, argName) => $ParticleArgument.getParticle(context, argName)
            }
        },
        resource: (resKey) => {
            return {
                getType: (context) => $ResourceArgument.resource(context, resKey),
                getValue: (context, argName) => $ResourceArgument.getResource(context, argName, resKey)
            }
        },
        // TODO: ResourceKeyArgument
        resourceLocation: () => {
            return {
                getType: () => $ResourceLocationArgument.id(),
                getValue: (context, argName) => $ResourceLocationArgument.getId(context, argName)
            };
        },
        resourceOrTag: (resKey) => {
            return {
                getType: (context) => $ResourceOrTagArgument.resourceOrTag(context, resKey),
                getValue: (context, argName) => $ResourceOrTagArgument.getResourceOrTag(context, argName, resKey)
            };
        },
        resourceOrTagKey: (resKey) => {
            return {
                getType: () => $ResourceOrTagKeyArgument.resourceOrTagKey(resKey),
                getValue: (context, argName) => $ResourceOrTagKeyArgument.getResourceOrTagKey(context, argName, resKey, null)
            };
        },
        rotation: () => {
            return {
                getType: () => $RotationArgument.rotation(),
                getValue: (context, argName) => $RotationArgument.getRotation(context, argName)
            }
        },
        scoreHolder: () => {
            return {
                getType: () => $ScoreHolderArgument.scoreHolder(),
                getValue: (context, argName) => $ScoreHolderArgument.getName(context, argName)
            };
        },
        scoreHolders: () => {
            return {
                getType: () => $ScoreHolderArgument.scoreHolders(),
                getValue: (context, argName) => $ScoreHolderArgument.getNames(context, argName)
            };
        },
        scoreboardSlot: () => {
            return {
                getType: () => $ScoreboardSlotArgument.displaySlot(),
                getValue: (context, argName) => $ScoreboardSlotArgument.getDisplaySlot(context, argName)
            };
        },
        swizzle: () => {
            return {
                getType: () => $SwizzleArgument.swizzle(),
                getValue: (context, argName) => $SwizzleArgument.getSwizzle(context, argName)
            };
        },
        team: () => {
            return {
                getType: () => $TeamArgument.team(),
                getValue: (context, argName) => $TeamArgument.getTeam(context, argName)
            };
        },
        templateMirror: () => {
            return {
                getType: () => $TemplateMirrorArgument.templateMirror(),
                getValue: (context, argName) => $TemplateMirrorArgument.getMirror(context, argName)
            };
        },
        templateRotation: () => {
            return {
                getType: () => $TemplateRotationArgument.templateRotation(),
                getValue: (context, argName) => $TemplateRotationArgument.getRotation(context, argName)
            };
        },
        time: (minimum) => {
            if (minimum == undefined) minimum = 0;
            return {
                getType: () => $TimeArgument.time(minimum),
                getValue: (context, argName) => $IntegerArgumentType.getInteger(context, argName)
            };
        },
        uuid: () => {
            return {
                getType: () => $UuidArgument.uuid(),
                getValue: (context, argName) => $UuidArgument.getUuid(context, argName)
            };
        },
        vec2: (centerCorrect) => {
            if (centerCorrect === undefined) centerCorrect = false;
            return {
                getType: () => $Vec2Argument.vec2(centerCorrect),
                getValue: (context, argName) => $Vec2Argument.getVec2(context, argName)
            };
        },
        vec3: (centerCorrect) => {
            if (centerCorrect === undefined) centerCorrect = false;
            return {
                getType: () => $Vec3Argument.vec3(centerCorrect),
                getValue: (context, argName) => $Vec3Argument.getVec3(context, argName)
            };
        }
    }
};

Object.freeze(exported);
Object.freeze(exported.ArgTypes);

let CmdBuilder = exported.CmdBuilder;

/** @type {RegCmd.CmdBuilder["buildNode"]} */
CmdBuilder.prototype.buildNode = function(event, index, literalsSoFar, parentNode, childrenRoots) {
    if (index >= this.commandArguments.length) {
        if (childrenRoots != undefined) {
            childrenRoots.forEach(r => {
                if (parentNode != null) parentNode.then(r);
            });
        }
        return null;
    }
    const Commands = event.getCommands();
    let part = this.commandArguments[index];
    let shouldExecute = (index == this.commandArguments.length - 1) || this.commandArguments[index + 1].optional;
    let curLiterals = literalsSoFar.slice();
    switch (part.type) {
        case "LITERAL": {
            let curNode = Commands.literal(part.literal);
            curLiterals.push(part.literal);
            this.buildNode(event, index + 1, curLiterals, curNode, childrenRoots);
            if (shouldExecute) {
                for (let i = curLiterals.length; i < this.commandArguments.length; i++) {
                    curLiterals.push(this.defaultLiterals[i]);
                }
                curNode.executes(context => this.executeFunction(context, this.genArgs(context), curLiterals));
            }
            if (parentNode != null) parentNode.then(curNode);
            return [curNode];
        }
        case "MULTI_LITERAL": {
            let nodes = [];
            for (let literal of part.literals) {
                let curcurLiterals = curLiterals.slice();
                let curNode = Commands.literal(literal);
                curcurLiterals.push(literal);
                this.buildNode(event, index + 1, curcurLiterals, curNode, childrenRoots);
                if (shouldExecute) {
                    for (let i = curcurLiterals.length; i < this.commandArguments.length; i++) {
                        curcurLiterals.push(this.defaultLiterals[i]);
                    }
                    curNode.executes(context => this.executeFunction(context, this.genArgs(context), curcurLiterals));
                }
                if (parentNode != null) parentNode.then(curNode);
                nodes.push(curNode);
            }
            return nodes;
        }
        case "ARGUMENT": {
            /** @type {RegCmd.CommandArgumentType<any, any>} */
            let type = this.args[part.name];
            if (type == undefined) {
                throw new Error(`No type specified for argument ${part.name}`);
            }
            let curNode = Commands.argument(part.name, type.getType(event.context));
            curLiterals.push(null);
            this.buildNode(event, index + 1, curLiterals, curNode, childrenRoots);
            if (shouldExecute) {
                for (let i = curLiterals.length; i < this.commandArguments.length; i++) {
                    curLiterals.push(this.defaultLiterals[i]);
                }
                if (part.name in this.suggestions) {
                    curNode.suggests((context, builder) => {
                        this.suggestions[part.name](context, builder, this.genArgs(context), curLiterals.slice());
                        return builder.buildFuture();
                    });
                }
                Object.freeze(curLiterals);
                curNode.executes(context => this.executeFunction(context, this.genArgs(context), curLiterals));
            }
            if (parentNode != null) parentNode.then(curNode);
            return [curNode];
        }
    }
};
/** @type {RegCmd.CmdBuilder["genArgs"]} */
CmdBuilder.prototype.genArgs = function(context) {
    let args = {};
    for (let arg in this.args) {
        let argCopy = arg;
        let outerThis = this;
        Object.defineProperty(args, argCopy, {
            get: () => {
                /** @type {RegCmd.CommandArgumentType<?, ?>} */
                let type = outerThis.args[argCopy];
                let value;
                try {
                    value = type.getValue(context, argCopy);
                } catch (e) {
                    console.error(e);
                    let def = outerThis.defaultValues[argCopy];
                    if (def == undefined) {
                        value = undefined;
                    } else {
                        value = def()
                    }
                }
                return value;
            }
        });
    }
    return args;
};
/** @type {RegCmd.CmdBuilder["registerToEvent"]} */
CmdBuilder.prototype.registerToEvent = function(event, registerer, isRoot) {
    if (this.commandArguments.length == 0) {
        throw new Error("Cannot register command with empty usage");
    }
    if (isRoot && this.commandArguments[0].type !== "LITERAL") {
        throw new Error("Root command must start with a literal");
    }

    let childrenRoots = [];
    this.childrenCommands.forEach(cmd => {
        cmd.registerToEvent(event, c => {
            childrenRoots.push(c);
        }, false);
    });
    let roots = this.buildNode(event, 0, [], null, childrenRoots);
    roots.forEach(c => {
        registerer(c);
    });

    this.parallelCommands.forEach(cmd => cmd.registerToEvent(event, registerer, isRoot));
}
/** @type {RegCmd.CmdBuilder["executes"]} */
CmdBuilder.prototype.executes = function(executeFunction) {
    this.executeFunction = executeFunction;
    return this;
}
/** @type {RegCmd.CmdBuilder["clearRequirements"]} */
CmdBuilder.prototype.clearRequirements = function() {
    this.requirementPredicate = () => true;
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
};
/** @type {RegCmd.CmdBuilder["argDefault"]} */
CmdBuilder.prototype.argDefault = function(argName, defaultValue) {
    this.defaultValues[argName] = defaultValue;
    return this;
};
/** @type {RegCmd.CmdBuilder["argSuggests"]} */
CmdBuilder.prototype.argSuggests = function(argName, suggestion) {
    this.suggestions[argName] = suggestion;
    return this;
};
/** @type {RegCmd.CmdBuilder["literalDefault"]} */
CmdBuilder.prototype.literalDefault = function(index, literal) {
    if (index < 0 || index >= this.commandArguments.length) {
        throw new Error("Literal default index out of bounds");
    }
    if (this.commandArguments[index].type !== "MULTI_LITERAL") {
        throw new Error("Literal default can only be set for multi-literal arguments");
    }
    this.defaultLiterals[index] = literal;
    return this;
};
/** @type {RegCmd.CmdBuilder["or"]} */
CmdBuilder.prototype.or = function(usage) {
    let result = new CmdBuilder(exported.parseCommandUsage(usage));
    for (let a in this.args) {
        result.argType(a, this.args[a]);
    }
    for (let a in this.defaultValues) {
        result.argDefault(a, this.defaultValues[a]);
    }
    for (let a in this.suggestions) {
        result.argSuggests(a, this.suggestions[a]);
    }
    result.requires(this.requirementPredicate);
    this.parallelCommands.push(result);
    return result;
};
/** @type {RegCmd.CmdBuilder["then"]} */
CmdBuilder.prototype.then = function(usage) {
    let result = new CmdBuilder(exported.parseCommandUsage(usage));
    for (let a in this.args) {
        result.argType(a, this.args[a]);
    }
    for (let a in this.defaultValues) {
        result.argDefault(a, this.defaultValues[a]);
    }
    for (let a in this.suggestions) {
        result.argSuggests(a, this.suggestions[a]);
    }
    result.requires(this.requirementPredicate);
    this.childrenCommands.push(result);
    return result;
};

ServerEvents.commandRegistry(event => {
    console.info("[RegCmd] Begin command registration");
    for (let builder of ALL_BUILDERS) {
        console.info("[RegCmd] Registering command: /" + builder.commandArguments[0].literal);
        builder.registerToEvent(event, c => event.register(c), true);
    }
})

return exported;

})();


console.info("RegCmd loaded!");

// Add to KubeLoader
try {
    ContentPacks.putShared("pelemenguin.regcmd", RegCmd);
    console.info("Access RegCmd via ContentPacks.getShared('pelemenguin.regcmd')");
} catch (e) {}
