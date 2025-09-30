import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"

// Types
import type {
    BelongsToMetadata,
} from "../../../Metadata"

import type {
    EntityTarget,
    PolymorphicEntityTarget,
    EntityProperties,
    OptionalNullable
} from "../../../types"

import { CreationAttributes } from "../../CreateSQLBuilder"

// Exceptions
import PolyORMException from "../../../Errors"

export default class BelongsToHandlerSQLBuilder<
    Target extends object,
    Related extends EntityTarget | PolymorphicEntityTarget
> extends OneRelationHandlerSQLBuilder<
    BelongsToMetadata,
    Target,
    Related
> {
    constructor(
        protected metadata: BelongsToMetadata,
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
    private get foreignKeyValue(): any {
        return this.target[this.metadata.foreignKey.name as (
            keyof Target
        )]
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
        return `
            WHERE ${this.relatedAlias}.${this.relatedPrimary as string} = 
            ${this.foreignKeyValue}
        `
    }
}