import CreateQueryBuilder from "../CreateQueryBuilder"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../../../Handlers"

// Types
import type { EntityTarget } from "../../../../../types/General"

export default class BulkInsertQueryBuilder<
    T extends EntityTarget
> extends CreateQueryBuilder<T> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public values(...values: any[][]): this {
        this.sqlBuilder.values(...values)
        return this
    }

    // ------------------------------------------------------------------------

    public async exec(): Promise<InstanceType<T>[]> {
        this.sqlBuilder.bulk = true

        return new MySQL2QueryExecutionHandler(
            this.target,
            this.sqlBuilder,
            'entity'
        )
            .exec() as Promise<InstanceType<T>[]>
    }
}