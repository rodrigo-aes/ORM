import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"

// Types
import type {
    PolymorphicHasOneMetadata,
} from "../../../Metadata"

import type {
    EntityTarget
} from "../../../types/General"

export default class PolymorphicHasOneHandlerSQLBuilder<
    Target extends object,
    Related extends EntityTarget
> extends OneRelationHandlerSQLBuilder<
    PolymorphicHasOneMetadata,
    Target,
    Related
> {
    constructor(
        protected metadata: PolymorphicHasOneMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get includedAtrributes(): any {
        return {
            [this.foreignKey]: this.targetPrimaryValue,
            ...this.includeTypeKey
        }
    }

    // Privates ---------------------------------------------------------------
    private get foreignKey(): string {
        return this.metadata.foreignKey.name
    }

    // ------------------------------------------------------------------------

    private get typeKey(): string | undefined {
        return this.metadata.typeKey
    }

    // ------------------------------------------------------------------------

    private get targetType(): string {
        return this.metadata.targetType
    }

    // ------------------------------------------------------------------------

    private get includeTypeKey(): any {
        return this.typeKey ? { [this.typeKey]: this.targetType } : {}
    }

    // ------------------------------------------------------------------------

    private get whereForeignKeySQL(): string {
        return `
        ${this.relatedAlias}.${this.foreignKey} = ${this.targetPrimaryValue}
        `
    }

    // ------------------------------------------------------------------------

    private get whereTypeKeySQL(): string {
        return this.typeKey
            ? `AND ${this.relatedAlias}.${this.typeKey} = "${this.targetType}"`
            : ''
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected fixedWhereSQL(): string {
        return `WHERE ${this.whereForeignKeySQL} ${this.whereTypeKeySQL}`
    }
}