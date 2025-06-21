import FindOneSQLBuilder from "../FindOneSQLBuilder"

// SQL Builders
import OrderSQLBuilder from "../OrderSQLBuilder"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"
import type { FindQueryOptions } from "./types"

export default class FindSQLBuilder<
    T extends EntityTarget | UnionEntityTarget
> extends FindOneSQLBuilder<T> {
    public order?: OrderSQLBuilder<T>
    public limit?: number
    public offset?: number

    constructor(
        public target: T,
        public options: FindQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        super(target, options, alias)

        this.order = this.buildOrder()
        this.assingRestQueryOptions()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override SQL(): string {
        return [
            this.unionsSQL(),
            this.selectSQL(),
            this.joinsSQL(),
            this.whereSQL(),
            this.groupSQL(),
            this.orderSQL(),
            this.limitSQL(),
            this.offsetSQL(),
        ]
            .join(' ')
    }

    // ------------------------------------------------------------------------

    public orderSQL(): string {
        return this.order?.SQL() ?? ''
    }

    // ------------------------------------------------------------------------

    public override limitSQL(): string {
        return this.limit
            ? `LIMIT ${this.limit}`
            : ''
    }

    // ------------------------------------------------------------------------

    public offsetSQL(): string {
        return this.offset
            ? `OFFSET ${this.offset}`
            : ''
    }

    // Privates ---------------------------------------------------------------
    private buildOrder(): OrderSQLBuilder<T> | undefined {
        if (this.options.order) return new OrderSQLBuilder(
            this.target,
            this.options.order,
            this.alias
        )

    }

    // ------------------------------------------------------------------------

    private assingRestQueryOptions(): void {
        const { limit, offset } = this.options

        Object.assign(this, {
            limit,
            offset
        })
    }
}

export {
    type FindQueryOptions
}