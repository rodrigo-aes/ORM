// Handlers
import {
    MySQL2QueryExecutionHandler,
    type RelationQueryExecutionHandler,
    type DeleteResult
} from "../../Handlers"

// Types
import type { ResultSetHeader } from "mysql2"
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"
import type { OneRelationMetadataType } from "../../Metadata"
import type { OneRelationHandlerSQLBuilder } from "../../QueryBuilder"
import type { UpdateAttributes } from "../../QueryBuilder"

export default abstract class OneRelation<
    Target extends object,
    Related extends EntityTarget | UnionEntityTarget
> {
    constructor(
        protected metadata: OneRelationMetadataType,
        protected target: Target,
        protected related: Related
    ) { }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected abstract get sqlBuilder(): OneRelationHandlerSQLBuilder

    // ------------------------------------------------------------------------

    protected get queryExecutionHandler(): (
        RelationQueryExecutionHandler<Related>
    ) {
        return MySQL2QueryExecutionHandler.relation(this.related)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public load(): Promise<InstanceType<Related> | null> {
        return this.queryExecutionHandler.executeFindOne(
            this.sqlBuilder.loadSQL()
        )
    }

    // ------------------------------------------------------------------------

    public update(attributes: UpdateAttributes<InstanceType<Related>>): (
        Promise<ResultSetHeader>
    ) {
        return this.queryExecutionHandler.executeUpdate(
            this.sqlBuilder.updateSQL(attributes)
        )
    }

    // ------------------------------------------------------------------------

    public delete(): Promise<DeleteResult> {
        return this.queryExecutionHandler.executeDelete(
            this.sqlBuilder.deleteSQL()
        )
    }
}