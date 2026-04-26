// @ts-nocheck

declare namespace MultiThreadic {

    namespace Alias {

        /** `java.lang.Runnable` */
        type Runnable                       = Internal.Runnable;
        /** `java.lang.Thread` */
        type Thread                         = Internal.Thread;
        /** `java.util.Collection` */
        type Collection<E>                  = Internal.Collection<E>;
        type Collection_<E>                 = Internal.Collection_<E>;
        /** `java.util.List` */
        type List<E>                        = Internal.List<E>;
        /** `java.util.Map` */
        type Map<K, V>                      = Internal.Map<K, V>;
        /** `java.util.concurrent.Callable` */
        type Callable<V>                    = Internal.Callable<V>;
        /** `java.util.concurrent.ConcurrentHashMap` */
        type ConcurrentHashMap<K, V>        = Internal.ConcurrentHashMap<K, V>;
        /** `java.util.concurrent.ExecutorService` */
        type ExecutorService                = Internal.ExecutorService;
        /** `java.util.concurrent.Future` */
        type Future<V>                      = Internal.Future<V>;
        /** `java.util.concurrent.ScheduledExecutorService` */
        type ScheduledExecutorService       = Internal.ScheduledExecutorService;
        /** `java.util.concurrent.ScheduledFuture` */
        type ScheduledFuture<V>             = Internal.ScheduledFuture<V>;
        /** `java.util.concurrent.ThreadFactory` */
        type ThreadFactory                  = Internal.ThreadFactory;
        /** `java.util.concurrent.TimeUnit` */
        type TimeUnit                       = Internal.TimeUnit;
        type TimeUnit_                      = Internal.TimeUnit_;
        /** `java.util.concurrent.atomic.AtomicInteger` */
        type  AtomicInteger                 = Internal.AtomicInteger;
        type $AtomicInteger          = typeof Internal.AtomicInteger;
        /** `java.util.concurrent.atomic.AtomicLong` */
        type  AtomicLong                    = Internal.AtomicLong;
        type $AtomicLong             = typeof Internal.AtomicLong;
        /** `java.util.concurrent.atomic.AtomicBoolean` */
        type  AtomicBoolean                 = Internal.AtomicBoolean;
        type $AtomicBoolean          = typeof Internal.AtomicBoolean;
        /** `java.util.concurrent.atomic.AtomicReference` */
        type  AtomicReference<V>            = Internal.AtomicReference<V>;
        type $AtomicReference        = typeof Internal.AtomicReference;
        /** `java.util.concurrent.atomic.AtomicIntegerArray` */
        type  AtomicIntegerArray            = Internal.AtomicIntegerArray;
        type $AtomicIntegerArray     = typeof Internal.AtomicIntegerArray;
        /** `java.util.concurrent.atomic.AtomicLongArray` */
        type  AtomicLongArray               = Internal.AtomicLongArray;
        type $AtomicLongArray        = typeof Internal.AtomicLongArray;
        /** `java.util.concurrent.atomic.AtomicReferenceArray` */
        type  AtomicReferenceArray<E>       = Internal.AtomicReferenceArray<E>;
        type $AtomicReferenceArray   = typeof Internal.AtomicReferenceArray;
        /** `java.util.concurrent.locks.ReentrantLock` */
        type  ReentrantLock                 = Internal.ReentrantLock;
        type $ReentrantLock          = typeof Internal.ReentrantLock;
        /** `java.util.concurrent.locks.ReentrantReadWriteLock` */
        type  ReentrantReadWriteLock        = Internal.ReentrantReadWriteLock;
        type $ReentrantReadWriteLock = typeof Internal.ReentrantReadWriteLock;
        /** `java.util.concurrent.locks.StampedLock` */
        type  StampedLock                   = Internal.StampedLock;
        type $StampedLock            = typeof Internal.StampedLock;
        /** `java.util.concurrent.locks.Condition` */
        type  Condition                     = Internal.Condition;
        /** `java.util.concurrent.Semaphore` */
        type  Semaphore                     = Internal.Semaphore;
        type $Semaphore              = typeof Internal.Semaphore;
        /** `java.util.concurrent.CountDownLatch` */
        type  CountDownLatch                = Internal.CountDownLatch;
        type $CountDownLatch         = typeof Internal.CountDownLatch;
        /** `java.util.concurrent.CyclicBarrier` */
        type  CyclicBarrier                 = Internal.CyclicBarrier;
        type $CyclicBarrier          = typeof Internal.CyclicBarrier;
        /** `java.util.concurrent.Exchanger` */
        type  Exchanger                     = Internal.Exchanger;
        type $Exchanger              = typeof Internal.Exchanger;
        /** `java.util.concurrent.Phaser` */
        type  Phaser                        = Internal.Phaser;
        type $Phaser                 = typeof Internal.Phaser;

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

    function synchronized<V>(lock: object, task: Types.CallableOrLambda<V>): V;

    namespace Executors {
        function fixedThreadPool(identifier: string, nThreads: number, threadFactory?: Types.ThreadFactoryOrLambda): ExecutorServiceWrapper;
        function cachedThreadPool(identifier: string, threadFactory?: Types.ThreadFactoryOrLambda): ExecutorServiceWrapper;
        function scheduledThreadPool(identifier: string, nThreads: number, threadFactory?: Types.ThreadFactoryOrLambda): ScheduledExecutorServiceWrapper;
        function singleThreadExecutor(identifier: string, threadFactory?: Types.ThreadFactoryOrLambda): ExecutorServiceWrapper;
        function singleThreadScheduledExecutor(identifier: string, threadFactory?: Types.ThreadFactoryOrLambda): ScheduledExecutorServiceWrapper;
        function workStealingPool(identifier: string, parallelism?: number): ExecutorServiceWrapper;
        function listExecutors(): string[];
        function getExecutor(identifier: string): ExecutorServiceWrapper;
    }

    namespace Atomic {
        const Integer: Alias.$AtomicInteger;
        const Long: Alias.$AtomicLong;
        const Boolean: Alias.$AtomicBoolean;
        const Reference: Alias.$AtomicReference;
        const IntegerArray: Alias.$AtomicIntegerArray;
        const LongArray: Alias.$AtomicLongArray;
        const ReferenceArray: Alias.$AtomicReferenceArray;
    }

    namespace Locks {
        const ReentrantLock: Alias.$ReentrantLock;
        const ReentrantReadWriteLock: Alias.$ReentrantReadWriteLock;
        const StampedLock: Alias.$StampedLock;
        const Semaphore: Alias.$Semaphore;
        const CountDownLatch: Alias.$CountDownLatch;
        const CyclicBarrier: Alias.$CyclicBarrier;
        const Exchanger: Alias.$Exchanger;
        const Phaser: Alias.$Phaser;
    }

    class ExecutorServiceWrapper implements Alias.ExecutorService {
        execute(task: Types.RunnableOrLambda): void;
        submit<T>(task: Types.CallableOrLambda<T>): Alias.Future<T>;
        submit<T>(task: Types.RunnableOrLambda, result: T): Alias.Future<T>;
        invokeAny<T>(tasks: Alias.Collection<Types.CallableOrLambda<T>>, timeout?: number, timeUnit?: Alias.TimeUnit_): T;
        invokeAll<T>(tasks: Alias.Collection<Types.CallableOrLambda<T>>, timeout?: number, timeUnit?: Alias.TimeUnit_): Alias.List<Alias.Future<T>>;
        isShutdown(): boolean;
        isTerminated(): boolean;
        shutdown(): void;
        shutdownNow(): Alias.List<Alias.Runnable>;
        awaitTermination(timeout: number, unit: Alias.TimeUnit_): boolean;
        get terminated(): boolean;
    }

    class ScheduledExecutorServiceWrapper extends ExecutorServiceWrapper implements Alias.ScheduledExecutorService {
        schedule<V>(task: () => V, delay: number, unit: Alias.TimeUnit_): Alias.ScheduledFuture<V>;
        scheduleAtFixedRate(task: () => void, initialDelay: number, period: number, unit: Alias.TimeUnit_): Alias.ScheduledFuture<null>;
        scheduleWithFixedDelay(task: () => void, initialDelay: number, delay: number, unit: Alias.TimeUnit_): Alias.ScheduledFuture<null>;
    }

    type theGlobal = {
        threads: Alias.ConcurrentHashMap<string, Alias.Thread>;
        executorServices: Alias.ConcurrentHashMap<string, ExecutorServiceWrapper>;
        classLoader: Alias.DefiningClassLoader;
    };

    namespace Types {
        // Functional Interfaces
        type CallableOrLambda<V> = Alias.Callable<V> | (() => V);
        type RunnableOrLambda = Alias.Runnable | (() => void);
        type ThreadFactoryOrLambda = Alias.ThreadFactory | ((runnable: Alias.Runnable) => Alias.Thread);
    }

}
