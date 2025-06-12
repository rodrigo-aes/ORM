// SQL Builder
import UpdateOrCreateSQLBuilder from "../../UpdateOrCreateSQLBuilder"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../../Handlers"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { EntityPropertiesKeys } from "../../types"

export default class UpdateOrCreateQueryBuilder<T extends EntityTarget> {
    private sqlBuilder: UpdateOrCreateSQLBuilder<T>

    constructor(
        public target: T,
        public alias?: string
    ) {
        this.sqlBuilder = this.instantiateSQLBuilder()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public fields(...names: EntityPropertiesKeys<InstanceType<T>>[]): this {
        this.sqlBuilder.fields(...names)
        return this
    }

    // ------------------------------------------------------------------------

    public values(...values: any[]): this {
        this.sqlBuilder.values(...values)
        return this
    }

    // ------------------------------------------------------------------------

    public exec(): Promise<InstanceType<T>> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            this.sqlBuilder,
            'entity'
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return this.sqlBuilder.SQL()
    }

    // Privates ---------------------------------------------------------------
    private instantiateSQLBuilder(): UpdateOrCreateSQLBuilder<T> {
        return new UpdateOrCreateSQLBuilder(
            this.target,
            {},
            this.alias
        )
    }
}