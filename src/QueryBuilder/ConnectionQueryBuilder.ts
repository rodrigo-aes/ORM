import QueryBuilder from "./QueryBuilder"
import EntityQueryBuilder from "./EntityQueryBuilder"

// Types
import type { Target, EntityTarget } from "../types"

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
    /**
     * Instantiate a `FindOneQueryBuilder` to target entity and return
     * @param target - Target table entity
     * @param alias - Entity query alias
     * @returns {FindOneQueryBuilder<T>} - FindOneQueryBuilder
     */
    public findOneFrom<T extends Target>(target: T, alias?: string): (
        FindOneQueryBuilder<T>
    ) {
        return new QueryBuilder(target, alias).findOne()
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate a `FindQueryBuilder` to target entity and return
     * @param target - Target table entity
     * @param alias - Entity query alias
     * @returns {FindQueryBuilder<T>} - FindQueryBuilder
     */
    public findFrom<T extends Target>(target: T, alias?: string): (
        FindQueryBuilder<T>
    ) {
        return new QueryBuilder(target, alias).find()
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate a `PaginateQueryBuilder` to target entity and return
     * @param target - Target table entity
     * @param page - Current page
     * @param perPage - Results per page
     * @param alias - Entity query alias
     * @returns {PaginateQueryBuilder<T>} - PaginateQueryBuilder
     */
    public paginateFrom<T extends Target>(
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

    /**
     * Instantiate a `CountQueryBuilder` to target entity and return
     * @param target - Target table entity
     * @param alias - Entity query alias
     * @returns {CountQueryBuilder<T>} - CountQueryBuilder
     */
    public countFrom<T extends Target>(target: T, alias?: string): (
        CountQueryBuilder<T>
    ) {
        return new QueryBuilder(target, alias).count()
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate a `CountManyQueryBuilder` to target entity and return
     * @param target - Target table entity
     * @param alias - Entity query alias
     * @returns {CountManyQueryBuilder<T>} - CountManyQueryBuilder
     */
    public countManyFrom<T extends Target>(target: T, alias?: string): (
        CountManyQueryBuilder<T>
    ) {
        return new QueryBuilder(target, alias).countMany()
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate a `InsertQueryBuilder` to target entity and return
     * @param target - Target table entity
     * @param alias - Entity query alias
     * @returns {InsertQueryBuilder<T>} - InsertQueryBuilder
     */
    public insertInto<T extends EntityTarget>(target: T, alias?: string): (
        InsertQueryBuilder<T>
    ) {
        return new EntityQueryBuilder(target, alias).insert()
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate a `BulkInsertQueryBuilder` to target entity and return
     * @param target - Target table entity
     * @param alias - Entity query alias
     * @returns {BulkInsertQueryBuilder<T>} - BulkInsertQueryBuilder
     */
    public bulkInsertInto<T extends EntityTarget>(target: T, alias?: string): (
        BulkInsertQueryBuilder<T>
    ) {
        return new EntityQueryBuilder(target, alias).bulkInsert()
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate a `UpdateQueryBuilder` to target entity and return
     * @param target - Target table entity
     * @param alias - Entity query alias
     * @returns {UpdateQueryBuilder<T>} - UpdateQueryBuilder
     */
    public updateOn<T extends EntityTarget>(target: T, alias?: string): (
        UpdateQueryBuilder<T>
    ) {
        return new EntityQueryBuilder(target, alias).update()
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate a `UpdateOrCreateQueryBuilder` to target entity and return
     * @param target - Target table entity
     * @param alias - Entity query alias
     * @returns {UpdateOrCreateQueryBuilder<T>} - UpdateOrCreateQueryBuilder
     */
    public updateOrCreateOn<T extends EntityTarget>(
        target: T,
        alias?: string
    ): UpdateOrCreateQueryBuilder<T> {
        return new EntityQueryBuilder(target, alias).updateOrCreate()
    }

    // ------------------------------------------------------------------------

    /**
     * Instantiate a `DeleteQueryBuilder` to target entity and return
     * @param target - Target table entity
     * @param alias - Entity query alias
     * @returns {DeleteQueryBuilder<T>} - DeleteQueryBuilder
     */
    public deleteFrom<T extends EntityTarget>(target: T, alias?: string): (
        DeleteQueryBuilder<T>
    ) {
        return new EntityQueryBuilder(target, alias).delete()
    }
}