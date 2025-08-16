import ScopeMetadataHandler from "./ScopeMetadataHandler"

// Types
import type {
    EntityTarget,
    EntityUnionTarget
} from "../../../../types/General"

import type { FindQueryOptions } from "../../../QueryBuilder"
import type { Scope, ScopeFunction } from "./types"

export default class ScopesMetadata extends Map<string, Scope> {
    public default?: FindQueryOptions<any>

    constructor(
        public target: EntityTarget | EntityUnionTarget,
        scopes?: { [K: string]: Scope }
    ) {
        super()
        this.register()
        if (scopes) this.registerScopes(scopes)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getScopeOptions<T extends EntityTarget | EntityUnionTarget = any>(
        name: string,
        ...args: any[]
    ): FindQueryOptions<InstanceType<T>> {
        const scope = this.get(name)
        if (!scope) throw new Error

        switch (typeof scope) {
            case "object": return scope
            case "function": return scope(...args)
        }
    }

    // ------------------------------------------------------------------------

    public apply<T extends EntityTarget | EntityUnionTarget = any>(
        options: FindQueryOptions<InstanceType<T>>,
        name: string,
        ...args: any[]
    ): FindQueryOptions<InstanceType<T>> {
        return { ...this.getScopeOptions(name, ...args), ...options }
    }

    // ------------------------------------------------------------------------

    public setDefault<T extends EntityTarget | EntityUnionTarget = any>(
        findOptions: FindQueryOptions<InstanceType<T>>
    ): void {
        this.default = findOptions
    }

    // ------------------------------------------------------------------------

    public registerScopes(scopes: { [K: string]: Scope }): void {
        for (const [name, scope] of Object.entries(scopes)) (
            this.set(name, scope)
        )
    }

    // Privates ---------------------------------------------------------------
    private register() {
        Reflect.defineMetadata('scopes', this, this.target)
    }

    // Static Methods =========================================================
    // Publics ================================================================
    public static find(target: EntityTarget | EntityUnionTarget): (
        ScopesMetadata | undefined
    ) {
        return Reflect.getOwnMetadata('scopes', target)
    }

    // ------------------------------------------------------------------------

    public static build(target: EntityTarget | EntityUnionTarget) {
        return new ScopesMetadata(target)
    }

    // ------------------------------------------------------------------------

    public static findOrBuild(target: EntityTarget | EntityUnionTarget) {
        return this.find(target) ?? this.build(target)
    }
}

export {
    ScopeMetadataHandler,

    type Scope,
    type ScopeFunction
}