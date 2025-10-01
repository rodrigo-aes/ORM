import {
    EntityMetadata,
    PolymorphicEntityMetadata,
    PolymorphicBelongsToMetadata,

    type RelationMetadataType
} from "../../Metadata"

import { MetadataHandler } from "../../Metadata"
import { InternalPolymorphicEntities } from "../../BasePolymorphicEntity"

// Query Builders
import SelectSQLBuilder, { type SelectOptions } from "../SelectSQLBuilder"

import ConditionalSQLBuilder, {
    type ConditionalQueryOptions
} from "../ConditionalSQLBuilder"

import UnionSQLBuilder from "../UnionSQLBuilder"

// Types
import type { Target, TargetMetadata } from "../../types"
import type { RelationOptions, RelationsOptions } from "./types"

export default class JoinSQLBuilder<T extends Target> {
    private metadata: TargetMetadata<T>
    private relatedMetadata: TargetMetadata<any>

    public required?: boolean
    public select?: SelectOptions<any>
    public on?: ConditionalQueryOptions<any>

    constructor(
        public target: T,
        public relation: RelationMetadataType,
        options: Omit<RelationOptions<any>, 'relations'>,
        public alias: string = target.name.toLowerCase(),
        public relatedAlias: string = (
            relation.relatedTarget.name.toLowerCase()
        ),
    ) {
        Object.assign(this, options)

        this.metadata = MetadataHandler.targetMetadata(this.target)
        this.relatedMetadata = MetadataHandler.targetMetadata(
            this.relatedTarget
        )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): Target {
        return this.relation.relatedTarget
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
        return `${this.relatedMetadata.tableName} ${this.relatedAlias}`
    }

    // ------------------------------------------------------------------------

    public selectQueryBuilder(): SelectSQLBuilder<any> {
        return new SelectSQLBuilder(
            this.relatedTarget,
            this.select,
            this.relatedAlias
        )
    }

    // ------------------------------------------------------------------------

    public tableUnionQueryBuilder(): UnionSQLBuilder | undefined {
        if (this.relation instanceof PolymorphicBelongsToMetadata) {
            return new UnionSQLBuilder(
                this.relation.relatedTable,
                InternalPolymorphicEntities.get(this.relation.relatedTargetName)!
            )
        }
    }

    // ------------------------------------------------------------------------

    public hasTableUnion(): boolean {
        return this.relation instanceof PolymorphicBelongsToMetadata
    }

    // Privates ---------------------------------------------------------------
    private handleAlias(): string {
        return `${this.relatedAlias}_${this.relation.name}`
    }

    // ------------------------------------------------------------------------

    private onSQL(): string {
        return ConditionalSQLBuilder.on(
            this.relation,
            this.relatedAlias,
            this.relatedAlias,
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