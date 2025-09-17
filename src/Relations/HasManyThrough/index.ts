import ManyRelation from "../ManyRelation"

// SQL Builders
import { HasManyThroughHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { EntityTarget } from "../../types/General"
import type { HasManyThroughMetadata } from "../../Metadata"

/** HasMany relation handler */
export default class HasManyThrough<
    Target extends object,
    Related extends EntityTarget
> extends ManyRelation<Target, Related> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: HasManyThroughMetadata,

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
        HasManyThroughHandlerSQLBuilder<Target, Related>
    ) {
        return new HasManyThroughHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}