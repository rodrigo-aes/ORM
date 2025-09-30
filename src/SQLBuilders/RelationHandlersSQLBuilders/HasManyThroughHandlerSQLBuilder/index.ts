import ManyRelationHandlerSQLBuilder from "../ManyRelationHandlerSQLBuilder"

// Types
import type {
    HasManyThroughMetadata,
} from "../../../Metadata"

import type {
    EntityTarget
} from "../../../types"
import { CreationAttributes } from "../../CreateSQLBuilder"

// Exceptions
import PolyORMException from "../../../Errors"

export default class HasManyThroughHandlerSQLBuilder<
    Target extends object,
    Related extends EntityTarget
> extends ManyRelationHandlerSQLBuilder<
    HasManyThroughMetadata,
    Target,
    Related
> {
    constructor(
        protected metadata: HasManyThroughMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get includedAtrributes(): any {
        return {}
    }

    // Privates ---------------------------------------------------------------
    private get throughTableAlias(): string {
        return `${this.metadata.throughEntity.tableName} ${this.throughAlias}`
    }

    // ------------------------------------------------------------------------

    private get throughAlias(): string {
        return this.metadata.throughEntityName
    }

    // ------------------------------------------------------------------------

    private get foreignKey(): string {
        return this.metadata.foreignKey.name
    }

    // ------------------------------------------------------------------------

    private get throughForeignKey(): string {
        return this.metadata.throughForeignKey.name
    }

    // ------------------------------------------------------------------------

    private get throughPrimary(): string {
        return this.metadata.throughEntity.columns.primary.name
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override createSQL(_: CreationAttributes<InstanceType<Related>>): (
        [string, any[]]
    ) {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD', 'createSQL', this.constructor.name
        )
    }

    // ------------------------------------------------------------------------

    public override createManySQL(
        _: CreationAttributes<InstanceType<Related>>[]
    ): [string, any[][]] {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD', 'updateOrCreateSQL', this.constructor.name
        )
    }

    // Protecteds -------------------------------------------------------------
    protected fixedWhereSQL(): string {
        return `
            WHERE EXISTS (
                SELECT 1 FROM ${this.relatedTableAlias}
                    WHERE EXISTS (
                        SELECT 1 FROM ${this.throughTableAlias}
                            WHERE ${this.throughAlias}.${this.throughForeignKey}
                            = ${this.targetPrimaryValue}
                            AND ${this.relatedAlias}.${this.foreignKey} = 
                            ${this.throughAlias}.${this.throughPrimary}
                    )
            )
        `
    }
}
