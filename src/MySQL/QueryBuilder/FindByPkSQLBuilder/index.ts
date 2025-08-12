import { EntityMetadata, EntityUnionMetadata } from "../../Metadata"

// SQL Builders
import SelectSQLBuilder from "../SelectSQLBuilder"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { EntityTarget, EntityUnionTarget } from "../../../types/General"

export default class FindByPkSQLBuilder<
    T extends EntityTarget | EntityUnionTarget
> {
    protected metadata: EntityMetadata | EntityUnionMetadata

    public alias: string
    public select: SelectSQLBuilder<T>

    constructor(
        public target: T,
        public pk: any,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target)

        this.select = this.buildSelect()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return [
            this.select.SQL(),
            this.whereSQL()
        ]
            .join(' ')
    }

    // ------------------------------------------------------------------------

    public whereSQL(): string {
        return SQLStringHelper.normalizeSQL(`WHERE 
            ${this.alias}.${this.metadata.columns.primary.name} = ${this.pk}
        `)
    }

    // Privates ---------------------------------------------------------------
    private buildSelect(): SelectSQLBuilder<T> {
        return new SelectSQLBuilder(this.target, undefined, this.alias)
    }
}