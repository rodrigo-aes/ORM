import CreateQueryBuilder from "../CreateQueryBuilder"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../../Handlers"

// Types
import type { EntityTarget, AsEntityTarget } from "../../../../types/General"
import type {
    CreateSQLBuilder,
    CreationAttributes
} from "../../../SQLBuilders"

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

    public data(attributes: CreationAttributes<InstanceType<T>>[]): (
        Omit<this, "fields" | "values">
    ) {
        this.sqlBuilder.setData(attributes)
        return this
    }

    // ------------------------------------------------------------------------

    public async exec(): Promise<InstanceType<T>[]> {
        this.sqlBuilder.bulk = true

        return new MySQL2QueryExecutionHandler(
            this.target,
            this.sqlBuilder as CreateSQLBuilder<AsEntityTarget<T>>,
            'entity'
        )
            .exec() as Promise<InstanceType<T>[]>
    }
}