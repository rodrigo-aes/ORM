// Query Builders
import AndSQLBuilder from "./AndSQLBuilder"
import OrSQLBuilder from "./OrSQLBuilder"

// Handlers
import { MetadataHandler, ScopeMetadataHandler } from "../../Metadata"

// Types
import type {
    Target,
    TargetMetadata,
} from "../../types"

import type { ConditionalQueryOptions } from "./types"
import type UnionSQLBuilder from "../UnionSQLBuilder"

export default abstract class ConditionalSQLBuilder<T extends Target> {
    protected metadata: TargetMetadata<T>
    protected unions?: UnionSQLBuilder[]

    constructor(
        public target: T,
        public options?: ConditionalQueryOptions<InstanceType<T>>,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)

        if (this.options) ScopeMetadataHandler.applyScope(
            this.target, 'conditional', this.options
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public conditionalSQL(and: boolean = false): string {
        return this.options
            ? (and ? ' AND ' : '') + this.SQLBuilder().SQL()
            : ''
    }

    // Privates ---------------------------------------------------------------
    private SQLBuilder(): AndSQLBuilder<T> | OrSQLBuilder<T> {
        const sqlBuilder = Array.isArray(this.options)
            ? new OrSQLBuilder(
                this.target,
                this.options,
                this.alias
            )
            : new AndSQLBuilder(
                this.target,
                this.options!,
                this.alias
            )

        this.unions = sqlBuilder.unions()
        return sqlBuilder
    }
}