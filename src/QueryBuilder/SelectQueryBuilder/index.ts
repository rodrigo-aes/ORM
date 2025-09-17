import { MetadataHandler } from "../../Metadata"

// SQL Builders
import {
    Case,

    type SelectOptions,
    type SelectPropertyOptions,
    type SelectPropertyKey,
    type CountQueryOptions
} from "../../SQLBuilders"

// Query Handlers
import CaseQueryBuilder from "../CaseQueryBuilder"
import CountQueryBuilder from "../CountQueryBuilder"

// Types
import type { Target, TargetMetadata } from "../../types/General"
import type { CountQueryHandler, CaseQueryHandler } from "../types"
import type { SelectPropertyType, SelectPropertiesOptions } from "./types"

/**
 * Build `SELECT` options
 */
export default class SelectQueryBuilder<T extends Target> {
    /** @internal */
    protected metadata: TargetMetadata<T>

    /** @internal */
    private _properties: SelectPropertyType<T>[] = []

    /** @internal */
    private _count: CountQueryBuilder<T>[] = []

    /** @internal */
    constructor(
        /** @internal */
        public target: T,

        /** @internal */
        public alias?: string
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Define entity properties to select
     * @param properties - Properties names 
     * @returns {this} - `this`
     */
    public properties(...properties: SelectPropertiesOptions<T>[]): (
        this
    ) {
        this._properties = [
            ...this._properties,
            ...properties.map(prop => this.handleProperty(prop))
        ]
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define to select a inline `COUNT` with entity properties
     * @param count - Entity property name to count or count query handler
     * @param as - Alias/Name to count result
     * @returns {this} - `this`
     */
    public count(count: CountQueryHandler<T> | string, as?: string): this {
        const handler = new CountQueryBuilder(this.target, this.alias)

        if (typeof count === 'string') handler.property(count)
        else count(handler)

        if (as) handler.as(as)

        this._count.push(handler)

        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `SelectOptions` object
    * @returns - A object with select options
    */
    public toQueryOptions(): SelectOptions<InstanceType<T>> {
        return {
            properties: this.propertiesToOptions(),
            count: this.countToOptions()
        }
    }

    // Privates ---------------------------------------------------------------
    /** @interal */
    private propertiesToOptions(): SelectPropertyOptions<InstanceType<T>>[] {
        return this._properties.map(
            prop => {
                switch (typeof prop) {
                    case "string": return prop as (
                        SelectPropertyKey<InstanceType<T>>
                    )

                    case "object": return {
                        [Case]: prop.toQueryOptions(),
                        as: prop._as!
                    }

                    default: throw new Error
                }
            }
        )
    }

    // ------------------------------------------------------------------------

    /** @interal */
    private countToOptions(): CountQueryOptions<InstanceType<T>> {
        return Object.fromEntries(
            this._count.map(
                count => [count._as!, count.toQueryOptions()]
            )
        )
    }

    // ------------------------------------------------------------------------

    /** @interal */
    private handleProperty(
        property: SelectPropertyKey<InstanceType<T>> | CaseQueryHandler<T>
    ): SelectPropertyKey<InstanceType<T>> | CaseQueryBuilder<T> {
        switch (typeof property) {
            case "string": return property
            case "function":
                const caseClause = new CaseQueryBuilder(
                    this.target,
                    this.alias
                )

                property(caseClause)
                return caseClause

            default: throw new Error
        }
    }
}


export {
    type SelectPropertiesOptions
}