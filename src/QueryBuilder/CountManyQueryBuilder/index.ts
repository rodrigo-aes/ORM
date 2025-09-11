// SQL Builders
import {
    CountSQLBuilder,

    type CountQueryOptions,
    type EntityProperties,
    type EntityPropertiesKeys
} from "../../SQLBuilders"

// Query Builders
import CountQueryBuilder from "../CountQueryBuilder"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type CountResult
} from "../../Handlers"

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

export default class CountManyQueryBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected _options: CountQueryBuilder<T>[] = []
    protected currentCount?: CountQueryBuilder<T>

    constructor(
        public target: T,
        public alias?: string
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public property(name: string): Omit<this, WhereMethods | CaseMethods> {
        this.handleCurrentCount()
        this.currentCount!.property(name)

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
        this.handleCurrentCount()
        this.currentCount!.where(propertie, conditional, value)

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
        this.handleCurrentCount()
        this.currentCount!.whereExists(exists, conditional)

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
        this.handleCurrentCount()
        this.orWhere(propertie, conditional, value)

        return this
    }

    // ------------------------------------------------------------------------

    public case(caseClause: CaseQueryHandler<T>): (
        Omit<this, WhereMethods | CountMethods>
    ) {
        this.handleCurrentCount()
        this.case(caseClause)

        return this
    }

    // ------------------------------------------------------------------------

    public as(name: string): this {
        this.handleCurrentCount()
        this.currentCount!.as(name)

        this._options.push(this.currentCount!)

        return this
    }

    // ------------------------------------------------------------------------

    public exec<T extends CountResult = CountResult>(): Promise<T> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            this.toSQLBuilder(),
            'json'
        )
            .exec() as unknown as Promise<T>
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return this.toSQLBuilder().SQL()
    }

    // ------------------------------------------------------------------------

    public toSQLBuilder(): CountSQLBuilder<T> {
        return CountSQLBuilder.countManyBuilder(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    public toQueryOptions(): CountQueryOptions<InstanceType<T>> {
        return Object.fromEntries(
            this._options.map(count => {
                if (!count._as) throw new Error

                return [count._as, count.toQueryOptions()]
            })
        )
    }

    // Protecteds -------------------------------------------------------------
    protected handleCurrentCount(): void {
        if (!this.currentCount) this.currentCount = new CountQueryBuilder(
            this.target,
            this.alias
        )
    }
}