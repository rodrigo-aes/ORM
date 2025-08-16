import { EntityMetadata, PolymorphicEntityMetadata } from "../../../Metadata"

// QueryBuilders
import AndSQLBuilder from "../AndSQLBuilder"

// Handlers
import { MetadataHandler } from "../../../Metadata"

// Types
import type { EntityTarget, EntityUnionTarget } from "../../../../types/General"
import type { OrQueryOptions } from "./types"
import type UnionSQLBuilder from "../../UnionSQLBuilder"

export default class OrSQLBuilder<
    T extends EntityTarget | EntityUnionTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

    public alias: string

    private andSQLBuilders: AndSQLBuilder<T>[]

    constructor(
        public target: T,
        public options: OrQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)!
        this.alias = alias ?? this.target.name.toLowerCase()

        this.andSQLBuilders = this.buildAndSQLBulders()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return this.andSQLBuilders.map(and => and.SQL())
            .join(' OR ')
    }

    // ------------------------------------------------------------------------

    public unions(): UnionSQLBuilder[] {
        return this.andSQLBuilders.flatMap(and => and.unions())
    }

    // Privates ---------------------------------------------------------------
    private buildAndSQLBulders(): AndSQLBuilder<T>[] {
        return this.options.map(
            and => new AndSQLBuilder(this.target, and, this.alias)
        )
    }
}

export {
    type OrQueryOptions
}