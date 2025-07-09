import ManyRelation from "../ManyRelation"

import type BaseEntity from "../../BaseEntity"
import type { EntityTarget } from "../../../types/General"
import type { BelongsToManyMetadata } from "../../Metadata"
import type {
    ConditionalQueryOptions,
    CreationAttributes,
    UpdateOrCreateAttibutes
} from "../../QueryBuilder"

export default class BelongsToMany<
    T extends EntityTarget,
    Parent extends BaseEntity
> extends ManyRelation<T> {
    constructor(
        protected metadata: BelongsToManyMetadata,
        protected parent: Parent
    ) {
        super()
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get primaryKeyName(): keyof InstanceType<T> {
        return this.metadata.entity.columns.primary.name as (
            keyof InstanceType<T>
        )
    }

    // ------------------------------------------------------------------------

    protected get whereOptions(): (
        ConditionalQueryOptions<InstanceType<T>>
    ) {
        return {}
    }
}