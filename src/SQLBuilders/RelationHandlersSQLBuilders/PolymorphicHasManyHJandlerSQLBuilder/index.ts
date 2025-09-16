import ManyRelationHandlerSQLBuilder from "../ManyRelationHandlerSQLBuilder"
import BasePolymorphicEntity from "../../../BasePolymorphicEntity"

// Types
import type {
    PolymorphicHasManyMetadata,
} from "../../../Metadata"

import type {
    EntityTarget
} from "../../../types/General"

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
    public get _targetPrimaryValue(): any {
        return this.target instanceof BasePolymorphicEntity
            ? this.target.primaryKey
            : this.targetPrimaryValue
    }

    // Protecteds -------------------------------------------------------------
    protected get includedAtrributes(): any {
        return {
            [this.foreignKey]: this._targetPrimaryValue,
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
        return this.target instanceof BasePolymorphicEntity
            ? this.target.entityType
            : this.metadata.targetType
    }

    // ------------------------------------------------------------------------

    private get includeTypeKey(): any {
        return this.typeKey ? { [this.typeKey]: this.targetType } : {}
    }

    // ------------------------------------------------------------------------

    private get whereForeignKeySQL(): string {
        return `
        ${this.relatedAlias}.${this.foreignKey} = ${this._targetPrimaryValue}
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