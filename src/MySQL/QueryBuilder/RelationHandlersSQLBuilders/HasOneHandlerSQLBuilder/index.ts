import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"

// Types
import type {
    HasOneMetadata,
} from "../../../Metadata"

import type {
    EntityTarget
} from "../../../../types/General"

export default class HasOneHandlerSQLBuilder<
    Target extends object,
    Related extends EntityTarget
> extends OneRelationHandlerSQLBuilder<
    HasOneMetadata,
    Target,
    Related
> {
    constructor(
        protected metadata: HasOneMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get includedAtrributes(): any {
        return { [this.metadata.foreignKey.name]: this.targetPrimaryValue }
    }

    // Privates ---------------------------------------------------------------
    private get relatedForeignKeySQL(): string {
        return `${this.relatedAlias}.${this.foreignKeyAsSQL}`
    }

    // ------------------------------------------------------------------------

    private get foreignKeyAsSQL(): string {
        return this.relatedColumnAsSQL(this.metadata.foreignKey.name)
    }


    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected fixedWhereSQL(): string {
        return `
            WHERE ${this.relatedForeignKeySQL} = ${this.targetPrimaryValue}
        `
    }
}