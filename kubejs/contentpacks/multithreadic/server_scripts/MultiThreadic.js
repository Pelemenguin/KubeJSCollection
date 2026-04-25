(() => {

const MultiThreadic = global.MultiThreadic;

ServerEvents.commandRegistry(event => {
    const Commands = event.getCommands();
    const Arguments = event.getArguments();

    event.register(Commands.literal("multithreadic")
        .requires(s => s.hasPermission(4))
        .then(Commands.literal("stop")
            .then(Commands.argument("threadIdentifier", Arguments.GREEDY_STRING.create(event))
                .suggests((_context, builder) => {
                    MultiThreadic.listThreads().forEach(s => builder.suggest(s));
                    return builder.buildFuture();
                })
                .executes(command => {
                    let identifier = Arguments.GREEDY_STRING.getResult(command, "threadIdentifier");
                    if (MultiThreadic.getThread(identifier) == null) {
                        command.getSource().sendFailure(Component.literal(`Thread '${identifier}' does not exist`));
                        return 0;
                    }
                    if (MultiThreadic.stopThread(identifier)) {
                        command.getSource().sendSuccess(Component.literal(`Thread '${identifier}' stopped successfully`), false);
                        return 1;
                    } else {
                        command.getSource().sendFailure(Component.literal(`Failed to stop thread '${identifier}', it may be still alive after waiting for a while. You can try to stop it again or increase the wait time in the command arguments`));
                        return 0;
                    }
                })
            )
        ).then(Commands.literal("shutdown")
            .then(Commands.argument("executorIdentifier", Arguments.GREEDY_STRING.create(event))
                .suggests((_context, builder) => {
                    MultiThreadic.Executors.listExecutors().forEach(s => builder.suggest(s));
                    return builder.buildFuture();
                })
                .executes(command => {
                    let identifier = Arguments.GREEDY_STRING.getResult(command, "executorIdentifier");
                    let executor = MultiThreadic.Executors.getExecutor(identifier);
                    if (executor == null) {
                        command.getSource().sendFailure(Component.literal(`Executor '${identifier}' does not exist`));
                        return 0;
                    }
                    executor.shutdown();
                    command.getSource().sendSuccess(Component.literal(`Executor '${identifier}' shutdown successfully`), false);
                    return 1;
                })
            )
        )
    )
});

})();
