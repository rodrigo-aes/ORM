// Handlers
import {
    MySQL2QueryExecutionHandler,
    type RelationQueryExecutionHandler,
    type DeleteResult
} from "../../Handlers"

// Types
import type { ResultSetHeader } from "mysql2"
import type { EntityTarget, PolymorphicEntityTarget } from "../../types"
import type { OneRelationMetadataType } from "../../Metadata"
import type { OneRelationHandlerSQLBuilder } from "../../SQLBuilders"
import type { UpdateAttributes } from "../../SQLBuilders"

/**
 * One to one relation handler
 */
export default abstract class OneRelation<
    Target extends object,
    Related extends EntityTarget | PolymorphicEntityTarget
> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: OneRelationMetadataType,

        /** @internal */
        protected target: Target,

        /** @internal */
        protected related: Related
    ) { }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected abstract get sqlBuilder(): OneRelationHandlerSQLBuilder

    // ------------------------------------------------------------------------

    /** @internal */
    protected get queryExecutionHandler(): (
        RelationQueryExecutionHandler<Related>
    ) {
        return MySQL2QueryExecutionHandler.relation(this.related)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Load related entity
     * @returns - Related entity intance
     */
    public load(): Promise<InstanceType<Related> | null> {
        return this.queryExecutionHandler.executeFindOne(
            this.sqlBuilder.loadSQL()
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Update related entity in database
     * @param attributes - Update attributes data
     * @returns - Result header containing details of operation
     */
    public update(attributes: UpdateAttributes<InstanceType<Related>>): (
        Promise<ResultSetHeader>
    ) {
        return this.queryExecutionHandler.executeUpdate(
            this.sqlBuilder.updateSQL(attributes)
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Delete related entity in database
     * @returns - Delete result
     */
    public delete(): Promise<DeleteResult> {
        return this.queryExecutionHandler.executeDelete(
            this.sqlBuilder.deleteSQL()
        )
    }
}