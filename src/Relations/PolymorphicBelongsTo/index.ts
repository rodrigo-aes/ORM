import OneRelation from "../OneRelation"

// SQL Builders
import { PolymorphicBelongsToHandlerSQLBuilder } from "../../SQLBuilders"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type RelationQueryExecutionHandler
} from "../../Handlers"

// Types
import type { PolymorphicEntityTarget } from "../../types"
import type { PolymorphicBelongsToMetadata } from "../../Metadata"

export default class PolymorphicBelongsTo<
    Target extends object,
    Related extends PolymorphicEntityTarget
> extends OneRelation<Target, Related> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: PolymorphicBelongsToMetadata,

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
        PolymorphicBelongsToHandlerSQLBuilder<Target, Related>
    ) {
        return new PolymorphicBelongsToHandlerSQLBuilder(
            this.metadata,
            this.target
        )
    }
}