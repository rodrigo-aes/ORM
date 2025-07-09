import OneRelation from "../OneRelation"

import type { EntityTarget } from "../../../types/General"
import type BaseEntity from "../../BaseEntity"
import type { HasOneMetadata } from "../../Metadata"

import type {
    ConditionalQueryOptions,
    CreationAttributes,
    UpdateOrCreateAttibutes
} from "../../QueryBuilder"

export default class HasOne<
    T extends EntityTarget,
    Parent extends BaseEntity
> extends OneRelation<T> {
    constructor(
        protected metadata: HasOneMetadata,
        protected parent: Parent
    ) {
        super()
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get whereOptions(): ConditionalQueryOptions<InstanceType<T>> {
        return {
            [this.metadata.foreignKey.name]: this.parent[
                this.parentMetadata.columns.primary.name as (
                    keyof Parent
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
        return this.getRepository().create({
            ...attributes,
            ...this.whereOptions
        }) as (
                Promise<InstanceType<T>>
            )
    }

    // ------------------------------------------------------------------------

    public updateOrCreate(
        attributes: UpdateOrCreateAttibutes<InstanceType<T>>
    ): Promise<InstanceType<T>> {
        return this.getRepository().updateOrCreate({
            ...attributes,
            ...this.whereOptions
        }) as (
                Promise<InstanceType<T>>
            )
    }
}