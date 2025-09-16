import QueryBuilder from "../QueryBuilder"

// Query Builders
import {
    InsertQueryBuilder,
    BulkInsertQueryBuilder
} from "../CreateQueryBuilder"
import UpdateQueryBuilder from "../UpdateQueryBuilder"
import UpdateOrCreateQueryBuilder from "../UpdateOrCreateQueryBuilder"
import DeleteQueryBuilder from "../DeleteQueryBuilder"

// Types
import type { EntityTarget } from "../../types/General"
import type { EntityMetadata } from "../../Metadata"

export default class EntityQueryBuilder<
    T extends EntityTarget
> extends QueryBuilder<T> {
    declare protected metadata: EntityMetadata

    constructor(public target: T, alias?: string) {
        super(target, alias)
    }

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
}