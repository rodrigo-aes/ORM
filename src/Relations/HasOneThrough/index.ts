import OneRelation from "../OneRelation"

// SQL Builders
import { HasOneThroughHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { EntityTarget } from "../../types/General"
import type { HasOneThroughMetadata } from "../../Metadata"

/** HasOneThrough relation handler */
export default class HasOneThrough<
    Target extends object,
    Related extends EntityTarget
> extends OneRelation<Target, Related> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: HasOneThroughMetadata,

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
        HasOneThroughHandlerSQLBuilder<Target, Related>
    ) {
        return new HasOneThroughHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}