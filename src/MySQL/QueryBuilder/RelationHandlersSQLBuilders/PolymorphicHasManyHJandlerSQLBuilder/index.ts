import ManyRelationHandlerSQLBuilder from "../ManyRelationHandlerSQLBuilder"
import PolymorphicEntity from "../../../PolymorphicEntity"

// Types
import type {
    PolymorphicHasManyMetadata,
} from "../../../Metadata"

import type {
    EntityTarget
} from "../../../../types/General"

export default class PolymorphicHasManyHandlerSQLBuilder<
    Target extends object,
    Related extends EntityTarget
> extends ManyRelationHandlerSQLBuilder<
    PolymorphicHasManyMetadata,
    Target,
    Related
> {
    constructor(
        protected metadata: PolymorphicHasManyMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public override get targetPrimaryValue(): any {
        return this.target instanceof PolymorphicEntity
            ? this.target.primaryKey
            : super.targetPrimaryValue
    }

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
        return this.target instanceof PolymorphicEntity
            ? this.target.entityType
            : this.metadata.targetType
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