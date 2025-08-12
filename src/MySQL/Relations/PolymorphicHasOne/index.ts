import HasOneRelation from "../OneRelation/HasOneRelation"

// SQL Builders
import { PolymorphicHasOneHandlerSQLBuilder } from "../../QueryBuilder"

// Types
import type { EntityTarget } from "../../../types/General"
import type { PolymorphicHasOneMetadata } from "../../Metadata"

export default class PolymorphicHasOne<
    Target extends object,
    Related extends EntityTarget
> extends HasOneRelation<Target, Related> {
    constructor(
        protected metadata: PolymorphicHasOneMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // protecteds -------------------------------------------------------------
    protected get sqlBuilder(): (
        PolymorphicHasOneHandlerSQLBuilder<Target, Related>
    ) {
        return new PolymorphicHasOneHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}