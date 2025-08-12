import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"

// Types
import type {
    BelongsToThroughMetadata,
} from "../../../Metadata"

import type {
    EntityTarget,
    EntityUnionTarget
} from "../../../../types/General"

import { CreationAttributes } from "../../CreateSQLBuilder"
import { OptionalNullable } from "../../../../types/Properties"
import { EntityProperties } from "../../types"

export default class BelongsToThroughHandlerSQLBuilder<
    Target extends object,
    Related extends EntityTarget | EntityUnionTarget
> extends OneRelationHandlerSQLBuilder<
    BelongsToThroughMetadata,
    Target,
    Related
> {
    constructor(
        protected metadata: BelongsToThroughMetadata,
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
        throw new Error
    }

    // ------------------------------------------------------------------------

    public override updateOrCreateSQL(
        _: Partial<OptionalNullable<EntityProperties<InstanceType<Related>>>>
    ): string {
        throw new Error
    }

    // Protecteds -------------------------------------------------------------
    protected fixedWhereSQL(): string {
        return `
            WHERE EXISTS (
                SELECT 1 FROM ${this.relatedTableAlias}
                    WHERE EXISTS (
                        SELECT 1 FROM ${this.throughTableAlias}
                            WHERE ${this.throughAlias}.${this.throughForeignKey}
                            = ${this.relatedAlias}.${this.relatedPrimary as string}
                            AND ${this.throughAlias}.${this.throughPrimary} =
                            ${this.targetAlias}.${this.foreignKey as string}

                    )
            )
        `
    }
}