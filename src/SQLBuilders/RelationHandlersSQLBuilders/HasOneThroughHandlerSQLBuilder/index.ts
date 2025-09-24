import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"

// Types
import type {
    HasOneThroughMetadata,
} from "../../../Metadata"

import type {
    EntityTarget
} from "../../../types/General"

import type { CreationAttributes } from "../../CreateSQLBuilder"
import type { UpdateOrCreateAttibutes } from "../../UpdateOrCreateSQLBuilder"
import { OptionalNullable } from "../../../types/Properties"
import { EntityProperties } from "../../types"

// Exceptions
import PolyORMException from "../../../Errors"

export default class HasOneThroughHandlerSQLBuilder<
    Target extends object,
    Related extends EntityTarget
> extends OneRelationHandlerSQLBuilder<
    HasOneThroughMetadata,
    Target,
    Related
> {
    constructor(
        protected metadata: HasOneThroughMetadata,
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
        return this.metadata.foreignKeyName
    }

    // ------------------------------------------------------------------------

    private get throughForeignKey(): string {
        return this.metadata.throughForeigKeyName
    }

    // ------------------------------------------------------------------------

    private get throughPrimary(): string {
        return this.metadata.throughEntity.columns.primary.name
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override createSQL(
        _: CreationAttributes<InstanceType<Related>>
    ): [string, any[]] {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD', 'createSQL', this.constructor.name
        )
    }

    // ------------------------------------------------------------------------

    public override updateOrCreateSQL(
        _: UpdateOrCreateAttibutes<InstanceType<Related>>
    ): string {
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
