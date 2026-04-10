declare namespace ProxyJS {
    
    function proxy<T>(obj: T, handler: ProxyHandler<T>): T;

}

declare const ProxyJS: typeof ProxyJS;
