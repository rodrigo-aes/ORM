// Types
import type { EntityTarget } from "../../../../types/General"
import type { GroupQueryOptions } from "../../GroupSQLBuilder"

export default class GroupQueryBuilder<T extends EntityTarget> {
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