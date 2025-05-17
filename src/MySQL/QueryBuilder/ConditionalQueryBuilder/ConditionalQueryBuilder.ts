import { EntityMetadata } from "../../Metadata"

// Query Builders
import WhereQueryBuilder from "./WhereQueryBuilder"
import AndQueryBuilder from "./AndQueryBuilder"
import OrQueryBuilder from "./OrQueryBuilder"

// Types
import type { EntityTarget } from "../../../types/General"
import type { ConditionalQueryOptions } from "./types"

export default abstract class ConditionalQueryBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    constructor(
        public target: T,
        public options: ConditionalQueryOptions<InstanceType<T>>,
        public alias?: string
    ) {
        this.metadata = this.loadMetadata()
        this.alias = alias ?? this.target.name.toLowerCase()
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected conditionalSQL(): string {
        return (
            Array.isArray(this.options)
                ? new OrQueryBuilder(
                    this.target,
                    this.options,
                    this.alias
                )

                : new AndQueryBuilder(
                    this.target,
                    this.options,
                    this.alias
                )
        )
            .SQL()
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }
}