// Helpers
import { PropertySQLHelper } from "../../Helpers"

// Types
import type { Target } from "../../types"
import type { GroupQueryOptions } from "./types"

export default class GroupSQLBuilder<T extends Target> {
    constructor(
        public target: T,
        public options: GroupQueryOptions<InstanceType<T>>,
        public alias: string = target.name.toLowerCase()
    ) { }

    // Instance Methods =======================================================
    public SQL(): string {
        return `GROUP BY ${this.propertiesSQL()}`
    }

    // ------------------------------------------------------------------------

    public propertiesSQL(): string {
        return this.options
            .map(path => PropertySQLHelper.pathToAlias(path, this.alias))
            .join(', ')
    }

    // ------------------------------------------------------------------------

    public merge(group: GroupSQLBuilder<any>): void {
        this.options.concat(group.options)
    }
}

export {
    type GroupQueryOptions
}