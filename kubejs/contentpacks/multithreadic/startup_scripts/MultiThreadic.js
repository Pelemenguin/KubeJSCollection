// priority: 2147483647

/// <reference path="../probe/MultiThreadic.d.ts" />

const MultiThreadic = (() => {

/** @type {typeof MultiThreadic.CONFIG} */
const CONFIG = {
    PROPERTY_OF_GLOBAL: "pelemenguin$multithreadic",
    THREAD_NAME_PREFIX: "MultiThreadic-"
};

Object.freeze(CONFIG);

//#region - Bypass class filter

const $String = Java.loadClass("java.lang.String");

const $ScriptableObject = Java.loadClass("dev.latvian.mods.rhino.ScriptableObject");
const $NativeJavaClass  = Java.loadClass("dev.latvian.mods.rhino.NativeJavaClass");

let loadSpecial = (() => {

let $Class_forName = Java.getClass().getClass().getMethod("forName", $String);

let loadSpecial = (className) => {
    let clazz = $Class_forName.invoke(null, className);
    return clazz;
}

let scriptManagerClass = loadSpecial("dev.latvian.mods.kubejs.script.ScriptManager");

/** @type {Internal.Context} */
const currentContext = scriptManagerClass.getMethod("getCurrentContext").invoke(null);

/**
 * @param {string} className 
 * @return {any}
 */
return (className) => {
    let clazz = loadSpecial(className);
    return new $NativeJavaClass(currentContext, $ScriptableObject.getTopLevelScope({}), clazz);
}

})();

/** @type {typeof Internal.ScriptManager} */
const $ScriptManager = loadSpecial("dev.latvian.mods.kubejs.script.ScriptManager");

const currentContext = $ScriptManager.getCurrentContext();

//#endregion

//#region - The global

/** @type {MultiThreadic.theGlobal} */
let theGlobal = global[CONFIG.PROPERTY_OF_GLOBAL];
if (theGlobal == undefined) {
    theGlobal = {};
    global[CONFIG.PROPERTY_OF_GLOBAL] = theGlobal;
}

/**
 * @template T
 * @template {keyof T} K
 * @param {T} obj 
 * @param {K} prop 
 * @param {() => T[K]} defaultProvider 
 */
let getOrDefault = (obj, prop, defaultProvider) => {
    if (prop in obj) {
        return obj[prop];
    } else {
        let value = defaultProvider();
        obj[prop] = value;
        return value;
    }
}

//#endregion

//#region - Java classes

const $Arrays            = Java.loadClass("java.util.Arrays");
const $ArrayList         = Java.loadClass("java.util.ArrayList");
const $Object            = Java.loadClass("java.lang.Object");
/** @type {typeof Internal.Thread} */
const $Thread            =    loadSpecial("java.lang.Thread");
const $ConcurrentHashMap = Java.loadClass("java.util.concurrent.ConcurrentHashMap");
const $Executors         = Java.loadClass("java.util.concurrent.Executors");

const $Context             = Java.loadClass("dev.latvian.mods.rhino.Context");
const $DefiningClassLoader = Java.loadClass("dev.latvian.mods.rhino.DefiningClassLoader");
const $Function            = Java.loadClass("dev.latvian.mods.rhino.Function");
const $Scriptable          = Java.loadClass("dev.latvian.mods.rhino.Scriptable");

const $ClassWriter = loadSpecial("org.objectweb.asm.ClassWriter");
const $Opcodes     = loadSpecial("org.objectweb.asm.Opcodes");

const MultiThreadicClassLoader = getOrDefault(theGlobal, "classLoader", () => new $DefiningClassLoader());

//#endregion

//#region - Task Wrapper

/**
 * @type {typeof MultiThreadic.TaskWrapper}
 */
let TaskWrapper = (() => {

    const CLASS_WRAPPER_CLASS_NAME = "TaskWrapper";

    // If TaskWrapper is already defined in the MultiThreadicClassLoader
    // Return found class instead of creating a new one
    try {
        let clazz = MultiThreadicClassLoader.loadClass(CLASS_WRAPPER_CLASS_NAME);
        return new $NativeJavaClass(currentContext, $ScriptableObject.getTopLevelScope({}), clazz);
    } catch (e) {}

    // public class ClassWrapper implements Runnable, Callable<Object>
    let cw = new $ClassWriter(0);
    cw.visit(
        $Opcodes.V17,
        $Opcodes.ACC_PUBLIC | $Opcodes.ACC_SUPER,
        CLASS_WRAPPER_CLASS_NAME,
        null,
        "java/lang/Object",
        ["java/lang/Runnable", "java/util/concurrent/Callable"]
    );

    // private static final Object[] EMPTY_ARR = new Object[0];
    cw.visitField($Opcodes.ACC_PRIVATE | $Opcodes.ACC_STATIC | $Opcodes.ACC_FINAL, "EMPTY_ARR", "[Ljava/lang/Object;", null, null).visitEnd();

    // private final BaseFunction task;
    cw.visitField($Opcodes.ACC_PRIVATE | $Opcodes.ACC_FINAL, "task", "Ldev/latvian/mods/rhino/BaseFunction;", null, null).visitEnd();

    // <clinit>
    let clinit = cw.visitMethod($Opcodes.ACC_STATIC, "<clinit>", "()V", null, null);
    clinit.visitCode();
    clinit.visitInsn($Opcodes.ICONST_0);
    clinit.visitTypeInsn($Opcodes.ANEWARRAY, "java/lang/Object");
    clinit.visitFieldInsn($Opcodes.PUTSTATIC, CLASS_WRAPPER_CLASS_NAME, "EMPTY_ARR", "[Ljava/lang/Object;");
    clinit.visitInsn($Opcodes.RETURN);
    clinit.visitMaxs(1, 0);
    clinit.visitEnd();

    // public ClassWrapper(BaseFunction task) {
    //     this.task = task;
    // }
    let constructor = cw.visitMethod($Opcodes.ACC_PUBLIC, "<init>", "(Ldev/latvian/mods/rhino/BaseFunction;)V", null, null);
    constructor.visitCode();
    constructor.visitVarInsn($Opcodes.ALOAD, 0);
    constructor.visitInsn($Opcodes.DUP);
    constructor.visitMethodInsn($Opcodes.INVOKESPECIAL, "java/lang/Object", "<init>", "()V", false);
    constructor.visitVarInsn($Opcodes.ALOAD, 1);
    constructor.visitFieldInsn($Opcodes.PUTFIELD, CLASS_WRAPPER_CLASS_NAME, "task", "Ldev/latvian/mods/rhino/BaseFunction;");
    constructor.visitInsn($Opcodes.RETURN);
    constructor.visitMaxs(2, 2);
    constructor.visitEnd();

    // @Override
    // public void run() {
    //     Context cx = Context.enter();
    //     Scriptable scope = this.task.getParentScope();
    //     this.task.call(cx, scope, null, EMPTY_ARR);
    // }
    let runMethod = cw.visitMethod($Opcodes.ACC_PUBLIC, "run", "()V", null, null);
    runMethod.visitCode();
    runMethod.visitVarInsn($Opcodes.ALOAD, 0);
    runMethod.visitFieldInsn($Opcodes.GETFIELD, CLASS_WRAPPER_CLASS_NAME, "task", "Ldev/latvian/mods/rhino/BaseFunction;");
    runMethod.visitInsn($Opcodes.DUP);
    runMethod.visitMethodInsn($Opcodes.INVOKESTATIC, "dev/latvian/mods/rhino/Context", "enter", "()Ldev/latvian/mods/rhino/Context;", false);
    runMethod.visitInsn($Opcodes.SWAP);
    runMethod.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "dev/latvian/mods/rhino/BaseFunction", "getParentScope", "()Ldev/latvian/mods/rhino/Scriptable;", false);
    runMethod.visitInsn($Opcodes.ACONST_NULL);
    runMethod.visitFieldInsn($Opcodes.GETSTATIC, CLASS_WRAPPER_CLASS_NAME, "EMPTY_ARR", "[Ljava/lang/Object;");
    runMethod.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "dev/latvian/mods/rhino/BaseFunction", "call",
        "(Ldev/latvian/mods/rhino/Context;Ldev/latvian/mods/rhino/Scriptable;Ldev/latvian/mods/rhino/Scriptable;[Ljava/lang/Object;)Ljava/lang/Object;", false);
    runMethod.visitInsn($Opcodes.POP);
    runMethod.visitInsn($Opcodes.RETURN);
    runMethod.visitMaxs(5, 1);
    runMethod.visitEnd();

    // @Override
    // public Object call() {
    //     Context cx = Context.enter();
    //     Scriptable scope = this.task.getParentScope();
    //     return this.task.call(cx, scope, null, EMPTY_ARR);
    // }
    let callMethod = cw.visitMethod($Opcodes.ACC_PUBLIC, "call", "()Ljava/lang/Object;", null, null);
    callMethod.visitCode();
    callMethod.visitVarInsn($Opcodes.ALOAD, 0);
    callMethod.visitFieldInsn($Opcodes.GETFIELD, CLASS_WRAPPER_CLASS_NAME, "task", "Ldev/latvian/mods/rhino/BaseFunction;");
    callMethod.visitInsn($Opcodes.DUP);
    callMethod.visitMethodInsn($Opcodes.INVOKESTATIC, "dev/latvian/mods/rhino/Context", "enter", "()Ldev/latvian/mods/rhino/Context;", false);
    callMethod.visitInsn($Opcodes.SWAP);
    callMethod.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "dev/latvian/mods/rhino/BaseFunction", "getParentScope", "()Ldev/latvian/mods/rhino/Scriptable;", false);
    callMethod.visitInsn($Opcodes.ACONST_NULL);
    callMethod.visitFieldInsn($Opcodes.GETSTATIC, CLASS_WRAPPER_CLASS_NAME, "EMPTY_ARR", "[Ljava/lang/Object;");
    callMethod.visitMethodInsn($Opcodes.INVOKEVIRTUAL, "dev/latvian/mods/rhino/BaseFunction", "call",
        "(Ldev/latvian/mods/rhino/Context;Ldev/latvian/mods/rhino/Scriptable;Ldev/latvian/mods/rhino/Scriptable;[Ljava/lang/Object;)Ljava/lang/Object;", false);
    callMethod.visitInsn($Opcodes.ARETURN);
    callMethod.visitMaxs(5, 1);
    callMethod.visitEnd();

    cw.visitEnd();
    let classBytes = cw.toByteArray();
    let clazz = MultiThreadicClassLoader.defineClass(CLASS_WRAPPER_CLASS_NAME, classBytes);
    return new $NativeJavaClass(currentContext, $ScriptableObject.getTopLevelScope({}), clazz);

})();

//#endregion

//#region - Threads

const threads = getOrDefault(theGlobal, "threads", () => new $ConcurrentHashMap());

/**
 * @param {() => void} runnable 
 * @param {string | null} identifier 
 */
let threadFactory = (runnable, identifier) => {
    let task = new TaskWrapper(runnable);
    let thread = identifier ? new $Thread(task, CONFIG.THREAD_NAME_PREFIX + identifier) : new $Thread(task);
    return thread;
};

// Force conversion
let emptyArr = $Arrays["copyOf(java.lang.Object[],int)"]([], 0);

//#endregion

//#region - Executors

const executorServices = getOrDefault(theGlobal, "executorServices", () => new $ConcurrentHashMap());

/**
 * @param {MultiThreadic.Alias.ExecutorService} executor 
 */
const ExecutorServiceWrapper = function(executor) {
    this._delegate = executor;
};

/** @type {MultiThreadic.ExecutorServiceWrapper["execute"]} */
ExecutorServiceWrapper.prototype.execute = function(task) {
    if (typeof task !== "function") {
        throw new TypeError("Task must be a function, but got " + task);
    }
    let wrappedTask = new TaskWrapper(task);
    this._delegate.execute(wrappedTask);
};

/** @type {MultiThreadic.ExecutorServiceWrapper["submit"]} */
ExecutorServiceWrapper.prototype.submit = function() {
    if (arguments.length === 1) {
        // submit as callable
        let task = arguments[0];
        if (typeof task !== "function") {
            throw new TypeError("Task must be a function, but got " + task);
        }
        let wrappedTask = new TaskWrapper(task);
        // Specify overload to avoid ambiguity with submit(Runnable) as they both take 1 argument
        return this._delegate["submit(java.util.concurrent.Callable)"](wrappedTask);
    } else if (arguments.length === 2) {
        // submit as runnable with result
        let task = arguments[0];
        let result = arguments[1];
        if (typeof task !== "function") {
            throw new TypeError("Task must be a function, but got " + task);
        }
        let wrappedTask = new TaskWrapper(task);
        // No need to specify overload as submit(Runnable, Object) is the only submit method that takes 2 arguments
        return this._delegate.submit(wrappedTask, result);
    } else {
        throw new TypeError("submit() takes either 1 or 2 arguments, but got " + arguments.length);
    }
};

/** @type {MultiThreadic.ExecutorServiceWrapper["invokeAny"]} */
ExecutorServiceWrapper.prototype.invokeAny = function() {
    if (arguments.length === 1) {
        /** @type {Internal.Collection<() => T>} */
        let tasks = arguments[0];
        let wrappedTasks = new $ArrayList(tasks.size());
        for (let task of tasks) {
            if (typeof task !== "function") {
                throw new TypeError("Task must be a function, but got " + task);
            }
            wrappedTasks.add(new TaskWrapper(task));
        }
        return this._delegate.invokeAny(wrappedTasks);
    } else if (arguments.length === 3) {
        /** @type {Internal.Collection<() => T>} */
        let tasks = arguments[0];
        let wrappedTasks = new $ArrayList(tasks.size());
        for (let task of tasks) {
            if (typeof task !== "function") {
                throw new TypeError("Task must be a function, but got " + task);
            }
            wrappedTasks.add(new TaskWrapper(task));
        }
        return this._delegate.invokeAny(wrappedTasks, arguments[1], arguments[2]);
    } else {
        throw new TypeError("invokeAny() takes either 1 or 3 arguments, but got " + arguments.length);
    }
};

/** @type {MultiThreadic.ExecutorServiceWrapper["invokeAll"]} */
ExecutorServiceWrapper.prototype.invokeAll = function() {
    if (arguments.length === 1) {
        /** @type {Internal.Collection<() => T>} */
        let tasks = arguments[0];
        let wrappedTasks = new $ArrayList(tasks.size());
        for (let task of tasks) {
            if (typeof task !== "function") {
                throw new TypeError("Task must be a function, but got " + task);
            }
            wrappedTasks.add(new TaskWrapper(task));
        }
        return this._delegate.invokeAll(wrappedTasks);
    } else if (arguments.length === 3) {
        /** @type {Internal.Collection<() => T>} */
        let tasks = arguments[0];
        let wrappedTasks = new $ArrayList(tasks.size());
        for (let task of tasks) {
            if (typeof task !== "function") {
                throw new TypeError("Task must be a function, but got " + task);
            }
            wrappedTasks.add(new TaskWrapper(task));
        }
        return this._delegate.invokeAll(wrappedTasks, arguments[1], arguments[2]);
    } else {
        throw new TypeError("invokeAll() takes either 1 or 3 arguments, but got " + arguments.length);
    }
};

/** @type {MultiThreadic.ExecutorServiceWrapper["isShutdown"]} */
ExecutorServiceWrapper.prototype.isShutdown = function() {
    return this._delegate.isShutdown();
};

/** @type {MultiThreadic.ExecutorServiceWrapper["isTerminated"]} */
ExecutorServiceWrapper.prototype.isTerminated = function() {
    return this._delegate.isTerminated();
};

/** @type {MultiThreadic.ExecutorServiceWrapper["shutdown"]} */
ExecutorServiceWrapper.prototype.shutdown = function() {
    this._delegate.shutdown();
};

/** @type {MultiThreadic.ExecutorServiceWrapper["shutdownNow"]} */
ExecutorServiceWrapper.prototype.shutdownNow = function() {
    return this._delegate.shutdownNow();
};

/** @type {MultiThreadic.ExecutorServiceWrapper["awaitTermination"]} */
ExecutorServiceWrapper.prototype.awaitTermination = function(timeout, unit) {
    return this._delegate.awaitTermination(timeout, unit);
};

Object.defineProperty(ExecutorServiceWrapper.prototype, "terminated", {
    get() {
        return this._delegate.isTerminated();
    }
});

/**
 * @extends {ExecutorWrapper}
 * @param {MultiThreadic.Alias.ScheduledExecutorService} scheduler
 */
const ScheduledExecutorServiceWrapper = function(scheduler) {
    ExecutorServiceWrapper.call(this, scheduler);
};

ScheduledExecutorServiceWrapper.prototype = Object.create(ExecutorServiceWrapper.prototype);
ScheduledExecutorServiceWrapper.prototype.constructor = ScheduledExecutorServiceWrapper;

/** @type {MultiThreadic.ScheduledExecutorServiceWrapper["schedule"]} */
ScheduledExecutorServiceWrapper.prototype.schedule = function(task, delay, unit) {
    if (typeof task !== "function") throw new TypeError("Task must be a function, but got " + task);
    let wrappedTask = new TaskWrapper(task);
    return this._delegate.schedule(wrappedTask, delay, unit);
};

/** @type {MultiThreadic.ScheduledExecutorServiceWrapper["scheduleAtFixedRate"]} */
ScheduledExecutorServiceWrapper.prototype.scheduleAtFixedRate = function(task, initialDelay, period, unit) {
    if (typeof task !== "function") throw new TypeError("Task must be a function, but got " + task);
    let wrappedTask = new TaskWrapper(task);
    return this._delegate.scheduleAtFixedRate(wrappedTask, initialDelay, period, unit);
};

/** @type {MultiThreadic.ScheduledExecutorServiceWrapper["scheduleWithFixedDelay"]} */
ScheduledExecutorServiceWrapper.prototype.scheduleWithFixedDelay = function(task, initialDelay, delay, unit) {
    if (typeof task !== "function") throw new TypeError("Task must be a function, but got " + task);
    let wrappedTask = new TaskWrapper(task);
    return this._delegate.scheduleWithFixedDelay(wrappedTask, initialDelay, delay, unit);
};

/**
 * @param {() => Internal.ExecutorService} creator 
 * @returns {ExecutorServiceWrapper}
 */
let wrapNewExecutor = (creator) => (identifier) => {
    let result;
    executorServices.compute(identifier, (_key, original) => {
        if (original == null || original.isShutdown()) {
            let created = creator();
            result = new ExecutorServiceWrapper(created);
        } else {
            result = original;
        }
        return result;
    });
    return result;
};

/**
 * @param {() => Internal.ScheduledExecutorService} creator 
 * @returns {ScheduledExecutorServiceWrapper}
 */
let wrapNewScheduledExecutor = (creator) => (identifier) => {
    let result;
    executorServices.compute(identifier, (_key, original) => {
        if (original == null || original.isShutdown()) {
            let created = creator();
            result = new ScheduledExecutorServiceWrapper(created);
        } else {
            result = original;
        }
        return result;
    });
    return result;
};

/** @type {typeof MultiThreadic.Executors} */
const ExecutorsWrapper = {
    fixedThreadPool(identifier, nThreads) {
        return wrapNewExecutor(() => $Executors.newFixedThreadPool(nThreads))(identifier);
    },
    cachedThreadPool(identifier) {
        return wrapNewExecutor(() => $Executors.newCachedThreadPool())(identifier);
    },
    scheduledThreadPool(identifier, nThreads) {
        return wrapNewScheduledExecutor(() => $Executors.newScheduledThreadPool(nThreads))(identifier);
    },
    singleThreadExecutor(identifier) {
        return wrapNewExecutor(() => $Executors.newSingleThreadExecutor())(identifier);
    },
    singleThreadScheduledExecutor(identifier) {
        return wrapNewScheduledExecutor(() => $Executors.newSingleThreadScheduledExecutor())(identifier);
    },
    workStealingPool(identifier, parallelism) {
        if (parallelism !== undefined) {
            return wrapNewExecutor(() => $Executors.newWorkStealingPool(parallelism))(identifier);
        } else {
            return wrapNewExecutor(() => $Executors.newWorkStealingPool())(identifier);
        }
    }
};

Object.freeze(ExecutorsWrapper);

//#endregion

//#region - Export

/** @type {typeof MultiThreadic} */
let exported = {
    isInterrupted() {
        return exported.currentThread().isInterrupted();
    },
    currentThread() {
        return $Thread.currentThread();
    },
    newThread(identifier, task) {
        if (typeof identifier !== "string") {
            throw new TypeError("Identifier must be a string, but got " + $String.valueOf(identifier));
        }
        if (typeof task !== "function") {
            throw new TypeError("Task must be a function, but got " + $String.valueOf(task));
        }

        let resultThread = null;
        threads.computeIfAbsent(identifier, (_key) => {
            let thread = threadFactory(task, identifier);
            resultThread = thread;
            return thread;
        });
        return resultThread;
    },
    listThreads() {
        let list = [];
        threads.keySet().forEach(s => list.push(s));
        return list;
    },
    getThread(identifier) {
        return threads.get(identifier);
    },
    stopThread(identifier, waitTimeInMillis) {
        let thread = threads.get(identifier);
        if (thread == null) return true;
        if (!thread.isAlive()) {
            threads.remove(identifier);
            return true;
        }
        thread.interrupt();
        waitTimeInMillis = waitTimeInMillis || 1000;
        thread.join(waitTimeInMillis);
        if (thread.isAlive()) {
            return false;
        } else {
            threads.remove(identifier);
            return true;
        }
    },
    stopThenNewThread(identifier, task, waitTimeInMillis) {
        let stopped = exported.stopThread(identifier, waitTimeInMillis);
        if (!stopped) return null;
        return exported.newThread(identifier, task);
    },
    sleep(millis) {
        $Thread.sleep(millis);
    },
    TaskWrapper: TaskWrapper,
    ExecutorServiceWrapper: ExecutorServiceWrapper,
    CONFIG: CONFIG,
    Executors: ExecutorsWrapper,
    Atomic: {
        Integer:        Java.loadClass("java.util.concurrent.atomic.AtomicInteger"),
        Long:           Java.loadClass("java.util.concurrent.atomic.AtomicLong"),
        Boolean:        Java.loadClass("java.util.concurrent.atomic.AtomicBoolean"),
        Reference:      Java.loadClass("java.util.concurrent.atomic.AtomicReference"),
        IntegerArray:   Java.loadClass("java.util.concurrent.atomic.AtomicIntegerArray"),
        LongArray:      Java.loadClass("java.util.concurrent.atomic.AtomicLongArray"),
        ReferenceArray: Java.loadClass("java.util.concurrent.atomic.AtomicReferenceArray")
    }
};

return Object.freeze(exported);

//#endregion

})();

try {
    ContentPacks.putShared("pelemenguin.multithreadic", MultiThreadic);
} catch (e) {}

global.MultiThreadic = MultiThreadic;
