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
        protected metadata: PolymorphicHasManyMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // protecteds -------------------------------------------------------------
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