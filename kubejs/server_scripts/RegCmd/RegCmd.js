// priority: 2147483647

/// <reference path="./RegCmd.d.ts" />

const RegCmd = (() => {

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
                let created = Commands.argument(part.name, event.getArguments().INTEGER.create(event));
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
                a
                    .executes(this.executeFunction)
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

ServerEvents.commandRegistry(event => {
    for (let builder of ALL_BUILDERS) {
        builder.registerToEvent(event);
    }
})

return exported;

})();
