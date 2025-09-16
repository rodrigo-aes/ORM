// SQL Builders
import {
    CountSQLBuilder,
    Case,

    type CountQueryOption,
    type CaseQueryOptions,
    type EntityProperties,
    type EntityPropertiesKeys
} from "../../SQLBuilders"

// Query Builders
import ConditionalQueryHandler from "../ConditionalQueryBuilder"
import CaseQueryBuilder from "../CaseQueryBuilder"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../Handlers"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types/General"
import type { CaseQueryHandler, WhereQueryHandler } from "../types"
import type {
    CompatibleOperators,
    OperatorType
} from "../OperatorQueryBuilder"

type WhereMethods = 'where' | 'whereExists' | 'and' | 'andExists' | 'orWhere'
type CaseMethods = 'case'
type CountMethods = 'count'

export default class CountQueryBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    public _as?: string
    private _conditional?: (
        string |
        ConditionalQueryHandler<T> |
        CaseQueryBuilder<T>
    )

    public type!: 'prop' | 'where' | 'case'

    constructor(
        public target: T,
        public alias?: string
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public property(name: string): Omit<this, WhereMethods | CaseMethods> {
        this._conditional = name
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
        (this._conditional as ConditionalQueryHandler<T>).where(
            propertie,
            conditional,
            value
        )

        this.type = 'where'

        return this
    }

    // ------------------------------------------------------------------------

    public whereExists<
        Source extends (
            EntityTarget |
            PolymorphicEntityTarget |
            WhereQueryHandler<T>
        )
    >(
        exists: Source,
        conditional: typeof exists extends (
            EntityTarget |
            PolymorphicEntityTarget
        )
            ? WhereQueryHandler<Source>
            : never
    ): this {
        (this._conditional as ConditionalQueryHandler<T>).whereExists(
            exists,
            conditional
        )

        return this
    }

    // ------------------------------------------------------------------------

    public and = this.where

    // ------------------------------------------------------------------------

    public andExists = this.whereExists

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
        (this._conditional as ConditionalQueryHandler<T>).orWhere(
            propertie,
            conditional,
            value
        )

        return this
    }

    // ------------------------------------------------------------------------

    public case(caseClause: CaseQueryHandler<T>): (
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

    public async exec(): Promise<number> {
        return (
            await new MySQL2QueryExecutionHandler(
                this.target,
                this.toSQLBuilder(),
                'json'
            )
                .exec()
        )
            .result
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return this.toSQLBuilder().SQL()
    }

    // ------------------------------------------------------------------------

    public toSQLBuilder(): CountSQLBuilder<T> {
        return CountSQLBuilder.countBuilder(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
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
        if (!this._conditional) this._conditional = new ConditionalQueryHandler(
            this.target,
            this.alias
        )

        if (
            this._conditional &&
            !(this._conditional instanceof ConditionalQueryHandler)
        ) throw new Error
    }
}