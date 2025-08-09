import ManyRelation from "../ManyRelation"

// SQL Builders
import { PolymorphicHasManyHandlerSQLBuilder } from "../../QueryBuilder"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type RelationQueryExecutionHandler
} from "../../Handlers"

// Types
import type { EntityTarget } from "../../../types/General"
import type { PolymorphicHasManyMetadata } from "../../Metadata"

export default class PolymorphicHasMany<
    Target extends object,
    Related extends EntityTarget
> extends ManyRelation.HasMany<Target, Related> {
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