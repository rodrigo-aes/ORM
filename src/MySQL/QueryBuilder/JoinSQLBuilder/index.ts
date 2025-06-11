import {
    EntityMetadata,
    PolymorphicBelongsToMetadata,

    type RelationMetadataType
} from "../../Metadata"

// Query Builders
import SelectSQLBuilder, { type SelectOptions } from "../SelectSQLBuilder"

import ConditionalSQLBuilder, {
    type ConditionalQueryOptions
} from "../ConditionalQueryBuilder"

import TableUnionSQLBuilder from "../TableUnionSQLBuilder"

// Types
import type { EntityTarget } from "../../../types/General"
import type { RelationOptions, RelationsOptions } from "./types"

export default class JoinSQLBuilder<T extends EntityTarget> {
    private metadata: EntityMetadata

    public target: T
    public alias: string

    public required?: boolean
    public select?: SelectOptions<InstanceType<T>>
    public on?: ConditionalQueryOptions<InstanceType<T>>

    constructor(
        public relation: RelationMetadataType,
        public parentAlias: string,
        options: Omit<RelationOptions<InstanceType<T>>, 'relations'>,
        alias?: string
    ) {
        Object.assign(this, options)

        this.target = this.handleTarget() as T
        this.alias = alias ?? this.handleAlias()
        this.metadata = this.getMetadata()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return [
            this.joinType(),
            this.tableSQL(),
            this.onSQL(),
        ]
            .join(' ')
    }

    // ------------------------------------------------------------------------

    public joinType(): string {
        return this.required
            ? 'INNER JOIN'
            : 'LEFT JOIN'
    }

    // ------------------------------------------------------------------------

    public tableSQL(): string {
        if (this.relation instanceof PolymorphicBelongsToMetadata) {
            return `${this.parentAlias}_${this.relation.name}`
        }

        return `${this.metadata.tableName} ${this.alias}`
    }

    // ------------------------------------------------------------------------

    public selectQueryBuilder(): SelectSQLBuilder<T> {
        return new SelectSQLBuilder(
            this.target,
            this.select,
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    public tableUnionQueryBuilder(): TableUnionSQLBuilder | undefined {
        if (this.relation instanceof PolymorphicBelongsToMetadata) {
            return new TableUnionSQLBuilder(
                `${this.parentAlias}_${this.relation.name}`,
                this.relation.related()
            )
        }
    }

    // ------------------------------------------------------------------------

    public hasTableUnion(): boolean {
        return (
            this.relation instanceof PolymorphicBelongsToMetadata
        )
    }

    // Privates ---------------------------------------------------------------
    private getMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    private handleTarget(): EntityTarget {
        if (this.relation instanceof PolymorphicBelongsToMetadata) {
            return TableUnionSQLBuilder.findOrBuildUnion(
                this.relation.related(),
                `${this.parentAlias}_${this.relation.name}`
            )
                .target
        }

        return this.relation.relatedTarget
    }

    // ------------------------------------------------------------------------

    private handleAlias(): string {
        return `${this.parentAlias}_${this.relation.name}`
    }

    // ------------------------------------------------------------------------

    private onSQL(): string {
        return ConditionalSQLBuilder.on(
            this.relation,
            this.parentAlias,
            this.alias,
            this.target,
            this.on
        )
            .SQL()
    }
}

export {
    type RelationOptions,
    type RelationsOptions
}