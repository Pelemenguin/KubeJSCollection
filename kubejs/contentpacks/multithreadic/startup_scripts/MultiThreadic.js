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

let loadSpecial = (() => {

const $NativeJavaClass  = Java.loadClass("dev.latvian.mods.rhino.NativeJavaClass");

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
 */
return (className) => {
    let clazz = loadSpecial(className);
    return new $NativeJavaClass(currentContext, $ScriptableObject.getTopLevelScope({}), clazz);
}

})();

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
const $HashMap           = Java.loadClass("java.util.HashMap");
const $Object            = Java.loadClass("java.lang.Object");
/** @type {typeof Internal.Thread} */
const $Thread            = loadSpecial("java.lang.Thread");
const $ConcurrentHashMap = Java.loadClass("java.util.concurrent.ConcurrentHashMap");

const $Context    = Java.loadClass("dev.latvian.mods.rhino.Context");
const $Function   = Java.loadClass("dev.latvian.mods.rhino.Function");
const $Scriptable = Java.loadClass("dev.latvian.mods.rhino.Scriptable");

//#endregion

const threadInfos = getOrDefault(theGlobal, "threads", () => new $ConcurrentHashMap());

/** @type {Internal.Class<dev.latvian.mods.rhino.Function>} */
let functionClass = $Function.__javaObject__;
// call(arg0: Internal.Context_, arg1: Internal.Scriptable_, arg2: Internal.Scriptable_, arg3: any[]): any;
let functionCallMethod = functionClass.getMethod("call", $Context, $Scriptable, $Scriptable, $Object.__javaObject__.arrayType());

// Force conversion
let emptyArr = $Arrays["copyOf(java.lang.Object[],int)"]([], 0);

/** @type {typeof MultiThreadic} */
let exported = {
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

        /** @type {MultiThreadic.Types.TypedMap<MultiThreadic.ThreadInfo>} */
        let threadInfo;
        if (threadInfos.containsKey(identifier)) {
            console.warn(`Thread with identifier '${identifier}' already exists, returning null. If you want to create a new thread, please use a different identifier or stop the previous thread`);
            return null;
        }
        threadInfo = new $HashMap();
        let scope = $ScriptableObject.getTopLevelScope(task);
        threadInfo.put("thread", new $Thread(() => {
            // Rhino won't convert automatically as `invoke` accepts `Object[]`, not any specific types
            // So we use manually converted `emptyArr`
            let context = $Context.enter();
            threadInfo.put("context", context);
            functionCallMethod.invoke(task, context, scope, null, emptyArr);
        }, CONFIG.THREAD_NAME_PREFIX + identifier));
        threadInfos.put(identifier, threadInfo);
        // TODO: Currently we are testing the creation of threads
        //       After test, we should check if there is previously created threads in the global,
        //       interrupt them before create a new one
        return threadInfo.get("thread");
    },
    listThreads() {
        let list = [];
        threadInfos.keySet().forEach(s => list.push(s));
        return list;
    },
    getThread(identifier) {
        let threadInfo = threadInfos.get(identifier);
        if (threadInfo == null) return null;
        return threadInfo.get("thread");
    },
    stopThread(identifier, waitTimeInMillis) {
        let threadInfo = threadInfos.get(identifier);
        if (threadInfo == null) return true;
        let thread = threadInfo.get("thread");
        if (!thread.isAlive()) {
            threadInfos.remove(identifier);
            return true;
        }
        thread.interrupt();
        waitTimeInMillis = waitTimeInMillis || 1000;
        thread.join(waitTimeInMillis);
        if (thread.isAlive()) {
            return false;
        } else {
            threadInfos.remove(identifier);
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
    CONFIG: CONFIG
};

return Object.freeze(exported);

})();

try {
    ContentPacks.putShared("pelemenguin.multithreadic", MultiThreadic);
} catch (e) {}

global.MultiThreadic = MultiThreadic;
