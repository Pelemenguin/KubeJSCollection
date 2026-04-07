declare namespace MultiThreadic {

    namespace Alias {

        /** `java.lang.Thread` */
        type  Thread             = Internal.Thread;
        type $Thread      = typeof Internal.Thread;
        /** `java.util.concurrent.ConcurrentMap` */
        type ConcurrentMap<K, V> = Internal.ConcurrentMap<K, V>;
        /** `java.util.concurrent.Executors` */
        type  Executors          = Internal.Executors;
        type $Executors   = typeof Internal.Executors;

    }

    function newThread(identifier: string, task: () => void, promisedCleaupTime: number): Alias.Thread;
    function currentThread(): Alias.Thread;
    function sleep(millis: number): void;
    function isInterruped(): boolean;

    namespace CONFIG {
        const GLOBAL_PROPERTY: string,
        const THREAD_PREFIX: string
    }

}
