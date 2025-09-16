// Handlers
import MetadataHandler from "../MetadataHandler"

// Types
import type { Target, TargetMetadata } from "../../types/General"
import type { TempMetadataValue } from "./types"
import type { ScopeMetadata } from "../EntityMetadata"
import type { Collection, Pagination } from "../../BaseEntity"

class TempMetadata extends WeakMap<
    Target,
    TempMetadataValue
> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public reply(
        target: Target,
        source: Target
    ): this {
        this.set(target, {
            metadata: this.get(source)?.metadata
                ?? MetadataHandler.loadMetadata(source),

            collection: this.get(source)?.collection,
            pagination: this.get(source)?.pagination,
            scope: this.get(source)?.scope
        })

        return this
    }

    // ------------------------------------------------------------------------

    public getMetadata<T extends Target>(target: T): TargetMetadata<T> {
        return this.get(target)?.metadata as TargetMetadata<T>
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

    public setMetadata(target: Target, metadata: TargetMetadata<Target>): (
        this
    ) {
        this.set(target, {
            ...this.get(target),
            metadata
        })

        return this
    }

    // ------------------------------------------------------------------------

    public setScope(target: Target, scope: ScopeMetadata): this {
        this.set(target, {
            ...this.get(target),
            scope
        })

        return this
    }

    // ------------------------------------------------------------------------

    public setCollection(target: Target, collection: typeof Collection): this {
        this.set(target, {
            ...this.get(target),
            collection
        })

        return this
    }
}

export default new TempMetadata