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
import type { EntityTarget, PolymorphicEntityTarget } from "../../types/General"
import type { ManyRelationMetadatatype } from "../../Metadata"
import type { ManyRelationHandlerSQLBuilder } from "../../SQLBuilders"
import type {
    ConditionalQueryOptions,
    UpdateAttributes
} from "../../SQLBuilders"

/** Many relation handler */
export default abstract class ManyRelation<
    Target extends object,
    Related extends EntityTarget | PolymorphicEntityTarget
> extends Array<InstanceType<Related>> {
    /** @internal */
    private _relatedMetadata?: EntityMetadata | PolymorphicEntityMetadata

    /** @internal */
    constructor(
        /** @internal */
        protected metadata: ManyRelationMetadatatype,

        /** @internal */
        protected target: Target,

        /** @internal */
        protected related: Related,
        ...instances: InstanceType<Related>[]
    ) {
        super(...instances)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected abstract get sqlBuilder(): ManyRelationHandlerSQLBuilder

    // ------------------------------------------------------------------------

    /** @internal */
    protected get queryExecutionHandler(): (
        RelationQueryExecutionHandler<Related>
    ) {
        return MySQL2QueryExecutionHandler.relation(this.related)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected get relatedMetadata(): EntityMetadata | PolymorphicEntityMetadata {
        return this._relatedMetadata ?? this.loadRelatedMetadata()
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected get relatedPrimary(): keyof InstanceType<Related> {
        return this.relatedMetadata.columns.primary.name as (
            keyof InstanceType<Related>
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Load related entities matched by conditional where options
     * @param where - conditional where options
     * @returns - 
     */
    public async load(
        where?: ConditionalQueryOptions<InstanceType<Related>>
    ): Promise<this> {
        return this.mergeResults(
            await this.queryExecutionHandler.executeFind(
                this.sqlBuilder.loadSQL(where)
            )
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Load the first related entity matched by conditional where options and
     * returns
     * @param where - Conditional where options
     * @returns - Related entity instance or `null`
     */
    public async loadOne(
        where?: ConditionalQueryOptions<InstanceType<Related>>
    ): Promise<InstanceType<Related> | null> {
        return this.mergeResult(
            await this.queryExecutionHandler
                .executeFindOne(this.sqlBuilder.loadOneSQL(where))
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Update all related entities registers matched by conditional where
     * options
     * @param attributes - Update attributes data 
     * @param where - Conditional where options
     * @returns - A result header with details of operation
     */
    public update(
        attributes: UpdateAttributes<InstanceType<Related>>,
        where?: ConditionalQueryOptions<InstanceType<Related>>
    ): Promise<ResultSetHeader> {
        return this.queryExecutionHandler
            .executeUpdate(this.sqlBuilder.updateSQL(attributes, where))
    }

    // ------------------------------------------------------------------------

    /**
     * Delete all related entities register matched by conditional where
     * options
     * @param where - Conditional where options
     * @returns - Delete result
     */
    public delete(where?: ConditionalQueryOptions<InstanceType<Related>>): (
        Promise<DeleteResult>
    ) {
        return this.queryExecutionHandler
            .executeDelete(this.sqlBuilder.deleteSQL(where))
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected mergeResult(result: InstanceType<Related> | null): (
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

    /** @internal */
    protected mergeResults(results: InstanceType<Related>[]): this {
        results.map(result => this.mergeResult(result) as (
            InstanceType<Related>
        ))

        return this
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private loadRelatedMetadata(): EntityMetadata | PolymorphicEntityMetadata {
        this._relatedMetadata = MetadataHandler.loadMetadata(this.related)
        return this._relatedMetadata
    }
}