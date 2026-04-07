// priority: 2147483647

/// <reference path="MultiThreadic.d.ts" />

const MultiThreadic = (() => {

//#region - Config

/** @type {typeof MultiThreadic.CONFIG} */
const CONFIG = {

    GLOBAL_PROPERTY: "pelemenguin$multithreadic",

    THREAD_PREFIX: "MultiThreadic-"

};
Object.freeze(CONFIG);

//#endregion

//#region - Helpers

/**
 * @type {{
 *     threads: MultiThreadic.Alias.ConcurrentMap<string, MultiThreadic.Alias.Thread>,
 *     promisedCleaupTime: MultiThreadic.Alias.ConcurrentMap<string, number>
 * }}
 */
let theGlobal;
if (global[CONFIG.GLOBAL_PROPERTY]) {
    theGlobal = global[CONFIG.GLOBAL_PROPERTY];
} else {
    theGlobal = {};
    global[CONFIG.GLOBAL_PROPERTY] = theGlobal;
}

/**
 * @template {keyof theGlobal} T
 * @param {T} property
 * @param {() => theGlobal[T]} defaultValueProvider
 * @returns {theGlobal[T]}
 */
let getFromGlobal = (property, defaultValueProvider) => {
    if (property in theGlobal) {
        return theGlobal[property];
    } else {
        let result = defaultValueProvider();
        theGlobal[property] = result;
        return result;
    }
}

const $Context         = Java.loadClass("dev.latvian.mods.rhino.Context");
const $NativeJavaClass = Java.loadClass("dev.latvian.mods.rhino.NativeJavaClass");
const context = $Context.enter();
const scope = {};

/** @type {(string) => typeof any} */
let loadSpecial;
{
    let $Class_forName = Java.getClass().getClass().getMethod("forName", Java.loadClass("java.lang.String"));
    loadSpecial = (className) => new $NativeJavaClass(context, scope, $Class_forName.invoke(null, className));
}

//#endregion

//#region - Load classes

/** @type {MultiThreadic.Alias.$Thread} */
const $Thread            =    loadSpecial("java.lang.Thread");
const $ConcurrentHashMap = Java.loadClass("java.util.concurrent.ConcurrentHashMap");
const $Executors         = Java.loadClass("java.util.concurrent.Executors");

//#endregion

/** @type {typeof MultiThreadic} */
let exported = {
    CONFIG: CONFIG
};

//#region - Threads

let threadCache = getFromGlobal("threads", () => new $ConcurrentHashMap());
let promisedCleaupTimes = getFromGlobal("promisedCleaupTime", () => new $ConcurrentHashMap());

/**
 * @param {string} threadIdentifier 
 */
let cleanThread = (threadIdentifier) => {
    let thread = threadCache.get(threadIdentifier);
    if (thread === null) return true;
    if (!thread.isAlive()) {
        threadCache.remove(threadIdentifier);
        return true;
    }
    const WAIT_TIME = promisedCleaupTimes.getOrDefault(threadIdentifier, 10000);
    let waited = 0;
    while (waited < WAIT_TIME) {
        if (thread.isAlive()) {
            try {
                thread.join(100);
            } catch (e) {
                // Ignore InterruptedException, just try to join again
            }
            waited += 100;
        } else {
            threadCache.remove(threadIdentifier);
            console.info(`[MultiThreadic] Cleaned up thread with identifier '${threadIdentifier}'`);
            return true;
        }
    }
    console.info(`[MultiThreadic] Cannot clean up thread with identifier '${threadIdentifier}' within promised time: ${WAIT_TIME}ms`);
    return false;
}

exported.newThread = (identifier, task, promisedCleaupTime) => {
    // For safety, check parameter's types

    // Try converting identifier to a JS string
    identifier = identifier + "";
    // To prevent another overload "new Thread(String)" is used
    if (typeof task === "string") {
        throw new TypeError("Expected 'task' to be a function, got string");
    }

    // It can neither be a Java String
    let clazz = undefined;
    try {
        clazz = task.getClass();
    } catch (e) {} // Ignore if it is not a Java object
    if (clazz != undefined && clazz.getName() === "java.lang.String") {
        throw new TypeError("Expected 'task' to be a function, got Java String");
    }

    let threadName = CONFIG.THREAD_PREFIX + identifier;
    if (threadCache.containsKey(identifier)) {
        try {
            threadCache.get(identifier).interrupt();
        } catch (e) {}
        if (!cleanThread(identifier)) {
            throw new Error(`Failed to clean up existing thread with identifier '${identifier}' after interrupting it. It may still be running, and a new thread cannot be created with the same identifier until it finishes or is cleaned up successfully.`);
        }
    }
    if (promisedCleaupTime !== undefined) {
        promisedCleaupTime = promisedCleaupTime + 0;
        if (typeof promisedCleaupTime !== "number" || isNaN(promisedCleaupTime) || promisedCleaupTime < 0) {
            throw new TypeError("Expected 'promisedCleaupTime' to be a non-negative number, got " + promisedCleaupTime);
        }
        promisedCleaupTimes.put(identifier, promisedCleaupTime);
    }
    let thread = new $Thread(task, threadName);
    threadCache.put(identifier, thread);
    return thread;
};

exported.currentThread = () => {
    return $Thread.currentThread();
};

exported.sleep = (millis) => {
    $Thread.sleep(millis);
}

exported.isInterruped = () => {
    return $Thread.interrupted();
}

return Object.freeze(exported);

})();
