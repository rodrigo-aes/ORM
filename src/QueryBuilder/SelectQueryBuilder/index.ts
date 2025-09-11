import {
    MetadataHandler,

    type EntityMetadata,
    type PolymorphicEntityMetadata
} from "../../Metadata"

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
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types/General"

import type {
    SelectPropertyType,
    SelectPropertiesOptions
} from "./types"

import type { CountQueryHandler, CaseQueryHandler } from "../types"

export default class SelectQueryBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

    private _properties: SelectPropertyType<T>[] = []
    private _count: CountQueryBuilder<T>[] = []

    constructor(
        public target: T,
        public alias?: string
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public properties(...properties: SelectPropertiesOptions<T>[]): (
        this
    ) {
        this._properties = [
            ...this._properties,
            ...properties.map(prop => this.handleProperty(
                prop
            ))
        ]
        return this
    }

    // ------------------------------------------------------------------------

    public count(
        countClause: CountQueryHandler<T> | string,
        as?: string
    ): this {
        const handler = new CountQueryBuilder(this.target, this.alias)

        if (typeof countClause === 'string') handler.property(countClause)
        else countClause(handler)

        this._count.push(handler)

        return this
    }

    // ------------------------------------------------------------------------

    public toQueryOptions(): SelectOptions<InstanceType<T>> {
        return {
            properties: this.propertiesToOptions(),
            count: this.countToOptions()
        }
    }

    // ------------------------------------------------------------------------

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

    private countToOptions(): CountQueryOptions<InstanceType<T>> {
        return Object.fromEntries(
            this._count.map(
                count => [count._as!, count.toQueryOptions()]
            )
        )
    }

    // ------------------------------------------------------------------------

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