import QueryBuilder from "./QueryBuilder"

// Types
import type { EntityTarget } from "../../types/General"

import type {
    FindOneQueryBuilder,
    FindQueryBuilder,
    InsertQueryBuilder,
    BulkInsertQueryBuilder
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
}