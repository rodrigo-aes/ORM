import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"
import BaseEntityUnion from "../../../BaseEntityUnion"

// SQL Builders
import UnionSQLBuilder from "../../UnionSQLBuilder"
import { InternalUnionEntities } from "../../../BaseEntityUnion"

// Types
import type {
    PolymorphicBelongsToMetadata,
} from "../../../Metadata"

import type {
    EntityTarget,
    UnionEntityTarget
} from "../../../../types/General"

import { CreationAttributes } from "../../CreateSQLBuilder"
import { OptionalNullable } from "../../../../types/Properties"
import { EntityProperties } from "../../types"

export default class PolymorphicBelongsToHandlerSQLBuilder<
    Target extends object,
    Related extends UnionEntityTarget
> extends OneRelationHandlerSQLBuilder<
    PolymorphicBelongsToMetadata,
    Target,
    Related
> {
    constructor(
        protected metadata: PolymorphicBelongsToMetadata,
        protected target: Target,
        protected related: Related = InternalUnionEntities.get(
            metadata.unionTargetName
        ) as Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public override get relatedTable(): string {
        return this.union
    }

    // ------------------------------------------------------------------------

    public override get relatedTableAlias(): string {
        return this.union
    }

    // Protecteds -------------------------------------------------------------
    protected get includedAtrributes(): any {
        return {}
    }

    // Privates ---------------------------------------------------------------
    private get union(): string {
        return this.metadata.unionName
    }

    // ------------------------------------------------------------------------

    private get targetType(): string {
        return this.target.constructor.name
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override createSQL(_: CreationAttributes<InstanceType<Related>>): (
        string
    ) {
        throw new Error
    }

    // ------------------------------------------------------------------------

    public override updateOrCreateSQL(
        _: Partial<OptionalNullable<EntityProperties<InstanceType<Related>>>>
    ): string {
        throw new Error
    }

    // ------------------------------------------------------------------------

    public override updateSQL(
        _: Partial<EntityProperties<InstanceType<Related>>>
    ): string {
        throw new Error
    }

    // ------------------------------------------------------------------------

    public override deleteSQL(): string {
        throw new Error
    }

    // Protecteds -------------------------------------------------------------
    protected override selectSQL(): string {
        return `${this.unionSQL()} ${super.selectSQL()}`
    }

    // ------------------------------------------------------------------------

    protected fixedWhereSQL(): string {
        return `
            WHERE ${this.union}.primaryKey = ${this.targetPrimaryValue}
            AND ${this.union}.entityType = "${this.targetType}"
        `
    }

    // Privates ---------------------------------------------------------------
    private unionSQL(): string {
        return new UnionSQLBuilder(
            this.metadata.unionName,
            this.related
        )
            .SQL()
    }
}