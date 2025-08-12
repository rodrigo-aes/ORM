import OneRelation from "../OneRelation"

// SQL Builders
import { PolymorphicBelongsToHandlerSQLBuilder } from "../../QueryBuilder"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type RelationQueryExecutionHandler
} from "../../Handlers"

// Types
import type { EntityUnionTarget } from "../../../types/General"
import type { PolymorphicBelongsToMetadata } from "../../Metadata"

export default class PolymorphicBelongsTo<
    Target extends object,
    Related extends EntityUnionTarget
> extends OneRelation<Target, Related> {
    constructor(
        protected metadata: PolymorphicBelongsToMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get sqlBuilder(): (
        PolymorphicBelongsToHandlerSQLBuilder<Target, Related>
    ) {
        return new PolymorphicBelongsToHandlerSQLBuilder(
            this.metadata,
            this.target
        )
    }
}