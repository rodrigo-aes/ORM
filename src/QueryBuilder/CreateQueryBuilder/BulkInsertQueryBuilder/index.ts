import CreateQueryBuilder from "../CreateQueryBuilder"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../../Handlers"

// Types
import type { EntityTarget, AsEntityTarget } from "../../../types/General"
import type {
    CreateSQLBuilder,
    CreationAttributes
} from "../../../SQLBuilders"

/**
 * Build a `BULK INSERT` query
 */
export default class BulkInsertQueryBuilder<
    T extends EntityTarget
> extends CreateQueryBuilder<T> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * An array of entity properties values array to insert many registers on 
     * table 
     * @param values - Array of properties values
     */
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

    /**
    * Execute defined operation in database
    * @returns - Create many result
    */
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