import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"

// Types
import type {
    BelongsToMetadata,
} from "../../../Metadata"

import type {
    EntityTarget,
    UnionEntityTarget
} from "../../../../types/General"

import { CreationAttributes } from "../../CreateSQLBuilder"
import { OptionalNullable } from "../../../../types/Properties"
import { EntityProperties } from "../../types"

export default class BelongsToHandlerSQLBuilder<
    Target extends object,
    Related extends EntityTarget | UnionEntityTarget
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
            WHERE ${this.relatedAlias}.${this.relatedPrimary as string} = 
            ${this.foreignKeyValue}
        `
    }
}