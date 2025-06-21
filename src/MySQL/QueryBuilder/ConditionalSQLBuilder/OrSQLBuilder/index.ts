import { EntityMetadata, EntityUnionMetadata } from "../../../Metadata"

// QueryBuilders
import AndSQLBuilder from "../AndSQLBuilder"

// Handlers
import { MetadataHandler } from "../../../Metadata"

// Helpers
import { SQLStringHelper } from "../../../Helpers"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../../types/General"
import type { OrQueryOptions } from "./types"

export default class OrSQLBuilder<
    T extends EntityTarget | UnionEntityTarget
> {
    protected metadata: EntityMetadata | EntityUnionMetadata

    public alias: string

    constructor(
        public target: T,
        public options: OrQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)!
        this.alias = alias ?? this.target.name.toLowerCase()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return this.options.map(
            and => SQLStringHelper.normalizeSQL(`
                (${new AndSQLBuilder(this.target, and, this.alias).SQL()})
            `)
        )
            .join(' OR ')
    }
}

export {
    type OrQueryOptions
}