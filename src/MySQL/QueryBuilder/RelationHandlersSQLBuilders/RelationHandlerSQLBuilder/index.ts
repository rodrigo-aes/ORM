import BaseEntity, { ColumnsSnapshots } from "../../../BaseEntity"
import BasePolymorphicEntity from "../../../BasePolymorphicEntity"

// Handlers 
import { MetadataHandler } from "../../../Metadata"

// Helpers
import { PropertySQLHelper } from "../../../Helpers"

// Types
import type {
    RelationMetadataType,
    EntityMetadata,
    PolymorphicEntityMetadata
} from "../../../Metadata"

import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types/General"

import type { CreationAttributes } from "../../CreateSQLBuilder"
import type { UpdateOrCreateAttibutes } from "../../UpdateOrCreateSQLBuilder"
import type { UpdateAttributes } from "../../UpdateSQLBuilder"

export default abstract class RelationHandlerSQLBuilder<
    RelationMetadata extends RelationMetadataType,
    Target extends object,
    Related extends EntityTarget | PolymorphicEntityTarget
> {
    protected targetMetadata: EntityMetadata | PolymorphicEntityMetadata = (
        MetadataHandler.loadMetadata(
            this.target.constructor as EntityTarget | PolymorphicEntityTarget
        )
    )
    protected relatedMetadata: EntityMetadata | PolymorphicEntityMetadata = (
        MetadataHandler.loadMetadata(this.related)
    )

    constructor(
        protected metadata: RelationMetadata,
        protected target: Target,
        protected related: Related
    ) { }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    public get targetAlias(): string {
        return this.target.constructor.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get targetTable(): string {
        return this.targetMetadata.tableName
    }

    // ------------------------------------------------------------------------

    public get targetPrimary(): keyof Target {
        return this.targetMetadata.columns.primary.name as keyof Target
    }

    // ------------------------------------------------------------------------

    public get targetPrimaryValue(): any {
        return PropertySQLHelper.valueSQL(this.target[this.targetPrimary])
    }

    // ------------------------------------------------------------------------

    public get relatedAlias(): string {
        return this.related.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get relatedTable(): string {
        return this.relatedMetadata.tableName
    }

    // ------------------------------------------------------------------------

    public get relatedTableAlias(): string {
        return `${this.relatedTable} ${this.relatedAlias}`
    }

    // ------------------------------------------------------------------------

    public get relatedPrimary(): keyof InstanceType<Related> {
        return this.relatedMetadata.columns.primary.name as (
            keyof InstanceType<Related>
        )
    }

    // Protecteds ------------------------------------------------------------
    protected abstract get includedAtrributes(): any

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected abstract fixedWhereSQL(): string

    // ------------------------------------------------------------------------

    protected selectSQL(): string {
        return `
            SELECT ${this.relatedColumnsSQL()} 
            FROM ${this.relatedTableAlias}
        `
    }

    // ------------------------------------------------------------------------

    protected relatedColumnAsSQL(column: string): string {
        return `${column} AS ${this.relatedAlias}_${column}`
    }

    // ------------------------------------------------------------------------

    protected attributesKeys(
        attributes: (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>>
        )
    ): (keyof Related)[] {
        return Object.keys({ ...attributes, ...this.includedAtrributes }) as (
            (keyof Related)[]
        )
    }

    // ------------------------------------------------------------------------

    protected attributesValues(
        attributes: (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>>
        )
    ): any[] {
        return Object.values({ ...attributes, ...this.includedAtrributes })
    }

    // ------------------------------------------------------------------------

    protected attributesKeysAndValues(
        attributes: (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>>
        )
    ): ([(keyof Related), any])[] {
        return Object.entries({
            ...attributes,
            ...this.includedAtrributes
        }) as (
                ([(keyof Related), any])[]
            )
    }

    // ------------------------------------------------------------------------

    protected mergeAttributes<Att extends (
        CreationAttributes<InstanceType<Related>> |
        UpdateAttributes<InstanceType<Related>> |
        UpdateOrCreateAttibutes<InstanceType<Related>>
    )>(
        attributes: Att
    ): Att {
        return {
            ...attributes,
            ...this.includedAtrributes
        }
    }

    // Privates ---------------------------------------------------------------
    protected setSQL(
        attributes: UpdateAttributes<InstanceType<Related>>
    ): string {
        return `SET ${this.setValuesSQL(attributes)}`
    }

    // ------------------------------------------------------------------------

    protected setValuesSQL(
        attributes: UpdateAttributes<InstanceType<Related>>
    ): string {
        return Object.entries(this.onlyChangedAttributes(attributes)).map(
            ([column, value]) => `
                ${this.relatedAlias}.${column} = 
                ${PropertySQLHelper.valueSQL(value)}
            `
        )
            .join(' ')
    }

    // ------------------------------------------------------------------------

    protected onlyChangedAttributes(
        attributes: UpdateAttributes<InstanceType<Related>>
    ): any {
        return (
            attributes instanceof BaseEntity ||
            attributes instanceof BasePolymorphicEntity
        )
            ? ColumnsSnapshots.changed(attributes)
            : attributes
    }

    // ------------------------------------------------------------------------

    protected placeholderSetSQL(
        attributes: (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>>
        ) | number
    ): string {
        return `(${Array(
            typeof attributes === 'number'
                ? attributes
                : this.attributesKeys(attributes).length
        )
            .fill('?')
            .join(', ')})
        `
    }

    // ------------------------------------------------------------------------

    protected bulkPlaceholderSQL(
        attributes: (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>>
        )[]
    ): string {
        return Array(attributes.length)
            .fill(
                this.placeholderSetSQL(
                    this.bulkCreateColumns(attributes).length
                )
            )
            .join(', ')
    }

    // ------------------------------------------------------------------------

    protected createValues<
        Att extends (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>>
        )
    >(
        attributes: Att | Att[]
    ): any[] | any[][] {
        if (Array.isArray(attributes)) {
            const columns = this.bulkCreateColumns(attributes) as (
                (keyof Att)[]
            )

            return attributes.map(att =>
                columns.map(col => att[col] ?? null)
            )
        }

        return Object.values(attributes)
    }


    // ------------------------------------------------------------------------

    protected bulkCreateColumns(
        attributes: (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>>
        )[]
    ): string[] {
        return [...new Set<string>([
            ...attributes.flatMap(att => Object.keys(att))
        ])]
    }

    // Privates ---------------------------------------------------------------
    private relatedColumnsNames(): string[] {
        return [...this.relatedMetadata.columns].map(({ name }) => name)
    }

    // ------------------------------------------------------------------------

    private relatedColumnsSQL(): string {
        return this.relatedColumnsNames().map(
            column => this.relatedColumnAsSQL(column)
        )
            .join(', ')
    }
}