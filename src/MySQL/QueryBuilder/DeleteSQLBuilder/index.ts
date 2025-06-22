import { EntityMetadata, EntityUnionMetadata } from "../../Metadata"

import BaseEntity from "../../BaseEntity"
import EntityUnion from "../../EntityUnion"

// SQL Builders
import ConditionalSQLBuilder, {
    type ConditionalQueryOptions
} from "../ConditionalSQLBuilder"

// Handlers
import { MetadataHandler } from "../../Metadata"
import { ConditionalQueryJoinsHandler } from "../../Handlers"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"

export default class DeleteSQLBuilder<
    T extends EntityTarget | UnionEntityTarget
> {
    protected metadata: EntityMetadata | EntityUnionMetadata

    public alias: string

    constructor(
        public target: T,
        public where: (
            ConditionalQueryOptions<InstanceType<T>> |
            BaseEntity |
            EntityUnion<any>
        ),
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target)

        if (this.where instanceof EntityUnion) this.where = (
            this.where.toSourceEntity()
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            DELETE ${this.alias} FROM ${this.handleTableName()} ${this.alias}
            ${this.joinsSQL()}
            ${this.whereSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public joinsSQL(): string {
        return (this.isConditional()) ?
            new ConditionalQueryJoinsHandler(
                this.target,
                this.where as ConditionalQueryOptions<InstanceType<T>>,
                undefined,
                this.alias
            )
                .joins()
                .map(join => join.SQL())
                .join(', ')
            : ''
    }

    // ------------------------------------------------------------------------

    public whereSQL(): string {
        return ConditionalSQLBuilder.where(
            this.target,
            this.whereOptions(),
            this.alias
        )
            .SQL()
    }

    // Privates ---------------------------------------------------------------
    private handleTableName(): string {
        if (this.metadata instanceof EntityUnionMetadata) return (
            this.metadata.sourceMetadata[
                (this.where as BaseEntity).constructor.name
            ]
                .tableName
        )

        else return this.metadata.tableName
    }

    // ------------------------------------------------------------------------

    private isConditional(): boolean {
        return (
            !(this.where instanceof BaseEntity) &&
            !(this.where instanceof EntityUnion)
        )
    }

    // ------------------------------------------------------------------------

    private whereOptions(): ConditionalQueryOptions<InstanceType<T>> {
        if (this.isConditional()) return this.where as (
            ConditionalQueryOptions<InstanceType<T>>
        )

        else {
            const primaryName = this.metadata.columns.primary.name as (
                keyof ConditionalQueryOptions<InstanceType<T>>
            )

            return {
                [primaryName]: (this.where as BaseEntity)[
                    primaryName as keyof BaseEntity
                ]
            } as (
                    ConditionalQueryOptions<InstanceType<T>>
                )
        }
    }
}
