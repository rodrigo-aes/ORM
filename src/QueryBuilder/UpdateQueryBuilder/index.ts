// SQL Builder
import {
    UpdateSQLBuilder,

    type UpdateAttributes,
    type EntityProperties,
    type EntityPropertiesKeys
} from "../../SQLBuilders"

// Query Builders
import WhereQueryBuilder from "../WhereQueryBuilder"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../Handlers"

// Types
import type { ResultSetHeader } from "mysql2"
import type { EntityTarget } from "../../types/General"

import type {
    OperatorType,
    CompatibleOperators
} from "../OperatorQueryBuilder"

import type { WhereQueryHandler } from "../types"

export default class UpdateQueryBuilder<T extends EntityTarget> {
    private _where?: WhereQueryBuilder<T>
    private attributes: UpdateAttributes<InstanceType<T>> = {}

    private _sqlBuilder?: UpdateSQLBuilder<T>

    constructor(
        public target: T,
        public alias?: string
    ) { }

    // Getters ================================================================
    // privates ---------------------------------------------------------------
    private get sqlBuilder(): UpdateSQLBuilder<T> {
        return this._sqlBuilder ?? this.buildSQLBuilder()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public set(attributes: UpdateAttributes<InstanceType<T>>): this {
        this.attributes = { ...this.attributes, ...attributes }
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

    public exec(): Promise<ResultSetHeader> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            this.sqlBuilder,
            'raw'
        )
            .exec() as Promise<ResultSetHeader>
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return this.sqlBuilder.SQL()
    }

    // Privates ---------------------------------------------------------------
    private buildSQLBuilder(): UpdateSQLBuilder<T> {
        this._sqlBuilder = new UpdateSQLBuilder(
            this.target,
            this.attributes,
            this._where?.toQueryOptions() ?? {},
            this.alias
        )

        return this._sqlBuilder
    }
}