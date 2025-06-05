import { EntityMetadata } from "../../../Metadata"
import { Case } from "../../ConditionalQueryBuilder"

// Query Handlers
import CaseQueryBuilder from "../CaseQueryBuilder"
import CountQueryBuilder from "../CountQueryBuilder"

// Types
import type { EntityTarget } from "../../../../types/General"
import type {
    SelectOptions,
    SelectPropertyOptions,
    SelectPropertyKey
} from "../../SelectSQLBuilder"

import type {
    CountQueryOptions
} from "../../CountSQLBuilder"

import type {
    SelectPropertyType,
    SelectPropertiesOptions,
    SelectCaseFunction,
    SelectCountFunction
} from "./types"

export default class SelectQueryBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    private _properties: SelectPropertyType<T>[] = []
    private _count: CountQueryBuilder<T>[] = []

    constructor(
        public target: T,
        public alias?: string
    ) {
        this.metadata = this.loadMetadata()
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
        countClause: SelectCountFunction<T> | string,
        as?: string
    ): this {
        const handler = new CountQueryBuilder(this.target, this.alias)

        if (typeof countClause === 'string') handler.count(countClause)
        else countClause(handler)

        if (as) handler._as = as
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

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
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
        property: SelectPropertyKey<InstanceType<T>> | SelectCaseFunction<T>
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