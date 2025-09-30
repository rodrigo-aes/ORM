import { EntityMetadata, PolymorphicEntityMetadata } from "../../Metadata"

// Query Builders
import AndSQLBuilder from "./AndSQLBuilder"
import OrSQLBuilder from "./OrSQLBuilder"

// Handlers
import { MetadataHandler, ScopeMetadataHandler } from "../../Metadata"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types"

import type { ConditionalQueryOptions } from "./types"
import type UnionSQLBuilder from "../UnionSQLBuilder"

export default abstract class ConditionalSQLBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected metadata!: EntityMetadata | PolymorphicEntityMetadata

    protected sqlBuilder: AndSQLBuilder<T> | OrSQLBuilder<T> | undefined

    constructor(
        public target: T,
        public options?: ConditionalQueryOptions<InstanceType<T>>,
        public alias?: string
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target!)!
        this.alias = alias ?? this.target?.name.toLowerCase()

        if (this.options) ScopeMetadataHandler.applyScope(
            this.target,
            'conditional',
            this.options
        )

        this.sqlBuilder = this.buildSQLBuilder()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public unions(): UnionSQLBuilder[] {
        return this.sqlBuilder?.unions() ?? []
    }

    // ------------------------------------------------------------------------

    public conditionalSQL(): string {
        return this.sqlBuilder?.SQL() ?? ''
    }

    // Privates ---------------------------------------------------------------
    private buildSQLBuilder(): AndSQLBuilder<T> | OrSQLBuilder<T> | undefined {
        if (!this.options) return

        return Array.isArray(this.options)
            ? new OrSQLBuilder(
                this.target,
                this.options,
                this.alias
            )

            : new AndSQLBuilder(
                this.target,
                this.options,
                this.alias
            )
    }
}