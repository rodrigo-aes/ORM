import FindOneQueryBuilder from "../FindOneQueryBuilder"

// SQL Builers
import {
    FindSQLBuilder,

    type FindQueryOptions as SQLBuilderOptions,
    type OrderQueryOption
} from "../../SQLBuilders"

// Query Builders
import OrderQueryBuilder, {
    type OrderQueryOptions
} from "../OrderQueryBuilder"

// Types
import type { Target } from "../../types"
import type { CaseQueryHandler } from "../types"
import type { FindQueryOptions } from "./types"

/**
 * Build Find query
 */
export default class FindQueryBuilder<
    T extends Target
> extends FindOneQueryBuilder<T> {
    /** @internal */
    protected override _options: FindQueryOptions<T> = {
        relations: {}
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Define `ORDER BY` options
     * @param order - Order options
     * @returns {this} - `this`
     */
    public orderBy<
        Order extends OrderQueryOption<InstanceType<T>> | CaseQueryHandler<T>
    >(...order: OrderQueryOptions<T, Order>): this {
        this._options.order = new OrderQueryBuilder(
            this.target,
            this.alias
        )
            .orderBy(...order)

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define `LIMIT` query option
     * @param limit - Integer limit
     * @returns {this} - `this`
     */
    public limit(limit: number): this {
        this._options.limit = limit
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define `OFFSET` query option
     * @param limit - Integer offset
     * @returns {this} - `this`
     */
    public offset(offset: number): this {
        this._options.offset = offset
        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `FindQueryOptions` object
    * @returns - A object with find options
    */
    public override toQueryOptions(): SQLBuilderOptions<InstanceType<T>> {
        const { select, where, group, order, limit, offset } = this._options

        return {
            select: select?.toQueryOptions(),
            where: where?.toQueryOptions(),
            relations: this.relationsToOptions(),
            group: group?.toQueryOptions(),
            order: order?.toQueryOptions(),
            limit,
            offset
        }
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected override toSQLBuilder(): FindSQLBuilder<T> {
        return new FindSQLBuilder(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
    }
}