// Handlers
import MetadataHandler from "../MetadataHandler"

// Types
import type { Target, TargetMetadata } from "../../types"
import type { PolyORMConnection } from "../ConnectionsMetadata"
import type { ScopeMetadata } from "../EntityMetadata"
import type { Collection, Pagination } from "../../BaseEntity"
import type { TempMetadataValue } from "./types"

class TempMetadata extends WeakMap<Target, TempMetadataValue> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public reply(target: Target, source: Target): this {
        this.set(target, {
            ...this.get(source),
            metadata: this.get(source)?.metadata ?? (
                MetadataHandler.targetMetadata(source)
            )
        })

        return this
    }

    // ------------------------------------------------------------------------

    public getConnection<T extends Target>(target: T): (
        PolyORMConnection | undefined
    ) {
        return this.get(target)?.connection
    }

    // ------------------------------------------------------------------------

    public getMetadata<T extends Target>(target: T): (
        TargetMetadata<T> | undefined
    ) {
        return this.get(target)?.metadata as TargetMetadata<T> | undefined
    }

    // ------------------------------------------------------------------------

    public getScope(target: Target): ScopeMetadata | undefined {
        return this.get(target)?.scope
    }

    // ------------------------------------------------------------------------

    public getCollection(target: Target): typeof Collection | undefined {
        return this.get(target)?.collection
    }

    // ------------------------------------------------------------------------

    public getPagination(target: Target): typeof Pagination | undefined {
        return this.get(target)?.pagination
    }

    // ------------------------------------------------------------------------

    public setConnection(target: Target, connection: PolyORMConnection): (
        this
    ) {
        this.set(target, { ...this.get(target), connection })
        return this
    }

    // ------------------------------------------------------------------------

    public setMetadata(target: Target, metadata: TargetMetadata<Target>): (
        this
    ) {
        this.set(target, { ...this.get(target), metadata })
        return this
    }

    // ------------------------------------------------------------------------

    public setScope(target: Target, scope: ScopeMetadata): this {
        this.set(target, { ...this.get(target), scope })
        return this
    }

    // ------------------------------------------------------------------------

    public setCollection(target: Target, collection: typeof Collection): this {
        this.set(target, { ...this.get(target), collection })
        return this
    }
}

export default new TempMetadata