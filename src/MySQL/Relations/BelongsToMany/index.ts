import ManyRelation from "../ManyRelation"

import type BaseEntity from "../../BaseEntity"
import type { EntityTarget } from "../../../types/General"
import type { BelongsToManyMetadata } from "../../Metadata"
import type {
    ConditionalQueryOptions,
    CreationAttributes,
    UpdateOrCreateAttibutes
} from "../../QueryBuilder"

import { Exists } from "../../QueryBuilder"

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
        const target = this.metadata.entity
        const joinTable = this.metadata.joinTable
        const targetForeignKey = this.metadata.entityForeignKey.name
        const parentForeignKey = this.metadata.targetForeignKey.name

        return {
            [Exists]: `
                SELECT 1 FROM ${target.tableName} ${target.name}
                WHERE EXISTS(
                    SELECT 1 FROM ${joinTable.tableName}
                        WHERE ${joinTable.tableName}.${targetForeignKey} =
                            ${target.name}.${target.columns.primary.name}
                        AND ${joinTable.tableName}.${parentForeignKey} = 
                            ${this.parentMetadata.name}.${this.parentMetadata.columns.primary.name}
                )
            `
        } as (
                ConditionalQueryOptions<InstanceType<T>>
            )
    }
}