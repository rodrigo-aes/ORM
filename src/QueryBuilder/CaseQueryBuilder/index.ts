import {
    MetadataHandler,

    type EntityMetadata,
    type PolymorphicEntityMetadata
} from "../../Metadata"

// Query Handlers
import ConditionalQueryHandler from "../ConditionalQueryBuilder"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types/General"

import type { CaseQueryOptions, ElseQueryOption } from "../../SQLBuilders"
import type { CaseQueryTuple } from "./types"
import type { WhereQueryHandler } from "../types"

export default class CaseQueryBuilder<
    T extends EntityTarget | PolymorphicEntityTarget> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

    private _whens!: CaseQueryTuple<T>[]
    private _else?: ElseQueryOption
    public _as?: string

    constructor(
        public target: T,
        public alias?: string
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public when(caseClause: WhereQueryHandler<T>, then: any): this {
        const where = new ConditionalQueryHandler(
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

    public else(value: any): Omit<this, 'when'> {
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
}