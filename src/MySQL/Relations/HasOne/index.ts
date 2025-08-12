import HasOneRelation from "../OneRelation/HasOneRelation"

// SQL Builders
import { HasOneHandlerSQLBuilder } from "../../QueryBuilder"

// Types
import type { EntityTarget } from "../../../types/General"
import type { HasOneMetadata } from "../../Metadata"

export default class HasOne<
    Target extends object,
    Related extends EntityTarget
> extends HasOneRelation<Target, Related> {
    constructor(
        protected metadata: HasOneMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get sqlBuilder(): HasOneHandlerSQLBuilder<Target, Related> {
        return new HasOneHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}