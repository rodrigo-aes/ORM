import HasOneRelation from "../OneRelation/HasOneRelation"

// SQL Builders
import { HasOneHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { EntityTarget } from "../../types"
import type { HasOneMetadata } from "../../Metadata"

/** HasOne relation handler */
export default class HasOne<
    Target extends object,
    Related extends EntityTarget
> extends HasOneRelation<Target, Related> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: HasOneMetadata,

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
    protected get sqlBuilder(): HasOneHandlerSQLBuilder<Target, Related> {
        return new HasOneHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}