import FindOneQueryBuilder, {
    type FindQueryOptions
} from "../FindOneQueryBuilder"

// Query Builders
import OrderQueryBuilder from "../OrderQueryBuilder"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { OrderQueryOption } from "../../OrderSQLBuilder"

import type { CaseQueryFunction } from "../ConditionalQueryBuilder"

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
}