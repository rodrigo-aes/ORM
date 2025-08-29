import ManyRelation from "../ManyRelation"

// SQL Builders
import { HasManyThroughHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { EntityTarget } from "../../../types/General"
import type { HasManyThroughMetadata } from "../../Metadata"

export default class HasManyThrough<
    Target extends object,
    Related extends EntityTarget
> extends ManyRelation<Target, Related> {
    constructor(
        protected metadata: HasManyThroughMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
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