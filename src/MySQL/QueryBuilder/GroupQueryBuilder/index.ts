import { EntityMetadata } from "../../Metadata"

import UnionEntity from "../../UnionEntity"

// Helpers
import { PropertySQLHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../../types/General"
import type { GroupQueryOptions } from "./types"

export default class GroupQueryBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    public alias: string

    constructor(
        public target: T,
        public options: GroupQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()
    }

    // Instance Methods =======================================================
    public SQL(): string {
        return `GROUP BY ${this.propertiesSQL()}`
    }

    // ------------------------------------------------------------------------

    public propertiesSQL(): string {
        return this.options.map(
            (path) => PropertySQLHelper.pathToAlias(
                path as string,
                this.alias)
        )
            .join(', ')
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        if (this.target === UnionEntity) {
            return Reflect.getOwnMetadata(
                this.alias,
                this.target
            )
        }

        return EntityMetadata.find(this.target)!
    }
}