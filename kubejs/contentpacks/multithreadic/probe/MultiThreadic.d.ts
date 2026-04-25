// @ts-nocheck

declare namespace MultiThreadic {

    namespace Alias {

        /** `java.lang.Runnable` */
        type Runnable                     = Internal.Runnable;
        /** `java.lang.Thread` */
        type Thread                       = Internal.Thread;
        /** `java.util.Map` */
        type Map<K, V>                    = Internal.Map<K, V>;
        /** `java.util.concurrent.Callable` */
        type Callable<V>                  = Internal.Callable<V>;
        /** `java.util.concurrent.ConcurrentHashMap` */
        type ConcurrentHashMap<K, V>      = Internal.ConcurrentHashMap<K, V>;
        /** `java.util.concurrent.ExecutorService` */
        type ExecutorService              = Internal.ExecutorService;
        /** `java.util.concurrent.ScheduledExecutorService` */
        type ScheduledExecutorService     = Internal.ScheduledExecutorService;
        /** `java.util.concurrent.atomic.AtomicInteger` */
        type  AtomicInteger               = Internal.AtomicInteger;
        type $AtomicInteger        = typeof Internal.AtomicInteger;
        /** `java.util.concurrent.atomic.AtomicLong` */
        type  AtomicLong                  = Internal.AtomicLong;
        type $AtomicLong           = typeof Internal.AtomicLong;
        /** `java.util.concurrent.atomic.AtomicBoolean` */
        type  AtomicBoolean               = Internal.AtomicBoolean;
        type $AtomicBoolean        = typeof Internal.AtomicBoolean;
        /** `java.util.concurrent.atomic.AtomicReference` */
        type  AtomicReference<V>          = Internal.AtomicReference<V>;
        type $AtomicReference      = typeof Internal.AtomicReference;
        /** `java.util.concurrent.atomic.AtomicIntegerArray` */
        type  AtomicIntegerArray          = Internal.AtomicIntegerArray;
        type $AtomicIntegerArray   = typeof Internal.AtomicIntegerArray;
        /** `java.util.concurrent.atomic.AtomicLongArray` */
        type  AtomicLongArray             = Internal.AtomicLongArray;
        type $AtomicLongArray      = typeof Internal.AtomicLongArray;
        /** `java.util.concurrent.atomic.AtomicReferenceArray` */
        type  AtomicReferenceArray<E>     = Internal.AtomicReferenceArray<E>;
        type $AtomicReferenceArray = typeof Internal.AtomicReferenceArray;

        /** `dev.latvian.mods.rhino.Context` */
        type Context             = Internal.Context;
        /** `dev.latvian.mods.rhino.DefiningClassLoader` */
        type DefiningClassLoader = Internal.DefiningClassLoader;

    }

    namespace CONFIG {
        const PROPERTY_IN_GLOBAL: string;
        const THREAD_NAME_PREFIX: string;
    }

    class TaskWrapper<T> implements Alias.Runnable, Alias.Callable<T> {
        constructor(task: () => T);
        run(): void;
        call(): T;
    }

    function isInterrupted(): boolean;
    function currentThread(): Alias.Thread;
    function newThread(identifier: string, task: () => void): Alias.Thread;
    function listThreads(): string[];
    function getThread(identifier: string): Alias.Thread;
    function stopThread(identifier: string, waitTimeInMillis: number = 1000): boolean;
    function stopThenNewThread(identifier: string, task: () => void, waitTimeInMillis: number = 1000): Alias.Thread;
    function sleep(millis: number): void;

    namespace Atomic {
        const Integer: Alias.$AtomicInteger;
        const Long: Alias.$AtomicLong;
        const Boolean: Alias.$AtomicBoolean;
        const Reference: Alias.$AtomicReference;
        const IntegerArray: Alias.$AtomicIntegerArray;
        const LongArray: Alias.$AtomicLongArray;
        const ReferenceArray: Alias.$AtomicReferenceArray;
    }

    type theGlobal = {
        threads: Alias.ConcurrentHashMap<string, Alias.Thread>;
        executorServices: Alias.ConcurrentHashMap<string, Alias.ExecutorService>;
        classLoader: Alias.DefiningClassLoader;
    }

    namespace Executors {
        function newScheduledThreadPool(threadCount: number): Alias.ScheduledExecutorService;
    }

}
