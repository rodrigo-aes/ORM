import { EntityMetadata } from "../../../Metadata"

// QueryBuilders
import AndQueryBuilder from "../AndQueryBuilder"

// Helpers
import { SQLStringHelper } from "../../../Helpers"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { OrQueryOptions } from "./types"

export default class OrQueryBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    public alias: string

    constructor(
        public target: T,
        public options: OrQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.metadata = this.loadMetadata()
        this.alias = alias ?? this.target.name.toLowerCase()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return this.options.map(
            and => SQLStringHelper.normalizeSQL(`
                (${new AndQueryBuilder(this.target, and, this.alias).SQL()})
            `)
        )
            .join(' OR ')
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }
}

export {
    type OrQueryOptions
}