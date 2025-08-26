import QueryBuilder from "./QueryBuilder"
import EntityQueryBuilder from "./EntityQueryBuilder"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types/General"

import type FindOneQueryBuilder from "./FindOneQueryBuilder"
import type FindQueryBuilder from "./FindQueryBuilder"
import type { PaginateQueryBuilder } from "./types"
import type CountQueryBuilder from "./CountQueryBuilder"
import type CountManyQueryBuilder from "./CountManyQueryBuilder"
import type {
    InsertQueryBuilder,
    BulkInsertQueryBuilder
} from "./CreateQueryBuilder"
import type UpdateQueryBuilder from "./UpdateQueryBuilder"
import type UpdateOrCreateQueryBuilder from "./UpdateOrCreateQueryBuilder"
import type DeleteQueryBuilder from "./DeleteQueryBuilder"


export default class ConnectionQueryBuilder {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public findOneFrom<
        T extends EntityTarget | PolymorphicEntityTarget
    >(target: T, alias?: string): FindOneQueryBuilder<T> {
        return new QueryBuilder(target, alias).findOne()
    }

    // ------------------------------------------------------------------------

    public findFrom<
        T extends EntityTarget | PolymorphicEntityTarget
    >(target: T, alias?: string): FindQueryBuilder<T> {
        return new QueryBuilder(target, alias).find()
    }

    // ------------------------------------------------------------------------

    public paginateFrom<
        T extends EntityTarget | PolymorphicEntityTarget
    >(
        target: T,
        page: number = 1,
        perPage: number = 26,
        alias: string
    ): PaginateQueryBuilder<T> {
        return new QueryBuilder(target, alias).paginate(
            page, perPage
        )
    }

    // ------------------------------------------------------------------------

    public countFrom<
        T extends EntityTarget | PolymorphicEntityTarget
    >(target: T, alias?: string): CountQueryBuilder<T> {
        return new QueryBuilder(target, alias).count()
    }

    // ------------------------------------------------------------------------

    public countManyFrom<
        T extends EntityTarget | PolymorphicEntityTarget
    >(target: T, alias?: string): CountManyQueryBuilder<T> {
        return new QueryBuilder(target, alias).countMany()
    }

    // ------------------------------------------------------------------------

    public insertInto<T extends EntityTarget>(target: T, alias?: string): (
        InsertQueryBuilder<T>
    ) {
        return new EntityQueryBuilder(target, alias).insert()
    }

    // ------------------------------------------------------------------------

    public bulkInsertInto<T extends EntityTarget>(target: T, alias?: string): (
        BulkInsertQueryBuilder<T>
    ) {
        return new EntityQueryBuilder(target, alias).bulkInsert()
    }

    // ------------------------------------------------------------------------

    public updateOn<T extends EntityTarget>(target: T, alias?: string): (
        UpdateQueryBuilder<T>
    ) {
        return new EntityQueryBuilder(target, alias).update()
    }

    // ------------------------------------------------------------------------

    public updateOrCreateOn<T extends EntityTarget>(
        target: T,
        alias?: string
    ): UpdateOrCreateQueryBuilder<T> {
        return new EntityQueryBuilder(target, alias).updateOrCreate()
    }

    // ------------------------------------------------------------------------

    public deleteFrom<T extends EntityTarget>(target: T, alias?: string): (
        DeleteQueryBuilder<T>
    ) {
        return new EntityQueryBuilder(target, alias).delete()
    }
}