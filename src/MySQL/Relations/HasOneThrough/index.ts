import OneRelation from "../OneRelation"

// SQL Builders
import { HasOneThroughHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { EntityTarget } from "../../../types/General"
import type { HasOneThroughMetadata } from "../../Metadata"

export default class HasOneThrough<
    Target extends object,
    Related extends EntityTarget
> extends OneRelation<Target, Related> {
    constructor(
        protected metadata: HasOneThroughMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get sqlBuilder(): (
        HasOneThroughHandlerSQLBuilder<Target, Related>
    ) {
        return new HasOneThroughHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}