import { EntityMetadata } from "../Metadata"

// Query Builders
import {
    FindOneQueryBuilder,
    FindQueryBuilder,
    InsertQueryBuilder,
    BulkInsertQueryBuilder,
    UpdateQueryBuilder,
    UpdateOrCreateQueryBuilder,
    DeleteQueryBuilder
} from "./QueryBuilders"

// Types
import type { EntityTarget } from "../../types/General"

export default class QueryBuilder<T extends EntityTarget> {
    public metadata: EntityMetadata
    private alias?: string

    constructor(
        public target: T,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public findOne(alias?: string): FindOneQueryBuilder<T> {
        return new FindOneQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    public find(alias?: string): FindQueryBuilder<T> {
        return new FindQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    public insert(alias?: string): InsertQueryBuilder<T> {
        return new InsertQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    public bulkInsert(alias?: string): BulkInsertQueryBuilder<T> {
        return new BulkInsertQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    public update(alias?: string): UpdateQueryBuilder<T> {
        return new UpdateQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    public updateOrCreate(alias?: string): UpdateOrCreateQueryBuilder<T> {
        return new UpdateOrCreateQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    public delete(alias?: string): DeleteQueryBuilder<T> {
        return new DeleteQueryBuilder(this.target, alias ?? this.alias)
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }
}