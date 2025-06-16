import { EntityMetadata } from "../../Metadata"

// SQL Builders
import SelectSQLBuilder from "../SelectSQLBuilder"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../../types/General"

export default class FindByPkSQLBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    public alias: string
    public select: SelectSQLBuilder<T>

    constructor(
        public target: T,
        public pk: any,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()

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
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    private buildSelect(): SelectSQLBuilder<T> {
        return new SelectSQLBuilder(this.target, undefined, this.alias)
    }
}