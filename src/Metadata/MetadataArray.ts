import type { Target, Constructor } from "../types"

// Handlers
import MetadataHandler from "./MetadataHandler"

// Exceptions
import PolyORMException, { type MetadataErrorCode } from "../Errors"

export default abstract class MetadataArray<
    T extends any = any
> extends Array<T> {
    protected abstract readonly KEY: string
    protected readonly SEARCH_KEYS: (keyof T | string)[] = []
    protected readonly UNKNOWN_ERROR_CODE?: MetadataErrorCode
    protected readonly SHOULD_REGISTER: boolean = true

    constructor(public target?: Target, ...childs: T[]) {
        super(...childs)

        if (this.SHOULD_REGISTER) this.register()
        if (target) this.mergeParentsChilds()
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static override get [Symbol.species](): typeof Array {
        return Array
    }

    // Protecteds -------------------------------------------------------------
    protected static get KEY(): string {
        throw new Error
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public search(search: any): T | undefined {
        return this.find(child => this.SEARCH_KEYS.some(
            key => child[key as keyof T] === search
        ))
    }

    // ------------------------------------------------------------------------

    public findOrThrow(search: any): T {
        return this.search(search)! ?? this.throwUnknownChildError(search)
    }

    // ------------------------------------------------------------------------

    public add(...childs: T[]): this {
        this.push(...childs)
        return this
    }

    // ------------------------------------------------------------------------

    public set(search: any, data: Partial<{ [K in keyof T]: T[K] }>): void {
        const child = this.search(search)
        Object.assign(child as any, data)
    }

    // ------------------------------------------------------------------------

    public toJSON(): any {
        return Array.from(this)
    }

    // Protecteds -------------------------------------------------------------
    protected register() {
        Reflect.defineMetadata(this.KEY, this, this.target ?? this.constructor)
    }

    // Privates ---------------------------------------------------------------
    private mergeParentsChilds(): void {
        if (this.target) this.push(...(this.constructor as (
            Constructor<MetadataArray> & typeof MetadataArray
        ))
            .parentsChilds(this.target)
        )
    }

    // ------------------------------------------------------------------------

    private throwUnknownChildError(search: any): void {
        const source: string = typeof search === 'string' ? search : (
            search.name ?? search.toString() ?? search
        )

        throw this.UNKNOWN_ERROR_CODE
            ? PolyORMException.Metadata.instantiate(
                this.UNKNOWN_ERROR_CODE!, source, this.target!.name
            )
            : new Error(
                `Unknown "${source}" metadata to ${this.target!.name} entity class`
            )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static find<T extends Constructor<MetadataArray>>(
        this: T,
        target?: Target
    ): InstanceType<T> | undefined {
        return Reflect.getOwnMetadata(
            (this as T & typeof MetadataArray).KEY,
            target ?? this
        )
    }

    // ------------------------------------------------------------------------

    public static build<T extends Constructor<MetadataArray>>(
        this: T,
        target?: Target,
        ...args: any[]
    ): InstanceType<T> {
        return new this(target, ...args) as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    public static findOrBuild<T extends Constructor<MetadataArray>>(
        this: T,
        target?: Target,
        ...childs: any[]
    ): InstanceType<T> {
        return (this as T & typeof MetadataArray).find(target)?.add(...childs)
            ?? (this as T & typeof MetadataArray).build(target, ...childs)
    }

    // Privates ---------------------------------------------------------------
    private static parentsChilds<T extends Constructor<MetadataArray>>(
        this: T,
        target: Target
    ): any[] {
        return MetadataHandler.parentTargets(target).flatMap(
            parent => (this as T & typeof MetadataArray).find(parent) ?? []
        )
    }
}