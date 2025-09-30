import {
    Case,

    type OrderQueryOptions as SQLBuilderQueryOptions,
    type OrderQueryOption,
} from "../../SQLBuilders"

// Query Handlers
import CaseQueryBuilder from "../CaseQueryBuilder"

// Types
import type { Target } from "../../types"
import type { CaseQueryHandler } from "../types"
import type { OrderQueryOptions } from "./types"

/** @internal */
export default class OrderQueryBuilder<T extends Target> {
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
        Order extends OrderQueryOption<InstanceType<T>> | CaseQueryHandler<T>
    >(...options: OrderQueryOptions<T, Order>): this {
        const [first, ...rest] = options

        if (Array.isArray(first)) this.handleCommonOptions(
            first, ...rest as OrderQueryOption<InstanceType<T>>[],
        )

        else this.handleCaseOptions(first as CaseQueryHandler<T>)

        return this
    }

    // -----------------------------------------------------------------------

    public toQueryOptions(): SQLBuilderQueryOptions<InstanceType<T>> {
        if (this._options instanceof CaseQueryBuilder) return {
            [Case]: this._options.toQueryOptions()
        }

        return this._options
    }

    // Privates ---------------------------------------------------------------
    private handleCommonOptions(...options: (
        OrderQueryOption<InstanceType<T>>[]
    )) {
        if (!this._options) this._options = []
        if (!Array.isArray(this._options)) throw new Error

        this._options.push(...options)
    }

    // ------------------------------------------------------------------------

    private handleCaseOptions(clause: CaseQueryHandler<T>) {
        this._options = new CaseQueryBuilder(
            this.target,
            this.alias
        )

        clause(this._options)
    }
}

export type {
    OrderQueryOptions
}