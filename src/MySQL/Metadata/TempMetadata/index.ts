// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../../types/General"
import type { TempMetadataValue } from "./types"
import type { FindQueryOptions } from "../../Repository"
import type { Collection } from "../../BaseEntity"
import type EntityMetadata from "../EntityMetadata"
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
        this.set(target, this.get(source) ?? {})
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
        FindQueryOptions<any> | undefined
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