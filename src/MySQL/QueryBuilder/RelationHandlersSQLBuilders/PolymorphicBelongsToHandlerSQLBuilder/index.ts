import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"

// SQL Builders
import UnionSQLBuilder from "../../UnionSQLBuilder"
import { InternalUnionEntities } from "../../../PolymorphicEntity"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../../Helpers"

// Types
import type { EntityMetadata } from "../../../Metadata"
import type {
    PolymorphicBelongsToMetadata,
} from "../../../Metadata"

import type { EntityUnionTarget } from "../../../../types/General"

import { CreationAttributes } from "../../CreateSQLBuilder"
import { OptionalNullable } from "../../../../types/Properties"
import { EntityProperties } from "../../types"

import type { UpdateAttributes } from "../../UpdateSQLBuilder"
export default class PolymorphicBelongsToHandlerSQLBuilder<
    Target extends object,
    Related extends EntityUnionTarget
> extends OneRelationHandlerSQLBuilder<
    PolymorphicBelongsToMetadata,
    Target,
    Related
> {
    private _sourceMetadata?: EntityMetadata

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

    // ------------------------------------------------------------------------

    private get foreignKey(): keyof Target {
        return this.metadata.foreignKey.name as keyof Target
    }

    // ------------------------------------------------------------------------

    private get foreignKeyValue(): any {
        return this.target[this.foreignKey]
    }

    // ------------------------------------------------------------------------

    private get typeKey(): keyof Target {
        return this.metadata.typeKey as keyof Target
    }

    // ------------------------------------------------------------------------

    private get sourceMetadata(): EntityMetadata {
        return this._sourceMetadata ?? this.loadSourceMetadata()
    }

    // ------------------------------------------------------------------------

    private get sourceTable(): string {
        return this.sourceMetadata.tableName
    }

    // ------------------------------------------------------------------------

    private get sourceAlias(): string {
        return this.sourceMetadata.target.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    private get sourcePrimary(): string {
        return this.sourceMetadata.columns.primary.name
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

    // ------------------------------------------------------------------------

    public override updateSQL(
        attributes: Partial<EntityProperties<InstanceType<Related>>>
    ): string {
        return SQLStringHelper.normalizeSQL(`
            UPDATE ${this.sourceTable} ${this.sourceAlias} 
            ${this.setSQL(attributes)}
            ${this.sourceWhereSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public override deleteSQL(): string {
        return `DELETE FROM ${this.sourceAlias} ${this.sourceWhereSQL()}`
    }

    // Protecteds -------------------------------------------------------------
    protected override selectSQL(): string {
        return `${this.unionSQL()} ${super.selectSQL()}`
    }

    // ------------------------------------------------------------------------

    protected override setValuesSQL(
        attributes: UpdateAttributes<InstanceType<Related>>
    ): string {
        return Object.entries(this.onlyChangedAttributes(attributes)).map(
            ([column, value]) => `
                ${this.sourceAlias}.${column} = 
                ${PropertySQLHelper.valueSQL(value)}
            `
        )
            .join(' ')
    }

    // ------------------------------------------------------------------------

    protected fixedWhereSQL(): string {
        return `
            WHERE ${this.union}.primaryKey = ${this.targetPrimaryValue}
            AND ${this.union}.entityType = "${this.targetType}"
        `
    }

    // Privates ---------------------------------------------------------------
    private loadSourceMetadata(): EntityMetadata {
        this._sourceMetadata = this.metadata.entities[
            this.target[this.typeKey] as string
        ]

        return this._sourceMetadata
    }

    // ------------------------------------------------------------------------

    private unionSQL(): string {
        return new UnionSQLBuilder(
            this.metadata.unionName,
            this.related
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    private sourceWhereSQL(): string {
        return `
            WHERE ${this.sourceAlias}.${this.sourcePrimary} = 
            ${this.foreignKeyValue}
        `
    }
}