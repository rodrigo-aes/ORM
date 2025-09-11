// Handlers
import MetadataHandler from "../MetadataHandler"

// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../types/General"
import type { TempMetadataValue } from "./types"
import type { Collection, Pagination } from "../../BaseEntity"
import type EntityMetadata from "../EntityMetadata"
import type { ScopeMetadata } from "../EntityMetadata"
import type PolymorphicEntityMetadata from "../PolymorphicEntityMetadata"

class TempMetadata extends WeakMap<
    EntityTarget | PolymorphicEntityTarget,
    TempMetadataValue
> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public reply(
        target: EntityTarget | PolymorphicEntityTarget,
        source: EntityTarget | PolymorphicEntityTarget
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

    public getMetadata<T extends EntityTarget | PolymorphicEntityTarget>(
        target: T
    ): EntityMetadata | PolymorphicEntityMetadata | undefined {
        return this.get(target)?.metadata
    }

    // ------------------------------------------------------------------------

    public getScope(target: EntityTarget | PolymorphicEntityTarget): (
        ScopeMetadata | undefined
    ) {
        return this.get(target)?.scope
    }

    // ------------------------------------------------------------------------

    public getCollection(target: EntityTarget | PolymorphicEntityTarget): (
        typeof Collection | undefined
    ) {
        return this.get(target)?.collection
    }

    // ------------------------------------------------------------------------

    public getPagination(target: EntityTarget | PolymorphicEntityTarget): (
        typeof Pagination | undefined
    ) {
        return this.get(target)?.pagination
    }

    // ------------------------------------------------------------------------

    public setMetadata(
        target: EntityTarget | PolymorphicEntityTarget,
        metadata: EntityMetadata | PolymorphicEntityMetadata
    ): this {
        this.set(target, {
            ...this.get(target),
            metadata
        })

        return this
    }

    // ------------------------------------------------------------------------

    public setScope(
        target: EntityTarget | PolymorphicEntityTarget,
        scope: ScopeMetadata
    ): this {
        this.set(target, {
            ...this.get(target),
            scope
        })

        return this
    }

    // ------------------------------------------------------------------------

    public setCollection(
        target: EntityTarget | PolymorphicEntityTarget,
        collection: typeof Collection
    ): this {
        this.set(target, {
            ...this.get(target),
            collection
        })

        return this
    }
}

export default new TempMetadata