import { EntityMetadata, EntityUnionMetadata } from "../../Metadata"

// Query Builders
import AndSQLBuilder from "./AndSQLBuilder"
import OrSQLBuilder from "./OrSQLBuilder"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"
import type { ConditionalQueryOptions } from "./types"

export default abstract class ConditionalSQLBuilder<
    T extends EntityTarget | UnionEntityTarget
> {
    protected metadata!: EntityMetadata | EntityUnionMetadata

    constructor(
        public target: T,
        public options?: ConditionalQueryOptions<InstanceType<T>>,
        public alias?: string
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target!)!
        this.alias = alias ?? this.target?.name.toLowerCase()
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected conditionalSQL(): string {
        if (!this.target) return ''

        return this.options ? (
            Array.isArray(this.options)
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
        )
            .SQL()
            : ''
    }
}