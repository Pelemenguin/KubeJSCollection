// @ts-nocheck

declare namespace LavaAdapter {

    type Intersection<I extends any[]> = I extends [infer I1, ...infer I2] ? I1 & Intersection<I2> : {};
    type Union       <I extends any[]> = I extends [infer I1, ...infer I2] ? I1 | Union       <I2> : {};
    type AnyKeyFrom  <I extends any[]> = I extends [infer I1, ...infer I2] ? keyof I1 | AnyKeyFrom<I2> : never;
    type ExtractFromArray<A extends any[]> = A extends (infer E)[] ? E : never;
    type OneOfMethods<C extends abstract new (...args: any[]) => any, I extends any[], K extends (keyof InstanceType<C>) | AnyKeyFrom<I>>
        = InstanceType<C>[K] extends (...args: any[]) => any ? InstanceType<C>[K]
            : I extends [infer I1, ...infer I2]
            ? (I1[K] extends (...args: any[]) => any ? I1[K] : OneOfMethods<any, I2, K>)
            : ((...args: unknown[]) => unknown);
    type SuperMethods<T> = {
        $super: T;
    };
    type IntersectionWithSuperMethods<T> = T & SuperMethods<T>;

    interface AdapterBuilder<C extends abstract new (...args: any[]) => any, I extends any[]> {
        implementing<I2 extends any[]>(...superInterface: I2): AdapterBuilder<C, [...I, ...I2]>;
        overriding<K extends (keyof InstanceType<C>) | AnyKeyFrom<I>>(
            methodName: K,
            implementation: (this: IntersectionWithSuperMethods<InstanceType<C & Intersection<I>>>, ...args: Parameters<OneOfMethods<C, I, K>>) => ReturnType<OneOfMethods<C, I, K>> | void
        ): this;
        overriding(methodName: string, implementation: (this: IntersectionWithSuperMethods<InstanceType<C & Intersection<I>>>, ...args: unknown[]) => any): this;
        overriding<K extends (keyof InstanceType<C>) | AnyKeyFrom<I>, M extends (C[K] | Intersection<I>[K])>(
            method: M,
            implementation: (this: IntersectionWithSuperMethods<InstanceType<C & Intersection<I>>>, ...args: Parameters<M>) => ReturnType<M> | void
        ): this;
        asClass(): C & (new (...args: any[]) => Intersection<I>);
    }

    function extending(): AdapterBuilder<new () => {}, []>;
    function extending<C extends abstract new (...args: any[]) => any>(superClass: C): AdapterBuilder<C, []>;

}
