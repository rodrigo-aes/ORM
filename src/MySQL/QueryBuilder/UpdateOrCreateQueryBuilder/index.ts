// SQL Builder
import {
    UpdateOrCreateSQLBuilder,

    type UpdateOrCreateAttibutes,
    type EntityPropertiesKeys
} from "../../SQLBuilders"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../Handlers"

// Types
import type { EntityTarget, AsEntityTarget } from "../../../types/General"

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
    public fields(...names: EntityPropertiesKeys<InstanceType<T>>[]): (
        Omit<this, 'data'>
    ) {
        this.sqlBuilder.fields(...names)
        return this
    }

    // ------------------------------------------------------------------------

    public values(...values: any[]): Omit<this, 'data'> {
        this.sqlBuilder.values(...values)
        return this
    }

    // ------------------------------------------------------------------------

    public data(attributes: UpdateOrCreateAttibutes<InstanceType<T>>): (
        Omit<this, 'fields' | 'values'>
    ) {
        this.sqlBuilder.setData(attributes)
        return this
    }

    // ------------------------------------------------------------------------

    public exec(): Promise<InstanceType<T>> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            this.sqlBuilder as UpdateOrCreateSQLBuilder<AsEntityTarget<T>>,
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