(() => {

const MultiThreadic = global.MultiThreadic;

ServerEvents.commandRegistry(event => {
    const Commands = event.getCommands();
    const Arguments = event.getArguments();

    event.register(Commands.literal("multithreadic")
        .then(Commands.literal("stop")
            .requires(s => s.hasPermission(4))
            .then(Commands.argument("threadIdentifier", Arguments.GREEDY_STRING.create(event))
                .suggests((_context, builder) => {
                    MultiThreadic.listThreads().forEach(s => builder.suggest(s));
                    return builder.buildFuture();
                })
                .executes(command => {
                    let identifier = Arguments.GREEDY_STRING.getResult(command, "threadIdentifier");
                    if (MultiThreadic.stopThread(identifier)) {
                        command.source.sendSuccess(Component.literal(`Thread '${identifier}' stopped successfully`), false);
                        return 1;
                    } else {
                        command.source.sendFailure(Component.literal(`Failed to stop thread '${identifier}', it may be still alive after waiting for a while. You can try to stop it again or increase the wait time in the command arguments`));
                        return 0;
                    }
                })
            )
        )
    )
});

})();
