// SQL Builder
import DeleteSQLBuilder from "../../DeleteSQLBuilder"

// Query Builders
import WhereQueryBuilder from "../WhereQueryBuilder"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../../Handlers"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { DeleteResult } from "../../../Handlers"
import type { EntityProperties, EntityPropertiesKeys } from "../../types"
import type { WhereQueryFunction } from "./types"
import type { OperatorType, CompatibleOperators } from "../OperatorQueryBuilder"

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
        Clause extends (
            EntityPropertiesKeys<InstanceType<T>> |
            WhereQueryFunction<T>
        ),
        Cond extends Clause extends EntityPropertiesKeys<InstanceType<T>>
        ? (
            EntityProperties<InstanceType<T>>[Clause] |
            CompatibleOperators<EntityProperties<InstanceType<T>>[Clause]>
        )
        : never
    >(
        clause: Clause,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): this {
        if (!this._where) this._where = (
            new WhereQueryBuilder(this.target, this.alias)
        )

        switch (typeof clause) {
            case "string": this._where.where(
                clause,
                conditional,
                value
            )
                break

            case "function": clause(this._where)
                break
        }

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