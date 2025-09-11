import ScopeMetadata from "./ScopeMetadata"
import ScopeMetadataHandler from "./ScopeMetadataHandler"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types/General"

import type { FindQueryOptions } from "../../../SQLBuilders"
import type { Scope, ScopeFunction } from "./types"

export default class ScopesMetadata extends Map<
    string,
    ScopeMetadata | ScopeFunction
> {
    public default?: ScopeMetadata

    constructor(
        public target: EntityTarget | PolymorphicEntityTarget,
        scopes?: { [K: string]: Scope }
    ) {
        super()
        this.register()
        if (scopes) this.registerScopes(scopes)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getScope(name: string, ...args: any[]): ScopeMetadata | undefined {
        const value = this.get(name)
        if (!value) return

        return typeof value === 'object'
            ? value
            : new ScopeMetadata(value(...args))
    }

    // ------------------------------------------------------------------------

    public setDefault<T extends EntityTarget | PolymorphicEntityTarget = any>(
        scope: FindQueryOptions<InstanceType<T>>
    ): void {
        this.default = new ScopeMetadata(scope)
    }

    // ------------------------------------------------------------------------

    public registerScopes(scopes: { [K: string]: Scope }): void {
        for (const [name, scope] of Object.entries(scopes)) this.set(
            name,
            typeof scope === 'object'
                ? new ScopeMetadata(scope)
                : scope
        )

    }

    // Privates ---------------------------------------------------------------
    private register() {
        Reflect.defineMetadata('scopes', this, this.target)
    }

    // Static Methods =========================================================
    // Publics ================================================================
    public static find(target: EntityTarget | PolymorphicEntityTarget): (
        ScopesMetadata | undefined
    ) {
        return Reflect.getOwnMetadata('scopes', target)
    }

    // ------------------------------------------------------------------------

    public static build(target: EntityTarget | PolymorphicEntityTarget) {
        return new ScopesMetadata(target)
    }

    // ------------------------------------------------------------------------

    public static findOrBuild(target: EntityTarget | PolymorphicEntityTarget) {
        return this.find(target) ?? this.build(target)
    }
}

export {
    ScopeMetadata,
    ScopeMetadataHandler,

    type Scope,
    type ScopeFunction
}