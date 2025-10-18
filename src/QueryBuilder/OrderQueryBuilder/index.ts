import {
    type OrderQueryOptions as SQLBuilderQueryOptions
} from "../../SQLBuilders"

// Query Builders
import CaseQueryBuilder from "../CaseQueryBuilder"

// Symbols
import { Case } from "../../SQLBuilders"

// Handlers
import QueryBuilderHandler from "../QueryBuilderHandler"

// Types
import type { Target } from "../../types"
import type { OrderQueryOptions } from "./types"

/** @internal */
export default class OrderQueryBuilder<T extends Target> {
    private _options: SQLBuilderQueryOptions<InstanceType<T>> = []

    constructor(
        public target: T,
        public alias?: string
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public orderBy(...options: OrderQueryOptions<T>): this {
        for (const option of options) switch (typeof option) {
            case "object": this._options.push(option)
                break

            case "function":
                this._options.push({
                    [Case]: QueryBuilderHandler
                        .handle(
                            new CaseQueryBuilder(this.target, this.alias),
                            option
                        )
                        .toQueryOptions()
                })
        }

        return this
    }

    // -----------------------------------------------------------------------

    public toQueryOptions(): SQLBuilderQueryOptions<InstanceType<T>> {
        return this._options
    }
}

export {
    type OrderQueryOptions
}