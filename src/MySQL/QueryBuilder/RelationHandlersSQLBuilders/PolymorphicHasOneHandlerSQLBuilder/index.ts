import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"

// Types
import type {
    PolymorphicHasOneMetadata,
} from "../../../Metadata"

import type {
    EntityTarget
} from "../../../../types/General"

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
            [this.typeKey]: this.targetType
        }
    }

    // Privates ---------------------------------------------------------------
    private get foreignKey(): string {
        return this.metadata.foreignKey.name
    }

    // ------------------------------------------------------------------------

    private get typeKey(): string {
        return this.metadata.typeKey
    }

    // ------------------------------------------------------------------------

    private get targetType(): string {
        return this.metadata.targetType
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected fixedWhereSQL(): string {
        return `
            WHERE ${this.relatedAlias}.${this.foreignKey} = ${this.targetPrimaryValue}
            AND ${this.relatedAlias}.${this.typeKey} = "${this.targetType}"
        `
    }
}