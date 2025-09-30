// Types
import type { Target } from "../../types"

import type { GroupQueryOptions } from "../../SQLBuilders"

/** @internal */
export default class GroupQueryBuilder<T extends Target> {
    private _options: GroupQueryOptions<InstanceType<T>> = []

    constructor(
        public target: T,
        public alias?: string
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public groupBy(...columns: GroupQueryOptions<InstanceType<T>>): this {
        this._options.push(...columns as any[])
        return this
    }

    // ------------------------------------------------------------------------

    public toQueryOptions(): GroupQueryOptions<InstanceType<T>> {
        return this._options
    }
}