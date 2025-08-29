import FindOneQueryBuilder from "../FindOneQueryBuilder"

// SQL Builers
import {
    FindSQLBuilder,

    type FindQueryOptions as SQLBuilderOptions,
    type OrderQueryOption
} from "../../SQLBuilders"

// Query Builders
import OrderQueryBuilder from "../OrderQueryBuilder"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types/General"

import type { CaseQueryHandler } from "../types"
import type { FindQueryOptions } from "./types"

export default class FindQueryBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> extends FindOneQueryBuilder<T> {
    protected override _options: FindQueryOptions<T> = {
        relations: {}
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public orderBy<
        OrderClause extends (
            OrderQueryOption<InstanceType<T>> |
            CaseQueryHandler<T>
        )
    >(
        order: OrderClause,
        ...orders: OrderClause extends OrderQueryOption<InstanceType<T>>
            ? OrderQueryOption<InstanceType<T>>[]
            : never[]
    ): this {
        this._options.order = new OrderQueryBuilder(
            this.target,
            this.alias
        )
            .orderBy(order, ...orders)

        return this
    }

    // ------------------------------------------------------------------------

    public limit(limit: number): this {
        this._options.limit = limit
        return this
    }

    // ------------------------------------------------------------------------

    public offset(offset: number): this {
        this._options.offset = offset
        return this
    }

    // ------------------------------------------------------------------------

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
    protected override toSQLBuilder(): FindSQLBuilder<T> {
        return new FindSQLBuilder(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
    }
}