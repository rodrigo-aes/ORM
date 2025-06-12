import { Case } from "../../ConditionalSQLBuilder"

// Query Handlers
import CaseQueryBuilder from "../CaseQueryBuilder"

// Types
import type { EntityTarget } from "../../../../types/General"
import type {
    OrderQueryOptions,
    OrderQueryOption,
} from "../../OrderSQLBuilder"
import type { CaseQueryFunction } from "../ConditionalQueryBuilder"

export default class OrderQueryBuilder<T extends EntityTarget> {
    private _options!: (
        OrderQueryOption<InstanceType<T>>[] |
        CaseQueryBuilder<T>
    )

    constructor(
        public target: T,
        public alias?: string
    ) { }

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
        if (Array.isArray(order)) this.handleCommonOptions(
            order,
            ...orders as OrderQueryOption<InstanceType<T>>[]
        )

        else this.handleCaseOptions(order)

        return this
    }

    // -----------------------------------------------------------------------

    public toQueryOptions(): OrderQueryOptions<InstanceType<T>> {
        if (this._options instanceof CaseQueryBuilder) return {
            [Case]: this._options.toQueryOptions()
        }

        return this._options
    }

    // Privates ---------------------------------------------------------------
    private handleCommonOptions(
        ...options: OrderQueryOption<InstanceType<T>>[]
    ) {
        if (!this._options) this._options = []
        if (!Array.isArray(this._options)) throw new Error

        this._options.push(...options)
    }

    // ------------------------------------------------------------------------

    private handleCaseOptions(clause: CaseQueryFunction<T>) {
        this._options = new CaseQueryBuilder(
            this.target,
            this.alias
        )

        clause(this._options)
    }
}