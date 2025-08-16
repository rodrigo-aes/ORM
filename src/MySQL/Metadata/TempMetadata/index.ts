// Types
import type { EntityTarget, EntityUnionTarget } from "../../../types/General"
import type { TempMetadataValue } from "./types"
import type { FindQueryOptions } from "../../Repository"
import type { Collection } from "../../BaseEntity"
import type EntityMetadata from "../EntityMetadata"
import type PolymorphicEntityMetadata from "../PolymorphicEntityMetadata"

class TempMetadata extends WeakMap<
    EntityTarget | EntityUnionTarget,
    TempMetadataValue
> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public reply(
        target: EntityTarget | EntityUnionTarget,
        source: EntityTarget | EntityUnionTarget
    ): this {
        this.set(target, this.get(source) ?? {})
        return this
    }

    // ------------------------------------------------------------------------

    public getMetadata<T extends EntityTarget | EntityUnionTarget>(
        target: T
    ): EntityMetadata | PolymorphicEntityMetadata | undefined {
        return this.get(target)?.metadata
    }

    // ------------------------------------------------------------------------

    public getScope(target: EntityTarget | EntityUnionTarget): (
        FindQueryOptions<any> | undefined
    ) {
        return this.get(target)?.scope
    }

    // ------------------------------------------------------------------------

    public getCollection(target: EntityTarget | EntityUnionTarget): (
        typeof Collection | undefined
    ) {
        return this.get(target)?.collection
    }

    // ------------------------------------------------------------------------

    public setMetadata(
        target: EntityTarget | EntityUnionTarget,
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
        target: EntityTarget | EntityUnionTarget,
        scope: FindQueryOptions<any>
    ): this {
        this.set(target, {
            ...this.get(target),
            scope
        })

        return this
    }

    // ------------------------------------------------------------------------

    public setCollection(
        target: EntityTarget | EntityUnionTarget,
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