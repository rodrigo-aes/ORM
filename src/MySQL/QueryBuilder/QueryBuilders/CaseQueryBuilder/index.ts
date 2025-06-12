import { EntityMetadata } from "../../../Metadata"

// Query Handlers
import WhereQueryBuilder from "../WhereQueryBuilder"

// Types
import type { EntityTarget } from "../../../../types/General"
import type {
    CaseQueryOptions,
    ElseQueryOption
} from "../../ConditionalSQLBuilder/CaseSQLBuilder"

import type { CaseQueryFunction, CaseQueryTuple } from "./types"
import type { WhereQueryFunction } from "../WhereQueryBuilder"

export default class CaseQueryBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    private _whens!: CaseQueryTuple<T>[]
    private _else?: ElseQueryOption
    public _as?: string

    constructor(
        public target: T,
        public alias?: string
    ) {
        this.metadata = this.loadMetadata()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public when(caseClause: CaseQueryFunction<T>, then: any): this {
        const where = new WhereQueryBuilder(
            this.target,
            this.alias
        )

        caseClause(where)

        const tuple: CaseQueryTuple<T> = [where, then]

        if (this._whens) this._whens.push(tuple)
        else this._whens = [tuple]

        return this
    }

    // ------------------------------------------------------------------------

    public else(value: any): this {
        this._else = value
        return this
    }

    // ------------------------------------------------------------------------

    public as(name: string): void {
        this._as = name
    }

    // ------------------------------------------------------------------------

    public toQueryOptions(): CaseQueryOptions<InstanceType<T>> {
        return [
            ...this._whens.map(([when, then]) => [
                when.toQueryOptions(),
                then
            ]),
            this._else
        ] as (
                CaseQueryOptions<InstanceType<T>>
            )
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }
}