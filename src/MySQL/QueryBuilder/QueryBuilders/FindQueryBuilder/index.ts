import FindOneQueryBuilder from "../FindOneQueryBuilder"


import FindSQLBuilder, {
    FindQueryOptions as SQLBuilderOptions
} from "../../FindSQLBuilder"

// Query Builders
import OrderQueryBuilder from "../OrderQueryBuilder"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { OrderQueryOption } from "../../OrderSQLBuilder"
import type { CaseQueryFunction } from "../ConditionalQueryBuilder"
import type { FindQueryOptions } from "./types"

export default class FindQueryBuilder<
    T extends EntityTarget
> extends FindOneQueryBuilder<T> {
    protected override _options: FindQueryOptions<T> = {
        relations: {}
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public orderBy<
        OrderClause extends (
            OrderQueryOption<InstanceType<T>> |
            CaseQueryFunction<T>
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
}