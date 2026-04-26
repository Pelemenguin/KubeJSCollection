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
