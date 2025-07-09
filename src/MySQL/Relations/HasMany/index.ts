import ManyRelation from "../ManyRelation"

import type BaseEntity from "../../BaseEntity"
import type { EntityTarget } from "../../../types/General"
import type { HasManyMetadata } from "../../Metadata"
import type {
    ConditionalQueryOptions,
    CreationAttributes,
    UpdateOrCreateAttibutes
} from "../../QueryBuilder"

export default class HasMany<
    T extends EntityTarget,
    Parent extends BaseEntity
> extends ManyRelation<T> {
    constructor(
        protected metadata: HasManyMetadata,
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

    protected get whereOptions(): ConditionalQueryOptions<InstanceType<T>> {
        return {
            [this.metadata.foreignKey.name]: this.parent[
                this.parentMetadata.columns.primary.name as (
                    keyof typeof this.parent
                )
            ]
        } as (
                ConditionalQueryOptions<InstanceType<T>>
            )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public create(attributes: CreationAttributes<InstanceType<T>>): (
        Promise<InstanceType<T>>
    ) {
        return this.getRepository().create(attributes)
    }

    // ------------------------------------------------------------------------

    public createMany(attributes: CreationAttributes<InstanceType<T>>[]): (
        Promise<InstanceType<T>[]>
    ) {
        return this.getRepository().createMany(attributes)
    }

    // ------------------------------------------------------------------------

    public updateOrCreate(
        attributes: UpdateOrCreateAttibutes<InstanceType<T>>
    ): Promise<InstanceType<T>> {
        return this.getRepository().updateOrCreate({
            ...attributes,
            ...this.whereOptions
        })
    }
}