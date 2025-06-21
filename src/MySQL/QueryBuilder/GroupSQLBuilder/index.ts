import { EntityMetadata, EntityUnionMetadata } from "../../Metadata"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Helpers
import { PropertySQLHelper } from "../../Helpers"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"
import type { GroupQueryOptions } from "./types"

export default class GroupSQLBuilder<
    T extends EntityTarget | UnionEntityTarget
> {
    protected metadata: EntityMetadata | EntityUnionMetadata

    public alias: string
    public mergedProperties: string[] = []

    constructor(
        public target: T,
        public options: GroupQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Instance Methods =======================================================
    public SQL(): string {
        return `GROUP BY ${this.propertiesSQL()}`
    }

    // ------------------------------------------------------------------------

    public propertiesSQL(): string {
        return [
            ...this.options.map(
                (path) => PropertySQLHelper.pathToAlias(
                    path as string,
                    this.alias)
            ),
            ...this.mergedProperties
        ]
            .join(', ')
    }

    // ------------------------------------------------------------------------

    public merge(groupQueryBuilder: GroupSQLBuilder<any>): void {
        this.mergedProperties.push(...groupQueryBuilder.options)
    }
}

export {
    type GroupQueryOptions
}