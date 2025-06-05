import { EntityMetadata } from "../Metadata"

// Query Builders
import { InsertQueryBuilder, BulkInsertQueryBuilder } from "./QueryBuilders"

// Types
import type { EntityTarget } from "../../types/General"

export default class QueryBuilder<T extends EntityTarget> {
    public metadata: EntityMetadata
    public alias?: string

    constructor(
        public target: T,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public insert(alias?: string): InsertQueryBuilder<T> {
        return new InsertQueryBuilder(this.target, alias)
    }

    // ------------------------------------------------------------------------

    public bulkInsert(alias?: string): BulkInsertQueryBuilder<T> {
        return new BulkInsertQueryBuilder(this.target, alias)
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }
}