import QueryBuilder from "./QueryBuilder"

// Types
import type { EntityTarget } from "../../types/General"

import type {
    FindOneQueryBuilder,
    FindQueryBuilder,
    InsertQueryBuilder,
    BulkInsertQueryBuilder,
    UpdateQueryBuilder,
    UpdateOrCreateQueryBuilder,
    DeleteQueryBuilder
} from "./QueryBuilders"

export default class ConnectionQueryBuilder {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public findOneFrom<T extends EntityTarget>(target: T, alias?: string): (
        FindOneQueryBuilder<T>
    ) {
        return new QueryBuilder(target, alias).findOne()
    }

    // ------------------------------------------------------------------------

    public findFrom<T extends EntityTarget>(target: T, alias?: string): (
        FindQueryBuilder<T>
    ) {
        return new QueryBuilder(target, alias).find()
    }

    // ------------------------------------------------------------------------

    public insertInto<T extends EntityTarget>(target: T, alias?: string): (
        InsertQueryBuilder<T>
    ) {
        return new QueryBuilder(target, alias).insert()
    }

    // ------------------------------------------------------------------------

    public bulkInsertInto<T extends EntityTarget>(target: T, alias?: string): (
        BulkInsertQueryBuilder<T>
    ) {
        return new QueryBuilder(target, alias).bulkInsert()
    }

    // ------------------------------------------------------------------------

    public updateOn<T extends EntityTarget>(target: T, alias?: string): (
        UpdateQueryBuilder<T>
    ) {
        return new QueryBuilder(target, alias).update()
    }

    // ------------------------------------------------------------------------

    public updateOrCreateOn<T extends EntityTarget>(
        target: T,
        alias?: string
    ): UpdateOrCreateQueryBuilder<T> {
        return new QueryBuilder(target, alias).updateOrCreate()
    }

    // ------------------------------------------------------------------------

    public deleteFrom<T extends EntityTarget>(target: T, alias?: string): (
        DeleteQueryBuilder<T>
    ) {
        return new QueryBuilder(target, alias).delete()
    }
}