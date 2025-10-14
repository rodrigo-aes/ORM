import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"

// Types
import type {
    BelongsToThroughMetadata,
} from "../../../Metadata"

import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types"

import { CreationAttributes } from "../../CreateSQLBuilder"
import { OptionalNullable } from "../../../types/Properties"
import { EntityProperties } from "../../../types"

// Exceptions
import PolyORMException from "../../../Errors"

export default class BelongsToThroughHandlerSQLBuilder<
    Target extends object,
    Related extends EntityTarget | PolymorphicEntityTarget
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

    // ------------------------------------------------------------------------

    protected override get relatedPrimary(): (
        Extract<keyof InstanceType<Related>, string>
    ) {
        return `${this.relatedAlias}.${super.relatedPrimary}` as (
            Extract<keyof InstanceType<Related>, string>
        )
    }

    // Privates ---------------------------------------------------------------
    private get throughTable(): string {
        return this.metadata.throughTable
    }

    // ------------------------------------------------------------------------

    private get foreignKey(): string {
        return `${this.targetAlias}.${this.metadata.relatedFKName}`
    }

    // ------------------------------------------------------------------------

    private get throughForeignKey(): string {
        return this.metadata.throughFKName
    }

    // ------------------------------------------------------------------------

    private get throughPrimary(): string {
        return this.metadata.throughPrimary
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

    public override updateOrCreateSQL(
        _: Partial<OptionalNullable<EntityProperties<InstanceType<Related>>>>
    ): string {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD', 'updateOrCreateSQL', this.constructor.name
        )
    }

    // Protecteds -------------------------------------------------------------
    protected fixedWhereSQL(): string {
        return `WHERE EXISTS (
            SELECT 1 FROM ${this.relatedTableAlias} WHERE EXISTS (
                SELECT 1 FROM ${this.throughTable}
                WHERE ${this.throughForeignKey} = ${this.relatedPrimary}
                AND ${this.throughPrimary} = ${this.foreignKey}
            )
        )`
    }
}