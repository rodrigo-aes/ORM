import {
    MetadataHandler,
    type EntityMetadata,
    type PolymorphicEntityMetadata
} from "../../Metadata"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type RelationQueryExecutionHandler,
    type DeleteResult
} from "../../Handlers"

// Types
import type { ResultSetHeader } from "mysql2"
import type { EntityTarget, PolymorphicEntityTarget } from "../../../types/General"
import type { ManyRelationMetadatatype } from "../../Metadata"
import type { ManyRelationHandlerSQLBuilder } from "../../SQLBuilders"
import type {
    ConditionalQueryOptions,
    UpdateAttributes
} from "../../SQLBuilders"

export default abstract class ManyRelation<
    Target extends object,
    Related extends EntityTarget | PolymorphicEntityTarget
> extends Array<InstanceType<Related>> {
    private _relatedMetadata?: EntityMetadata | PolymorphicEntityMetadata

    constructor(
        protected metadata: ManyRelationMetadatatype,
        protected target: Target,
        protected related: Related,
        ...instances: InstanceType<Related>[]
    ) {
        super(...instances)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected abstract get sqlBuilder(): ManyRelationHandlerSQLBuilder

    // ------------------------------------------------------------------------

    protected get queryExecutionHandler(): (
        RelationQueryExecutionHandler<Related>
    ) {
        return MySQL2QueryExecutionHandler.relation(this.related)
    }

    // ------------------------------------------------------------------------

    protected get relatedMetadata(): EntityMetadata | PolymorphicEntityMetadata {
        return this._relatedMetadata ?? this.loadRelatedMetadata()
    }

    // ------------------------------------------------------------------------

    protected get relatedPrimary(): keyof InstanceType<Related> {
        return this.relatedMetadata.columns.primary.name as (
            keyof InstanceType<Related>
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async load(
        where?: ConditionalQueryOptions<InstanceType<Related>>
    ): Promise<InstanceType<Related>[]> {
        return this.mergeResults(
            await this.queryExecutionHandler
                .executeFind(this.sqlBuilder.loadSQL(where))
        )
    }

    // ------------------------------------------------------------------------

    public async loadOne(
        where?: ConditionalQueryOptions<InstanceType<Related>>
    ): Promise<InstanceType<Related> | null> {
        return this.mergeResult(
            await this.queryExecutionHandler
                .executeFindOne(this.sqlBuilder.loadOneSQL(where))
        )
    }

    // ------------------------------------------------------------------------

    public update(
        attributes: UpdateAttributes<InstanceType<Related>>,
        where?: ConditionalQueryOptions<InstanceType<Related>>
    ): Promise<ResultSetHeader> {
        return this.queryExecutionHandler
            .executeUpdate(this.sqlBuilder.updateSQL(attributes, where))
    }

    // ------------------------------------------------------------------------

    public delete(where?: ConditionalQueryOptions<InstanceType<Related>>): (
        Promise<DeleteResult>
    ) {
        return this.queryExecutionHandler
            .executeDelete(this.sqlBuilder.deleteSQL(where))
    }

    // Privates ---------------------------------------------------------------
    private loadRelatedMetadata(): EntityMetadata | PolymorphicEntityMetadata {
        this._relatedMetadata = MetadataHandler.loadMetadata(this.related)
        return this._relatedMetadata
    }

    // ------------------------------------------------------------------------

    private mergeResult(result: InstanceType<Related> | null): (
        InstanceType<Related> | null
    ) {
        if (!result) return result

        const existent = this.find(existent => (
            existent[this.relatedPrimary] === result[this.relatedPrimary]
        ))

        if (existent) {
            Object.assign(existent, result)
            return existent
        }

        this.push(result)
        return result
    }

    // ------------------------------------------------------------------------

    private mergeResults(results: InstanceType<Related>[]): (
        InstanceType<Related>[]
    ) {
        return results.map(result => this.mergeResult(result) as (
            InstanceType<Related>
        ))
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
}