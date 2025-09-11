import { EntityMetadata, PolymorphicEntityMetadata } from "../../Metadata"

import BaseEntity from "../../BaseEntity"
import BasePolymorphicEntity from "../../BasePolymorphicEntity"

// SQL Builders
import ConditionalSQLBuilder, {
    type ConditionalQueryOptions
} from "../ConditionalSQLBuilder"

// Handlers
import { MetadataHandler, ScopeMetadataHandler } from "../../Metadata"
import { ConditionalQueryJoinsHandler } from "../../Handlers"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../types/General"

export default class DeleteSQLBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

    public alias: string

    constructor(
        public target: T,
        public where: (
            ConditionalQueryOptions<InstanceType<T>> |
            BaseEntity |
            BasePolymorphicEntity<any>
        ),
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target)

        this.applyWhereScope()

        if (this.where instanceof BasePolymorphicEntity) this.where = (
            this.where.toSourceEntity()
        )
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get targetMetadata(): EntityMetadata {
        return this.metadata instanceof PolymorphicEntityMetadata
            ? this.metadata.sourcesMetadata[
            (this.where as BasePolymorphicEntity<any>).entityType
            ]
            : this.metadata
    }

    // ------------------------------------------------------------------------

    protected get tableName(): string {
        return this.targetMetadata.tableName
    }

    // ------------------------------------------------------------------------

    protected get primary(): string {
        return this.targetMetadata.columns.primary.name
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            DELETE ${this.alias} FROM ${this.tableName} ${this.alias}
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
    private applyWhereScope(): void {
        if (
            this.where instanceof BaseEntity ||
            this.where instanceof BasePolymorphicEntity
        ) return

        this.where = ScopeMetadataHandler.applyScope(
            this.target,
            'conditional',
            this.where
        )
    }

    // ------------------------------------------------------------------------

    private isConditional(): boolean {
        return (
            !(this.where instanceof BaseEntity) &&
            !(this.where instanceof BasePolymorphicEntity)
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
                [primaryName]: (this.where as BasePolymorphicEntity<any>)[
                    this.primary as keyof BasePolymorphicEntity<any>
                ]
            } as ConditionalQueryOptions<InstanceType<T>>

        }
    }
}
