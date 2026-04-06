# RegCmd

`RegCmd` is a command registration module for KubeJS, designed to provide a more concise and flexible way to define commands.

## 示例

The example below registers a `/calc` command:

```javascript
RegCmd.defineCommand("/calc (add|sub|mul|div|mod) <num1> [<num2>]")
    .argType("num1", RegCmd.ArgTypes.double())
    .argType("num2", RegCmd.ArgTypes.double()).argDefault("num2", () => 0)
    .executes((context, args, literals) => {
        const { num1, num2 } = args;
        const operation = literals[1];
        let result;
        switch (operation) {
            case "add": result = num1 + num2; break;
            case "sub": result = num1 - num2; break;
            case "mul": result = num1 * num2; break;
            case "div": result = num1 / num2; break;
            case "mod": result = num1 % num2; break;
        }
        context.getSource().sendSuccess(Component.literal(result), false);
        return 1;
    });
```

To register the same command using KubeJS's built-in command registration method:

```javascript
ServerEvents.commandRegistry(event => {
    const Commands = event.getCommands();
    const Arguments = event.getArguments();

    let operate = (operation) => (context) => {
        let num1 = Arguments.DOUBLE.getResult(context, "num1");
        let num2;
        try {
            num2 = Arguments.DOUBLE.getResult(context, "num2");
        } catch (e) {
            num2 = 0;
        }
        let result;
        switch (operation) {
            case "add": result = num1 + num2; break;
            case "sub": result = num1 - num2; break;
            case "mul": result = num1 * num2; break;
            case "div": result = num1 / num2; break;
            case "mod": result = num1 % num2; break;
        }
        context.getSource().sendSuccess(Component.literal(result), false);
        return 1;
    };

    let buildNode = (operation) => Commands.argument("num1", Arguments.DOUBLE.create(event))
        .executes(operate(operation))
        .then(Commands.argument("num2", Arguments.DOUBLE.create(event))
            .executes(operate(operation))
        );
    
    event.register(Commands.literal("calc")
        .then(Commands.literal("add").then(buildNode("add")))
        .then(Commands.literal("sub").then(buildNode("sub")))
        .then(Commands.literal("mul").then(buildNode("mul")))
        .then(Commands.literal("div").then(buildNode("div")))
        .then(Commands.literal("mod").then(buildNode("mod")))
    )
});
```
