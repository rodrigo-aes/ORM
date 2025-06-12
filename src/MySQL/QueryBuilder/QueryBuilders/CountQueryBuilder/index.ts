import { EntityMetadata } from "../../../Metadata"
import { Case, CaseQueryOptions } from "../../ConditionalSQLBuilder"

// Query Handlers
import { type CaseQueryFunction } from "../ConditionalQueryBuilder"

import WhereQueryBuilder, {
    type WhereQueryFunction
} from "../WhereQueryBuilder"

import CaseQueryBuilder from "../CaseQueryBuilder"

// Types
import type { EntityTarget } from "../../../../types/General"
import type {
    CountQueryOption,
    CountCaseOptions,
    CountQueryOptions
} from "../../CountSQLBuilder"

import type { EntityProperties, EntityPropertiesKeys } from "../../types"
import type { CompatibleOperators, OperatorType } from "../OperatorQueryBuilder"

type WhereMethods = 'where' | 'and' | 'orWhere'
type CaseMethods = 'case'
type CountMethods = 'count'

export default class CountQueryBuilder<T extends EntityTarget> {
    public _as?: string
    private _conditional?: (
        string |
        WhereQueryBuilder<T> |
        CaseQueryBuilder<T>
    )

    public type!: 'prop' | 'where' | 'case'

    constructor(
        public target: T,
        public alias?: string
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public count(property: string): Omit<this, WhereMethods | CaseMethods> {
        this._conditional = property
        this.type = 'prop'

        return this
    }

    // ------------------------------------------------------------------------

    public where<
        K extends EntityPropertiesKeys<InstanceType<T>>,
        Cond extends (
            EntityProperties<InstanceType<T>>[K] |
            CompatibleOperators<EntityProperties<InstanceType<T>>[K]>
        )
    >(
        propertie: K,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): Omit<this, CaseMethods | CountMethods> {
        this.verifyWhere();
        (this._conditional as WhereQueryBuilder<T>).where(
            propertie,
            conditional,
            value
        )

        this.type = 'where'

        return this
    }

    // ------------------------------------------------------------------------

    public and = this.where

    // ------------------------------------------------------------------------

    public orWhere<
        K extends EntityPropertiesKeys<InstanceType<T>>,
        Cond extends (
            EntityProperties<InstanceType<T>>[K] |
            CompatibleOperators<EntityProperties<InstanceType<T>>[K]>
        )
    >(
        propertie: K,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): Omit<this, CaseMethods | CountMethods> {
        this.verifyWhere();
        (this._conditional as WhereQueryBuilder<T>).orWhere(
            propertie,
            conditional,
            value
        )

        return this
    }

    // ------------------------------------------------------------------------

    public case(caseClause: CaseQueryFunction<T>): (
        Omit<this, WhereMethods | CountMethods>
    ) {
        const handler = new CaseQueryBuilder(this.target, this.alias)

        caseClause(handler)
        this._conditional = handler
        this.type = 'case'

        return this
    }

    // ------------------------------------------------------------------------

    public as(name: string): void {
        this._as = name
    }

    // ------------------------------------------------------------------------

    public toQueryOptions(): CountQueryOption<InstanceType<T>> {
        if (typeof this._conditional === 'string') return this._conditional

        switch (this.type) {
            case "where": return this._conditional!.toQueryOptions()
            case "case": return {
                [Case]: this._conditional!.toQueryOptions() as (
                    CaseQueryOptions<InstanceType<T>>
                )
            }
        }

        throw new Error
    }

    // Privates ---------------------------------------------------------------
    private verifyWhere(): void {
        if (!this._conditional) this._conditional = new WhereQueryBuilder(
            this.target,
            this.alias
        )

        if (
            this._conditional &&
            !(this._conditional instanceof WhereQueryBuilder)
        ) throw new Error
    }
}