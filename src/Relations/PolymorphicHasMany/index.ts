import HasManyRelation from "../ManyRelation/HasManyRelation"

// SQL Builders
import { PolymorphicHasManyHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { EntityTarget } from "../../types/General"
import type { PolymorphicHasManyMetadata } from "../../Metadata"

/** HasMany relation handler */
export default class PolymorphicHasMany<
    Target extends object,
    Related extends EntityTarget
> extends HasManyRelation<Target, Related> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: PolymorphicHasManyMetadata,

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
        PolymorphicHasManyHandlerSQLBuilder<Target, Related>
    ) {
        return new PolymorphicHasManyHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}