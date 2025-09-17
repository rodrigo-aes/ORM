import HasOneRelation from "../OneRelation/HasOneRelation"

// SQL Builders
import { PolymorphicHasOneHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { EntityTarget } from "../../types/General"
import type { PolymorphicHasOneMetadata } from "../../Metadata"

export default class PolymorphicHasOne<
    Target extends object,
    Related extends EntityTarget
> extends HasOneRelation<Target, Related> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: PolymorphicHasOneMetadata,

        /** @internal */
        protected target: Target,

        /** @internal */
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // protecteds -------------------------------------------------------------
    /** @internal */
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