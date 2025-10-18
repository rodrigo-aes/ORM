import { MetadataHandler, type EntityMetadata } from "../../Metadata"

// SQL Builders
import {
    CreateSQLBuilder,
    type CreationAttributesOptions,
    type CreationAttibutesKey
} from "../../SQLBuilders"

// Types
import type { EntityTarget } from "../../types"

export default abstract class CreateQueryBuilder<T extends EntityTarget> {
    /** @internal */
    protected metadata: EntityMetadata

    /** @internal */
    protected sqlBuilder: CreateSQLBuilder<T>

    constructor(
        public target: T,
        public alias?: string,
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        this.sqlBuilder = new CreateSQLBuilder(
            this.target,
            undefined,
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
    public properties(...names: CreationAttibutesKey<InstanceType<T>>[]): (
        Omit<this, 'data'>
    ) {
        this.sqlBuilder.fields(...names)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Entity properties values to insert resgister on table 
     * @param values - Properties values
     */
    public abstract values(...values: any[]): Omit<this, 'data'>

    // ------------------------------------------------------------------------

    /**
     * Entity properties and values object data to insert on table
     * @param attributes - Attributes data 
     */
    public abstract data(attributes: (
        CreationAttributesOptions<InstanceType<T>>
    )): Omit<this, 'fields' | 'values'>

    // ------------------------------------------------------------------------

    /**
     * Convert `this` to operation SQL string
     */
    public SQL(): string {
        return this.sqlBuilder.SQL()
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `CreationAttributesOptions` object
    * @returns - A object with creations attributes options
    */
    public toQueryOptions(): CreationAttributesOptions<InstanceType<T>> {
        return this.sqlBuilder.mapAttributes()
    }
}