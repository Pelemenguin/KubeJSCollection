declare namespace ProxyJS {

    const Proxy: typeof globalThis.Proxy;
    function proxy<T>(target: T, handler: ProxyHandler<T>): T;

}

declare const ProxyJS: typeof ProxyJS;
