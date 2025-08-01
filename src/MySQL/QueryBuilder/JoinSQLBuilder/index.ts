import {
    EntityMetadata,
    EntityUnionMetadata,
    PolymorphicBelongsToMetadata,

    type RelationMetadataType
} from "../../Metadata"

import { MetadataHandler } from "../../Metadata"
import { InternalUnionEntities } from "../../BaseEntityUnion"

// Query Builders
import SelectSQLBuilder, { type SelectOptions } from "../SelectSQLBuilder"

import ConditionalSQLBuilder, {
    type ConditionalQueryOptions
} from "../ConditionalSQLBuilder"

import UnionSQLBuilder from "../UnionSQLBuilder"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"
import type { RelationOptions, RelationsOptions } from "./types"

export default class JoinSQLBuilder<
    T extends EntityTarget | UnionEntityTarget
> {
    private metadata: EntityMetadata | EntityUnionMetadata

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

        this.target = this.relation.relatedTarget as T
        this.alias = alias ?? this.handleAlias()
        this.metadata = MetadataHandler.loadMetadata(this.target)
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

    public tableUnionQueryBuilder(): UnionSQLBuilder | undefined {
        if (this.relation instanceof PolymorphicBelongsToMetadata) {
            return new UnionSQLBuilder(
                this.relation.unionName,
                InternalUnionEntities.get(this.relation.unionTargetName)!
            )
        }
    }

    // ------------------------------------------------------------------------

    public hasTableUnion(): boolean {
        return this.relation instanceof PolymorphicBelongsToMetadata
    }

    // Privates ---------------------------------------------------------------
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