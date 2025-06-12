// SQL Builder
import UpdateSQLBuilder from "../../UpdateSQLBuilder"

// Query Builders
import WhereQueryBuilder from "../WhereQueryBuilder"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../../Handlers"

// Types
import type { ResultSetHeader } from "mysql2"
import type { EntityTarget } from "../../../../types/General"
import type { UpdateAttributes } from "../../UpdateSQLBuilder"
import type { EntityProperties, EntityPropertiesKeys } from "../../types"
import type { WhereQueryFunction } from "./types"
import type { OperatorType, CompatibleOperators } from "../OperatorQueryBuilder"

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

    public and = this.where

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