import { EntityMetadata, EntityUnionMetadata } from "../../Metadata"

// Query Builders
import AndSQLBuilder from "./AndSQLBuilder"
import OrSQLBuilder from "./OrSQLBuilder"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"
import type { ConditionalQueryOptions } from "./types"
import type UnionSQLBuilder from "../UnionSQLBuilder"

export default abstract class ConditionalSQLBuilder<
    T extends EntityTarget | UnionEntityTarget
> {
    protected metadata!: EntityMetadata | EntityUnionMetadata

    protected sqlBuilder: AndSQLBuilder<T> | OrSQLBuilder<T> | undefined

    constructor(
        public target: T,
        public options?: ConditionalQueryOptions<InstanceType<T>>,
        public alias?: string
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target!)!
        this.alias = alias ?? this.target?.name.toLowerCase()

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