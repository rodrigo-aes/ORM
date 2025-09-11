import HasManyRelation from "../ManyRelation/HasManyRelation"

// SQL Builders
import { HasManyHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { EntityTarget } from "../../types/General"
import type { HasManyMetadata } from "../../Metadata"

export default class HasMany<
    Target extends object,
    Related extends EntityTarget
> extends HasManyRelation<Target, Related> {
    constructor(
        protected metadata: HasManyMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get sqlBuilder(): HasManyHandlerSQLBuilder<Target, Related> {
        return new HasManyHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}