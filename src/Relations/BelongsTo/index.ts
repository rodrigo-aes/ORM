import OneRelation from "../OneRelation"

// SQL Builders
import { BelongsToHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { EntityTarget } from "../../types/General"
import type { BelongsToMetadata } from "../../Metadata"

/** BelongsTo relation handler */
export default class BelongsTo<
    Target extends object,
    Related extends EntityTarget
> extends OneRelation<Target, Related> {
    /** @internal */
    constructor(
        protected metadata: BelongsToMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get sqlBuilder(): BelongsToHandlerSQLBuilder<Target, Related> {
        return new BelongsToHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}