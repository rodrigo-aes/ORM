import HasManyRelation from "../ManyRelation/HasManyRelation"

// SQL Builders
import { HasManyHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { EntityTarget } from "../../types/General"
import type { HasManyMetadata } from "../../Metadata"

/** HasMany relation handler */
export default class HasMany<
    Target extends object,
    Related extends EntityTarget
> extends HasManyRelation<Target, Related> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: HasManyMetadata,

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
    protected get sqlBuilder(): HasManyHandlerSQLBuilder<Target, Related> {
        return new HasManyHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}