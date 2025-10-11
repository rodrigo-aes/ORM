import MetadataMap from "../../MetadataMap"

import ScopeMetadata from "./ScopeMetadata"
import ScopeMetadataHandler from "./ScopeMetadataHandler"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types"

import type { FindQueryOptions } from "../../../SQLBuilders"
import type { Scope, ScopeFunction, ScopesMetadataJSON } from "./types"

// Exceptions
import type { MetadataErrorCode } from "../../../Errors"

export default class ScopesMetadata extends MetadataMap<
    string,
    ScopeMetadata | ScopeFunction
> {
    protected static override readonly KEY: string = 'scopes-metadata'
    protected readonly KEY: string = ScopesMetadata.KEY
    protected readonly UNKNOWN_ERROR_CODE?: MetadataErrorCode = 'UNKNOWN_SCOPE'

    public default?: ScopeMetadata

    constructor(
        public target: EntityTarget | PolymorphicEntityTarget,
        scopes?: { [K: string]: Scope }
    ) {
        super()
        this.init()

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

    // ------------------------------------------------------------------------

    public toJSON(): ScopesMetadataJSON {
        return {
            default: this.default?.toJSON(),
            ...Object.fromEntries(this.entries())
        }
    }
}

export {
    ScopeMetadata,
    ScopeMetadataHandler,

    type Scope,
    type ScopeFunction,
    type ScopesMetadataJSON
}