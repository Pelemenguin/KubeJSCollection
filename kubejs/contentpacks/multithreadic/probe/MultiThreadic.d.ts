// @ts-nocheck

declare namespace MultiThreadic {

    namespace Alias {

        /** `java.lang.Thread` */
        type Thread                   = Internal.Thread;
        /** `java.util.Map` */
        type Map<K, V>                = Internal.Map<K, V>;
        /** `java.util.concurrent.ConcurrentHashMap` */
        type ConcurrentHashMap<K, V>  = Internal.ConcurrentHashMap<K, V>;
        /** `java.util.concurrent.ExecutorService` */
        type ExecutorService          = Internal.ExecutorService;
        /** `java.util.concurrent.ScheduledExecutorService` */
        type ScheduledExecutorService = Internal.ScheduledExecutorService;

        /** `dev.latvian.mods.rhino.Context` */
        type Context = Internal.Context;

    }

    namespace Types {
        interface TypedMap<T extends {}> extends Alias.Map<keyof T, T[keyof T]> {
            abstract get<K extends keyof T>(key: K): T[K];
            abstract put<K extends keyof T>(key: K, value: T[K]): T[K];
        }
    }

    namespace CONFIG {
        const PROPERTY_IN_GLOBAL: string;
        const THREAD_NAME_PREFIX: string;
    }

    interface ThreadInfo {
        thread: Alias.Thread;
        context: Alias.Context;
    }

    type theGlobal = {
        threads: Alias.ConcurrentHashMap<string, Types.TypedMap<ThreadInfo>>;
        executorServices: Alias.ConcurrentHashMap<string, Alias.ExecutorService>;
    }

    const threadFactory: (runnable: () => void) => Alias.Thread;

    function currentThread(): Alias.Thread;
    function newThread(identifier: string, task: () => void): Alias.Thread;
    function listThreads(): string[];
    function getThread(identifier: string): Alias.Thread;
    function stopThread(identifier: string, waitTimeInMillis: number = 1000): boolean;
    function stopThenNewThread(identifier: string, task: () => void, waitTimeInMillis: number = 1000): Alias.Thread;
    function sleep(millis: number): void;

    namespace Executors {
        function newScheduledThreadPool(threadCount: number): Alias.ScheduledExecutorService;
    }

}
