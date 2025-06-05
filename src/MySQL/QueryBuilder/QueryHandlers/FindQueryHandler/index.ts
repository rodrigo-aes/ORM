import { EntityMetadata } from "../../../Metadata"

// Query Handlers
import SelectQueryHandler from "../SelectQueryHandler"
import WhereQueryHandler from "../WhereQueryHandler"
import JoinQueryHandler from "../JoinQueryHandler"
import GroupQueryHandler from "../GroupQueryHandler"
import OrderQueryHandler from "../OrderQueryHandler"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { FindQueryOptions as FindOptions } from "../../FindSQLBuilder"
import type { RelationsOptions } from "../../JoinSQLBuilder/types"
import type { JoinQueryOptions } from "../JoinQueryHandler"
import type { GroupQueryOptions } from "../../GroupSQLBuilder"
import type {
    OrderQueryOptions,
    OrderQueryOption
} from "../../OrderSQLBuilder"

import type {
    FindQueryOptions,
    SelectQueryFunction,
    WhereQueryFunction,
    JoinQueryFunction
} from "./types"
import type { CaseQueryFunction } from "../ConditionalQueryHandler"

export default class FindQueryHandler<T extends EntityTarget> {
    protected metadata: EntityMetadata

    private _options: FindQueryOptions<T> = {
        relations: {}
    }

    constructor(
        public target: T,
        public alias?: string,
    ) {
        this.metadata = this.loadMetadata()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public select(selectClause: SelectQueryFunction<T>): this {
        this._options.select = new SelectQueryHandler(
            this.target,
            this.alias
        )

        selectClause(this._options.select)

        return this
    }

    // ------------------------------------------------------------------------

    public where(whereClause: WhereQueryFunction<T>): this {
        this._options.where = new WhereQueryHandler(
            this.target,
            this.alias
        )

        whereClause(this._options.where)

        return this
    }

    // ------------------------------------------------------------------------

    public innerJoin<T extends EntityTarget>(
        related: T,
        joinClause?: JoinQueryFunction<T>
    ): this {
        const [name, target] = this.handleRelated(related)
        const handler = new JoinQueryHandler(
            target,
            this.alias,
            true
        )

        if (joinClause) joinClause(handler)
        this._options.relations![name] = handler

        return this
    }

    // ------------------------------------------------------------------------

    public leftJoin<T extends EntityTarget>(
        related: T,
        joinClause?: JoinQueryFunction<T>
    ): this {
        const [name, target] = this.handleRelated(related)
        const handler = new JoinQueryHandler(
            target,
            this.alias,
            false
        )

        if (joinClause) joinClause(handler)
        this._options.relations![name] = handler

        return this
    }

    // ------------------------------------------------------------------------

    public groupBy(...columns: GroupQueryOptions<InstanceType<T>>): this {
        this._options.group = new GroupQueryHandler(this.target, this.alias)
            .groupBy(...columns)

        return this
    }

    // ------------------------------------------------------------------------

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
        this._options.order = new OrderQueryHandler(
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

    public toQueryOptions(): FindOptions<InstanceType<T>> {
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

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    private handleRelated<Target extends EntityTarget>(
        related: Target
    ): [keyof JoinQueryOptions<T>, Target] {
        const rel = typeof related === 'string'
            ? this.metadata.relations?.find(
                ({ name }) => name === related
            )
            : this.metadata.relations?.find(
                ({ relatedTarget }) => relatedTarget === related
            )

        if (rel) return [
            rel.name as keyof JoinQueryOptions<T>,
            rel.relatedTarget as Target
        ]

        throw new Error
    }

    // ------------------------------------------------------------------------

    private relationsToOptions(): (
        RelationsOptions<InstanceType<T>> | undefined
    ) {
        if (!this._options.relations) return

        return Object.fromEntries(
            Object.entries(this._options.relations).map(
                ([name, value]) => [
                    name,
                    typeof value === 'boolean'
                        ? value
                        : (value as JoinQueryHandler<any>).toQueryOptions()
                ]
            )
        ) as (
                RelationsOptions<InstanceType<T>>
            )
    }
}