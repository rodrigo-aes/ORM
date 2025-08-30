import OneRelation from "../OneRelation"

// SQL Builders
import { BelongsToThroughHandlerSQLBuilder } from "../../SQLBuilders"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type RelationQueryExecutionHandler
} from "../../Handlers"

// Types
import type { EntityTarget } from "../../../types/General"
import type { BelongsToThroughMetadata } from "../../Metadata"

export default class BelongsToThrough<
    Target extends object,
    Related extends EntityTarget
> extends OneRelation<Target, Related> {
    constructor(
        protected metadata: BelongsToThroughMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get sqlBuilder(): (
        BelongsToThroughHandlerSQLBuilder<Target, Related>
    ) {
        return new BelongsToThroughHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}