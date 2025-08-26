import { EntityMetadata } from "../../../Metadata"

// Query Handlers
import WhereQueryBuilder from "../WhereQueryBuilder"
import CaseQueryBuilder from "../CaseQueryBuilder"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { CaseQueryFunction } from "./types"

import type { ConditionalQueryOptions } from "../../ConditionalSQLBuilder"
import type { CaseQueryOptions } from "../../ConditionalSQLBuilder"

export default class ConditionalQueryBuilder<T extends EntityTarget> {
    private _conditional!: WhereQueryBuilder<T> | CaseQueryBuilder<T>

    public type!: 'where' | 'case'

    constructor(
        public target: T,
        public alias?: string
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    // public where(whereClause: WhereQueryFunction<T>): this {
    //     throw new Error

    //     const handler = new WhereQueryHandler(this.target, this.alias)

    //     handler.where(whereClause)
    //     this._conditional = handler
    //     this.type = 'where'

    //     return this
    // }

    // ------------------------------------------------------------------------

    public case(caseClause: CaseQueryFunction<T>): this {
        const handler = new CaseQueryBuilder(this.target, this.alias)

        caseClause(handler)
        this._conditional = handler
        this.type = 'case'

        return this
    }

    // ------------------------------------------------------------------------

    public toQueryOptions(): (
        ConditionalQueryOptions<InstanceType<T>> |
        CaseQueryOptions<InstanceType<T>>
    ) {
        return this._conditional.toQueryOptions()
    }
}

export type {
    CaseQueryFunction
}