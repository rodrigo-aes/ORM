import CreateQueryBuilder from "../CreateQueryBuilder"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../../Handlers"

// Types
import type {
    EntityTarget,
    AsEntityTarget
} from "../../../types"

import type {
    CreateSQLBuilder,
    CreationAttributes
} from "../../../SQLBuilders"

/**
 * Build `INSERT` query
 */
export default class InsertQueryBuilder<
    T extends EntityTarget
> extends CreateQueryBuilder<T> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public values(...values: any[]): Omit<this, 'data'> {
        this.sqlBuilder.values(...values)
        return this
    }

    // ------------------------------------------------------------------------

    public data(attributes: CreationAttributes<InstanceType<T>>): (
        Omit<this, 'fields' | 'values'>
    ) {
        this.sqlBuilder.setData(attributes)
        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Execute defined operation in database
    * @returns - Create result
    */
    public async exec(): Promise<InstanceType<T>> {
        this.sqlBuilder.bulk = false

        return new MySQL2QueryExecutionHandler(
            this.target,
            this.sqlBuilder,
            'entity'
        )
            .exec() as Promise<InstanceType<T>>
    }
}