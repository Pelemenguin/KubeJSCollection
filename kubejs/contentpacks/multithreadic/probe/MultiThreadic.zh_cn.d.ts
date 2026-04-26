// @ts-nocheck

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

/**
 * MultiThreadic 是一个 KubeJS JavaScript 库，允许在 KubeJS 中创建新的线程和执行异步任务。
 * 
 * ## 使用
 * 
 * ### 创建线程
 * 
 * > ```javascript
 * >                                   // 线程名称
 * > let thread = MultiThreadic.newThread("helloThread", () => {
 * >         // 当线程被中断时终止执行，
 * >         // 否则 MultiThreadic 无法停止你创建的线程
 * >     while (!MultiThreadic.isInterrupted()) {
 * >         console.info("Hello! From another thread");
 * >     }
 * > });
 * > 
 * >  // 当同名线程存在时，newThread 不会创建新线程，
 * >  // 而是返回 null，
 * >  // 常见于脚本热重载时
 * > if (thread != null) {
 * >     thread.start();
 * > }
 * > ```
 * 
 * @see {@linkcode newThread}
 * 
 * ### 包装任务
 * 
 * 执行函数时，Rhino 引擎会使用与当前线程**相同的上下文**来执行。
 * 由于 Rhino 上下文对象在同一时刻只能由一个线程使用，
 * 因此若直接将函数作为 `Callable` 或 `Runnable` 交由 Java 执行，
 * 即使你的确让它们在另一个线程上执行了，
 * 但是实际上这些任务会阻塞当前线程，直到执行完成。
 * 
 * MultiThreadic 提供了一个 `TaskWrapper` 来包装需要的任务：
 * 
 * > ```javascript
 * > let task = () => {
 * >     let sum = 0;
 * >     for (let i = 0; i < 10000; i++) {
 * >         sum += Math.sin(i);
 * >     }
 * >     return sum;
 * > };
 * > 
 * > // 如果直接传递 task 到别的线程
 * > // 实际上主线程会被阻塞直到 task 完成
 * > 
 * > // 使用 TaskWrapper 包装这个函数
 * > 
 * > let wrappedTask = new MultiThreadic.TaskWrapper(task);
 * > 
 * > // 其它线程执行 wrappedTask 时将不再直接阻塞
 * > ```
 * 
 * MultiThreadic 的大部分方法（例如 `newThread`、`Executors` 中的方法等）都会自动使用 `TaskWrapper` 来包装传入的函数，
 * 因此你通常不需要手动使用 `TaskWrapper`。
 * 
 * @see {@linkcode TaskWrapper}
 * 
 * ## 类型定义
 * 
 * 由于在 Minecraft 1.20.1 版本上同时存在 ProbeJS 6 与 ProbeJS 7，
 * 它们生成的类型定义文件格式大相径庭。
 * 为了获得正确的类型提示，可以前往 {@linkcode Alias} 命名空间更改别名以匹配你自己的 ProbeJS 生成的类型定义。
 * 
 * 同时，该模块提供了多语言的 `.d.ts` 文件。
 * 使用时，配置 `jsconfig.json` 以忽略其它语言的文件，或者直接删除不需要的文件。
 * 
 * ## KubeLoader
 * 
 * 该模块支持通过 KubeLoader 加载。
 * 当使用 KubeLoader 加载时，使用：
 * 
 * > ```javascript
 * > const MultiThreadic = ContentPacks.getShared("pelemenguin.multithreadic");
 * > // 或更严谨地：
 * > const MultiThreadic = ContentPacks.getShared("startup", "pelemenguin.multithreadic");
 * > ```
 * 
 * 来将其加载的你自己的脚本中。
 * 
 * ---
 * 
 * @author Pelemenguin
 * @version 1.0
 * @license MIT
 * @copyright Pelemenguin 2026
 */
declare namespace MultiThreadic {

    /**
     * 为文档而预定义的别名。
     * 
     * 如果这些与 ProbeJS 生成的文件不匹配，
     * 你可以更改这里以确保你的文档能正常工作。
     */
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
        /** `java.util.concurrent.BlockingQueue` */
        type BlockingQueue<E>               = Internal.BlockingQueue<E>;
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
        /** `java.util.concurrent.RejectedExecutionHandler` */
        type RejectedExecutionHandler       = Internal.RejectedExecutionHandler;
        /** `java.util.concurrent.Semaphore` */
        type  Semaphore                     = Internal.Semaphore;
        type $Semaphore              = typeof Internal.Semaphore;

        /** `dev.latvian.mods.rhino.Context` */
        type Context             = Internal.Context;
        /** `dev.latvian.mods.rhino.DefiningClassLoader` */
        type DefiningClassLoader = Internal.DefiningClassLoader;

    }

    /**
     * MultiThreadic 模块配置。
     * 
     * 在 `startup_scripts` 内的 `MultiThreadic.js` 中配置。
     */
    namespace CONFIG {
        /**
         * `global` 中用于储存 `MultiThreadic` 相关数据的隐藏属性的键。
         * 
         * 该配置项的默认值是 `"pelemenguin$multithreadic"`。
         */
        const PROPERTY_IN_GLOBAL: string;
        /**
         * 所有由 MultiThreadic 创建的线程的名称前缀。
         * 
         * 该配置项的默认值是 `"MultiThreadic-"`。
         */
        const THREAD_NAME_PREFIX: string;
    }

    /**
     * 包装一个函数，使其在被 Java 执行时不会直接阻塞当前线程。
     * 
     * 注意，`TaskWrapper` 实际上是一个实现了 `Runnable` 和 `Callable` 的类，
     * 不要尝试通过调用 JavaScript 函数的方法来执行被包装的函数。
     */
    class TaskWrapper<T> implements Alias.Runnable, Alias.Callable<T> {
        constructor(task: () => T);
        run(): void;
        call(): T;
    }

    /**
     * 检查当前线程是否已被中断，等价于 `MultiThreadic.currentThread().isInterrupted()`。
     * 
     * @returns 如果当前线程已被中断，则返回 `true`；否则返回 `false`。
     */
    function isInterrupted(): boolean;
    /**
     * 获取当前线程的 `Thread` 对象。
     * 
     * @returns 当前线程的 `Thread` 对象。
     */
    function currentThread(): Alias.Thread;
    /**
     * 创建一个新的线程来执行指定的任务。
     * 
     * @param identifier 线程名称。
     * @param task       要在线程上执行的任务。
     * @returns          如果线程创建成功，则返回新线程的 `Thread` 对象；如果已存在同名线程，则返回 `null`。
     * 
     * @example
     * let thread = MultiThreadic.newThread("sinSumCalculator", () => {
     *     let sum = 0;
     *     for (let i = 0; i < 10000; i++) {
     *         sum += Math.sin(i);
     *     }
     *     return sum;
     * });
     * 
     * if (thread != null) {
     *     thread.start();
     * }
     */
    function newThread(identifier: string, task: () => void): Alias.Thread?;
    /**
     * 列出所有由 MultiThreadic 创建的线程的名称。
     * 
     * @returns 由 MultiThreadic 创建的线程的名称列表，名称不包含 {@linkcode CONFIG.THREAD_NAME_PREFIX} 前缀。
     */
    function listThreads(): string[];
    /**
     * 获取由 MultiThreadic 创建的线程。
     * 
     * @param identifier 线程名称
     * @returns          如果存在具有指定名称的线程，则返回该线程的 `Thread` 对象；否则返回 `null`。
     */
    function getThread(identifier: string): Alias.Thread?;
    /**
     * 尝试停止由 MultiThreadic 创建的线程。
     * 
     * @param identifier       线程名称
     * @param waitTimeInMillis 等待线程终止的时间（毫秒）
     * @returns                如果线程不存在或成功终止，则返回 `true`；如果未能在指定时间内终止，则返回 `false`。
     */
    function stopThread(identifier: string, waitTimeInMillis: number = 1000): boolean;
    /**
     * 尝试停止由 MultiThreadic 创建的线程，并在成功停止后创建一个新线程来执行指定的任务。
     * 
     * @param identifier       线程名称
     * @param task             要在线程上执行的任务
     * @param waitTimeInMillis 等待线程终止的时间（毫秒）
     * @returns                如果线程不存在或成功终止，则返回新线程的 `Thread` 对象
     * @throws                 如果存在同名线程且未能在指定时间内终止，则抛出错误
     */
    function stopThenNewThread(identifier: string, task: () => void, waitTimeInMillis: number = 1000): Alias.Thread;
    /**
     * 使当前线程睡眠指定的时间。
     * 
     * @param millis 要睡眠的时间（毫秒）
     */
    function sleep(millis: number): void;

    /**
     * 执行一个函数，若两个 `synchronized` 调用使用同一个对象作为锁，则保证任务不会同时执行。
     * 
     * 这里是一个简单的示例：
     * 
     * > ```javascript
     * > let lock = {};
     * > let data = 0;
     * > 
     * > let someTask = (value) => {
     * >     // 保护内部代码仅被一个线程执行
     * >     MultiThreadic.synchronized(lock, () => {
     * >         let currentData = data;
     * >         console.info("Thread " + MultiThreadic.currentThread().getName() + " read data: " + currentData);
     * >         // 假设这里有一些耗时操作
     * >         MultiThreadic.sleep(1000);
     * >         data = currentData + value;
     * >         console.info("Thread " + MultiThreadic.currentThread().getName() + " updated data to: " + data);
     * >     });
     * > };
     * > 
     * > MultiThreadic.stopThenNewThread("thread1", () => someTask(1)).start();
     * > MultiThreadic.stopThenNewThread("thread2", () => someTask(2)).start();
     * > ```
     * 
     * 这样 `data` 能被正常更新为 `3`。
     * 若不然，则可能出现两个线程同时读取到 `data` 的初始值 `0`，
     * 并最终将 `data` 更新为 `1` 或 `2` 的情况。
     * 
     * @param lock 一个用作锁的任意对象
     * @param task 要执行的任务
     * @returns    任务的返回值
     */
    function synchronized<V>(lock: object, task: () => V): V;

    /**
     * Java 内置的线程池工厂方法。
     */
    namespace Executors {
        /**
         * 参见 [Java API 文档](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/Executors.html#newFixedThreadPool(int))。
         * 
         * 创建一个线程池，该线程池重用固定数量的线程，这些线程从一个共享的无限队列中取任务执行。
         * 在任意时刻，最多有 `nThreads` 个线程在处理任务。
         * 如果在所有线程都处于活动状态时提交了额外的任务，这些任务将会在队列中等待，直到有线程可用。
         * 如果在关闭之前的执行过程中有线程因故障终止，在需要执行后续任务时会创建一个新的线程来替代它。
         * 线程池中的线程将一直存在，直到显式关闭为止。
         * 
         * @param identifier    线程池名称
         * @param nThreads      线程池中的线程数量（&gt; 0）
         * @param threadFactory 用于创建新线程的线程工厂。如果未提供，则使用默认线程工厂
         * @returns             创建的线程池。若同名线程池存在，则返回已有线程池
         */
        function fixedThreadPool(identifier: string, nThreads: number, threadFactory?: (runnable: Alias.Runnable) => Alias.Thread): ExecutorServiceWrapper;
        /**
         * 参见 [Java API 文档](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/Executors.html#newCachedThreadPool())。
         * 
         * 创建一个线程池，根据需要创建新线程，但在有可用的先前构建的线程时会重用它们。
         * 这些线程池通常会提高执行许多短生命周期异步任务的程序的性能。
         * 对 `execute` 的调用将在可用时重用先前构建的线程。
         * 如果没有可用的现有线程，将创建一个新线程并添加到池中。
         * 未使用超过 60 秒的线程将被终止并从缓存中移除。
         * 因此，一个长时间闲置的线程池将不会消耗任何资源。
         * 请注意，具有类似属性但细节不同的线程池（例如，超时参数）可以使用 {@linkcode customThreadPool} 函数创建。
         * 
         * @param identifier    线程池名称
         * @param threadFactory 用于创建新线程的线程工厂。如果未提供，则使用默认线程工厂
         * @returns             创建的线程池。若同名线程池存在，则返回已有线程池
         */
        function cachedThreadPool(identifier: string, threadFactory?: (runnable: Alias.Runnable) => Alias.Thread): ExecutorServiceWrapper;
        /**
         * 参见 [Java API 文档](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/Executors.html#newScheduledThreadPool(int))。
         * 
         * 创建一个线程池，可以调度命令在给定延迟后运行，或定期执行。
         * 
         * @param identifier    线程池名称
         * @param corePoolSize  线程池中的核心线程数量（&ge; 0），即使处于闲置状态也会保留在池中
         * @param threadFactory 用于创建新线程的线程工厂。如果未提供，则使用默认线程工厂
         * @returns             创建的线程池。若同名线程池存在，则返回已有线程池
         */
        function scheduledThreadPool(identifier: string, corePoolSize: number, threadFactory?: (runnable: Alias.Runnable) => Alias.Thread): ScheduledExecutorServiceWrapper;
        /**
         * 参见 [Java API 文档](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/Executors.html#newSingleThreadExecutor())。
         * 
         * 创建一个使用单个工作线程且基于无界队列运行的执行器。
         * （注意，如果该单线程在关闭之前因执行期间失败而终止，则在需要执行后续任务时会有一个新的线程来替代。）
         * 任务保证按顺序执行，并且在任何时刻最多只有一个任务处于活动状态。
         * 与 `fixedThreadPool(1, threadFactory)` 不同，返回的执行器保证不能通过重新配置使用额外的线程。
         * 
         * @param identifier    线程池名称
         * @param threadFactory 用于创建新线程的线程工厂。如果未提供，则使用默认线程工厂
         * @returns             创建的线程池。若同名线程池存在，则返回已有线程池
         */
        function singleThreadExecutor(identifier: string, threadFactory?: (runnable: Alias.Runnable) => Alias.Thread): ExecutorServiceWrapper;
        /**
         * 参见 [Java API 文档](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/Executors.html#newSingleThreadExecutor())。
         * 
         * 创建一个单线程执行器，它可以安排命令在给定延迟后运行，或按周期执行。
         * （注意，如果该单线程在关闭之前因执行期间失败而终止，则在需要执行后续任务时会有一个新的线程来替代。）
         * 任务保证按顺序执行，并且任意时刻最多只有一个任务在运行。
         * 与 `scheduledThreadPool(1, threadFactory)` 不同，返回的执行器保证无法重新配置以使用额外的线程。
         * 
         * @param identifier    线程池名称
         * @param threadFactory 用于创建新线程的线程工厂。如果未提供，则使用默认线程工厂
         * @returns             创建的线程池。若同名线程池存在，则返回已有线程池
         */
        function singleThreadScheduledExecutor(identifier: string, threadFactory?: (runnable: Alias.Runnable) => Alias.Thread): ScheduledExecutorServiceWrapper;
        /**
         * 创建一个自定义线程池。
         * 
         * @param identifier 线程池名称
         * @param parameters 线程池参数
         * @returns          创建的线程池。若同名线程池存在，则返回已有线程池
         */
        function customThreadPool(identifier: string, parameters: Types.ThreadPoolParameters): ExecutorServiceWrapper;
        /**
         * 参见 [Java API 文档](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/Executors.html#newWorkStealingPool(int))。
         * 
         * 创建一个线程池，该线程池维持足够的线程以支持给定的并行级别，并且可以使用多个队列以减少竞争。
         * 并行级别对应于正在参与或可参与任务处理的最大线程数。
         * 实际的线程数量可能会动态增长和缩减。
         * 工作窃取池不保证提交任务的执行顺序。
         * 
         * @param identifier  线程池名称
         * @param parallelism 线程池的并行级别（&ge; 1）。如果未提供，则默认为 `Runtime.getRuntime().availableProcessors()`。
         * @returns           创建的线程池。若同名线程池存在，则返回已有线程池
         */
        function workStealingPool(identifier: string, parallelism?: number): ExecutorServiceWrapper;
        /**
         * 获取所有由 MultiThreadic 创建的线程池的名称。
         * 
         * @returns 由 MultiThreadic 创建的线程池的名称列表
         */
        function listExecutors(): string[];
        /**
         * 获取由 MultiThreadic 创建的线程池。
         * 
         * @param identifier 线程池名称
         */
        function getExecutor(identifier: string): ExecutorServiceWrapper;
    }

    /**
     * Java 内置的原子变量类。
     * 
     * 各个原子变量的详细信息请参见 [Java API 文档](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/atomic/package-summary.html)。
     */
    namespace Atomic {
        const Integer: Alias.$AtomicInteger;
        const Long: Alias.$AtomicLong;
        const Boolean: Alias.$AtomicBoolean;
        const Reference: Alias.$AtomicReference;
        const IntegerArray: Alias.$AtomicIntegerArray;
        const LongArray: Alias.$AtomicLongArray;
        const ReferenceArray: Alias.$AtomicReferenceArray;
    }

    /**
     * Java 内置的锁和同步工具类。
     * 
     * 各个锁的详细信息请参见 [Java API 文档](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/locks/package-summary.html)。
     */
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

    /**
     * 包装 Java 的 `ExecutorService`。
     * 提交任务时会自动使用 `TaskWrapper` 来包装函数，这样就不需要手动使用 `TaskWrapper`。
     */
    class ExecutorServiceWrapper {
        constructor(executorService: Alias.ExecutorService);
        execute(task: () => void): void;
        submit<T>(task: () => T): Alias.Future<T>;
        submit<T>(task: () => void, result: T): Alias.Future<T>;
        invokeAny<T>(tasks: Alias.Collection<() => T>, timeout?: number, timeUnit?: Alias.TimeUnit_): T;
        invokeAll<T>(tasks: Alias.Collection<() => T>, timeout?: number, timeUnit?: Alias.TimeUnit_): Alias.List<Alias.Future<T>>;
        isShutdown(): boolean;
        isTerminated(): boolean;
        shutdown(): void;
        shutdownNow(): Alias.List<Alias.Runnable>;
        awaitTermination(timeout: number, unit: Alias.TimeUnit_): boolean;
        get terminated(): boolean;
        /**
         * 获取被包装的 `ExecutorService` 对象。
         * 除非你确切地知道自己在做什么，否则不建议直接使用该对象来执行任务，
         */
        get _delegate(): Alias.ExecutorService;
    }

    /**
     * 包装 Java 的 `ScheduledExecutorService`。
     * 提交任务时会自动使用 `TaskWrapper` 来包装函数，这样就不需要手动使用 `TaskWrapper`。
     */
    class ScheduledExecutorServiceWrapper extends ExecutorServiceWrapper {
        constructor(scheduledExecutorService: Alias.ScheduledExecutorService);
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
        type ThreadPoolParameters = {
            /**
             * 核心线程数，即使处于闲置状态也会保留在池中。
             */
            corePoolSize?: number;
            /**
             * 最大线程数。
             * 当线程池中的线程数量达到核心线程数时，如果有新的任务提交，且工作队列已满，
             * 则会创建新线程来处理任务，直到线程数量达到最大线程数。
             */
            maximumPoolSize?: number;
            /**
             * 当线程池中的线程数量超过核心线程数时，且线程处于闲置状态的时间超过该值时，线程会被终止并从池中移除。
             */
            keepAliveTime?: number;
            /**
             * `keepAliveTime` 的时间单位。
             */
            timeUnit?: Alias.TimeUnit_;
            /**
             * 用于保存等待执行任务的工作队列。
             */
            workQueue?: Alias.BlockingQueue<Alias.Runnable>;
            /**
             * 用于创建新线程的线程工厂。如果未提供，则使用默认线程工厂
             */
            threadFactory?: (runnable: Alias.Runnable) => Alias.Thread;
            /**
             * 当线程池中的线程数量达到最大线程数时，且工作队列已满时，执行被拒绝的任务的处理程序。
             */
            rejectedExecutionHandler?: Alias.RejectedExecutionHandler;
        };
    }

}
