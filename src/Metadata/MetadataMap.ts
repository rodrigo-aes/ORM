// Handlers
import MetadataHandler from "./MetadataHandler"

// Types
import type { Target, CollectionTarget, Constructor } from "../types"

// Exceptions
import PolyORMException, { MetadataErrorCode } from "../Errors"

export default abstract class MetadataMap<
    K extends string | number | symbol = string,
    T extends any = any
> extends Map<K, T> {
    protected abstract readonly KEY?: string
    protected readonly UNKNOWN_ERROR_CODE?: MetadataErrorCode
    protected readonly SHOULD_REGISTER: boolean = true

    constructor(public target?: Target | CollectionTarget) {
        super()

        if (this.SHOULD_REGISTER) this.register()
        if (this.target) this.mergeParents()
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static get KEY(): string {
        throw new Error
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public all() {
        return Array.from(this.values())
    }

    // ------------------------------------------------------------------------

    public getOrThrow(key: K): T {
        return this.get(key)! ?? this.throwUnknownError(key)
    }

    // ------------------------------------------------------------------------

    public toJSON(): any {
        return Object.fromEntries(this.entries())
    }

    // Protecteds -------------------------------------------------------------
    protected register() {
        Reflect.defineMetadata(this.KEY, this, this.target ?? this.constructor)
    }

    // Privates ---------------------------------------------------------------
    private mergeParents(): void {
        type C = Constructor<MetadataMap> & typeof MetadataMap

        for (const parent of (this.constructor as C).parents(this.target!))
            for (const [key, value] of parent.entries()) this.set(
                key as K,
                value
            )
    }

    // ------------------------------------------------------------------------

    private throwUnknownError(key: K): void {
        if (this.UNKNOWN_ERROR_CODE) PolyORMException.Metadata.throw(
            this.UNKNOWN_ERROR_CODE!,
            key,
            this.target?.name ?? this.constructor.name
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static find<T extends Constructor<MetadataMap>>(
        this: T,
        target?: Target | CollectionTarget
    ): InstanceType<T> | undefined {
        return Reflect.getOwnMetadata(
            (this as T & typeof MetadataMap).KEY,
            target ?? this
        )
    }

    // ------------------------------------------------------------------------

    public static build<T extends Constructor<MetadataMap>>(
        this: T,
        target?: Target | CollectionTarget,
    ): InstanceType<T> {
        return new this(target) as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    public static findOrBuild<T extends Constructor<MetadataMap>>(
        this: T,
        target?: Target | CollectionTarget
    ): InstanceType<T> {
        return (this as T & typeof MetadataMap).find(target)
            ?? (this as T & typeof MetadataMap).build(target)
    }

    // Privates ---------------------------------------------------------------
    private static parents<T extends Constructor<MetadataMap>>(
        this: T & typeof MetadataMap,
        target: Target | CollectionTarget
    ): InstanceType<T>[] {
        return MetadataHandler.parentTargets(target).flatMap(
            parent => (this as T & typeof MetadataMap).find(parent) ?? []
        )
    }
}