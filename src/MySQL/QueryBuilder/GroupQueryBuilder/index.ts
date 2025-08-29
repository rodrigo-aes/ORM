// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types/General"

import type { GroupQueryOptions } from "../../SQLBuilders"

export default class GroupQueryBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
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