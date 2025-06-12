import { EntityMetadata } from "../../Metadata"

// Query Builders
import WhereSQLBuilder from "./WhereSQLBuilder"
import AndSQLBuilder from "./AndSQLBuilder"
import OrSQLBuilder from "./OrSQLBuilder"

// Types
import type { EntityTarget } from "../../../types/General"
import type { ConditionalQueryOptions } from "./types"

export default abstract class ConditionalSQLBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    constructor(
        public target: T,
        public options?: ConditionalQueryOptions<InstanceType<T>>,
        public alias?: string
    ) {
        this.metadata = this.loadMetadata()
        this.alias = alias ?? this.target.name.toLowerCase()
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected conditionalSQL(): string {
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

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }
}