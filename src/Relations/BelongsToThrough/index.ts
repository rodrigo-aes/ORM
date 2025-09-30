import OneRelation from "../OneRelation"

// SQL Builders
import { BelongsToThroughHandlerSQLBuilder } from "../../SQLBuilders"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type RelationQueryExecutionHandler
} from "../../Handlers"

// Types
import type { EntityTarget } from "../../types"
import type { BelongsToThroughMetadata } from "../../Metadata"

/** BelongsToThrough relation handler */
export default class BelongsToThrough<
    Target extends object,
    Related extends EntityTarget
> extends OneRelation<Target, Related> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: BelongsToThroughMetadata,

        /** @internal */
        protected target: Target,

        /** @internal */
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
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