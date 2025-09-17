// SQL Builder
import {
    UpdateOrCreateSQLBuilder,

    type UpdateOrCreateAttibutes,
    type EntityPropertiesKeys
} from "../../SQLBuilders"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../Handlers"

// Types
import type { EntityTarget, AsEntityTarget } from "../../types/General"

/**
 * Build a Update or Create query
 */
export default class UpdateOrCreateQueryBuilder<T extends EntityTarget> {
    /**
     * @internal
     */
    private sqlBuilder: UpdateOrCreateSQLBuilder<T>

    constructor(
        public target: T,
        public alias?: string
    ) {
        this.sqlBuilder = new UpdateOrCreateSQLBuilder(
            this.target,
            {},
            this.alias
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Entity properties names to insert on table
     * @param names - Properties names
     * @returns {this} - `this`
     */
    public properties(...names: EntityPropertiesKeys<InstanceType<T>>[]): (
        Omit<this, 'data'>
    ) {
        this.sqlBuilder.fields(...names)
        return this
    }

    // ------------------------------------------------------------------------
    /**
     * Entity properties values to insert resgister on table 
     * @param values - Properties values
     * @returns {this} - `this`
     */
    public values(...values: any[]): Omit<this, 'data'> {
        this.sqlBuilder.values(...values)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Entity properties and values object data to insert on table
     * @param attributes - Attributes data 
     * @returns {this} - `this`
     */
    public data(attributes: UpdateOrCreateAttibutes<InstanceType<T>>): (
        Omit<this, 'fields' | 'values'>
    ) {
        this.sqlBuilder.setData(attributes)
        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Execute defined operation in database
    * @returns - Update or create result
    */
    public exec(): Promise<InstanceType<T>> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            this.sqlBuilder as unknown as UpdateOrCreateSQLBuilder<
                AsEntityTarget<T>
            >,
            'entity'
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    /**
     * Convert `this` to operation SQL string
     */
    public SQL(): string {
        return this.sqlBuilder.SQL()
    }
}