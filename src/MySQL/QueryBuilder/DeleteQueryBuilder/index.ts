// SQL Builder
import {
    DeleteSQLBuilder,

    type EntityProperties,
    type EntityPropertiesKeys
} from "../../SQLBuilders"

// Query Builders
import WhereQueryBuilder from "../WhereQueryBuilder"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type DeleteResult
} from "../../Handlers"

// Types
import type { EntityTarget } from "../../../types/General"
import type { WhereQueryHandler } from "../types"
import type {
    OperatorType,
    CompatibleOperators
} from "../OperatorQueryBuilder"

export default class DeleteQueryBuilder<T extends EntityTarget> {
    private _sqlBuilder?: DeleteSQLBuilder<T>
    private _where?: WhereQueryBuilder<T>


    constructor(
        public target: T,
        public alias?: string
    ) { }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    private get sqlBuilder(): DeleteSQLBuilder<T> {
        return this._sqlBuilder ?? this.buildSQLBuilder()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public where<
        K extends EntityPropertiesKeys<InstanceType<T>>,
        Cond extends (
            EntityProperties<InstanceType<T>>[K] |
            CompatibleOperators<EntityProperties<InstanceType<T>>[K]>
        )
    >(
        propertie: K | string,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): this {
        if (!this._where) this._where = new WhereQueryBuilder(
            this.target, this.alias
        )

        this._where.where(propertie, conditional, value)

        return this
    }

    // ------------------------------------------------------------------------

    public whereExists<
        Source extends (
            EntityTarget |
            WhereQueryHandler<T>
        )
    >(
        exists: Source,
        conditional: typeof exists extends (
            EntityTarget
        )
            ? WhereQueryHandler<Source>
            : never
    ): this {
        (this._where as WhereQueryBuilder<T>).whereExists(
            exists as EntityTarget,
            conditional as WhereQueryHandler<EntityTarget>
        )

        return this
    }

    // ------------------------------------------------------------------------

    public and = this.where

    // ------------------------------------------------------------------------

    public andExists = this.whereExists

    // ------------------------------------------------------------------------

    public or(): this {
        this._where!.or()
        return this
    }

    // ------------------------------------------------------------------------

    public orWhere<
        K extends EntityPropertiesKeys<InstanceType<T>>,
        Cond extends (
            EntityProperties<InstanceType<T>>[K] |
            CompatibleOperators<EntityProperties<InstanceType<T>>[K]>
        )
    >(
        propertie: K | string,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ) {
        this._where!.orWhere(propertie, conditional, value)
        return this
    }

    // ------------------------------------------------------------------------

    public exec(): Promise<DeleteResult> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            this.sqlBuilder,
            'raw'
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return this.sqlBuilder.SQL()
    }

    // Privates ---------------------------------------------------------------
    private buildSQLBuilder(): DeleteSQLBuilder<T> {
        this._sqlBuilder = new DeleteSQLBuilder(
            this.target,
            this._where?.toQueryOptions() ?? {},
            this.alias
        )

        return this._sqlBuilder
    }
}