import {
    EntityMetadata,
    PolymorphicEntityMetadata,
    MetadataHandler
} from "../../Metadata"

import BaseEntity, { ColumnsSnapshots } from "../../BaseEntity"
import BasePolymorphicEntity from "../../BasePolymorphicEntity"

// SQL Builders
import ConditionalSQLBuilder from "../ConditionalSQLBuilder"

// Handlers
import { ConditionalQueryJoinsHandler } from "../../Handlers"
import { ScopeMetadataHandler } from "../../Metadata"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types/General"

import type { ConditionalQueryOptions } from "../ConditionalSQLBuilder"

import type {
    UpdateAttributes,
    UpdateAtt5ributesKey,
    AttributesNames
} from "./types"

export default class UpdateSQLBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

    public alias: string

    private _propertiesNames?: AttributesNames<InstanceType<T>>
    private _values?: any[]

    constructor(
        public target: T,
        public attributes: (
            UpdateAttributes<InstanceType<T>> |
            BaseEntity |
            BasePolymorphicEntity<any>
        ),
        public conditional?: ConditionalQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target)

        this.applyConditionalScope()

        if (this.attributes instanceof BasePolymorphicEntity) (
            this.attributes = this.attributes.toSourceEntity()
        )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get columnsNames(): UpdateAtt5ributesKey<InstanceType<T>>[] {
        return [...(this._propertiesNames ?? this.getFields())]
    }

    // ------------------------------------------------------------------------

    public get columnsValues(): any[] {
        return this._values ?? this.getValues()
    }

    // Protecteds -------------------------------------------------------------
    protected get targetMetadata(): EntityMetadata {
        return this.metadata instanceof PolymorphicEntityMetadata
            ? this.metadata.sourcesMetadata[
            (this.attributes as BasePolymorphicEntity<any>).entityType
            ]
            : this.metadata
    }

    // ------------------------------------------------------------------------

    protected get tableName(): string {
        return this.targetMetadata.tableName
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            UPDATE ${this.tableName} ${this.alias}
            ${this.joinsSQL()}
            ${this.setSQL()}
            ${this.whereSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public joinsSQL(): string {
        return this.conditional
            ? new ConditionalQueryJoinsHandler(
                this.target,
                this.conditional,
                this.alias
            )
                .joins()
                .map(join => join.SQL())
                .join(' ')
            : ''
    }

    // ------------------------------------------------------------------------

    public setSQL(): string {
        return `SET ${this.setValuesSQL()}`
    }

    // ------------------------------------------------------------------------

    public whereSQL(): string {
        return this.conditional
            ? ConditionalSQLBuilder.where(
                this.target,
                this.conditional,
                this.alias
            )
                .SQL()
            : ''
    }

    // Privates ---------------------------------------------------------------
    private applyConditionalScope(): void {
        if (this.conditional) this.conditional = (
            ScopeMetadataHandler.applyScope(
                this.target,
                'conditional',
                this.conditional
            )
        )
    }

    private getFields(): AttributesNames<InstanceType<T>> {
        this._propertiesNames = new Set([...this.propertyNames()]) as (
            AttributesNames<InstanceType<T>>
        )

        return this._propertiesNames
    }

    // ------------------------------------------------------------------------

    private propertyNames(attributes?: UpdateAtt5ributesKey<InstanceType<T>>): (
        UpdateAtt5ributesKey<InstanceType<T>>[]
    ) {
        return Object.keys(attributes ?? this.attributes ?? {})
            .filter(key => this.metadata.columns.findColumn(key)) as (
                UpdateAtt5ributesKey<InstanceType<T>>[]
            )
    }

    // ------------------------------------------------------------------------

    private getValues(): any[] {
        return this.columnsNames.map(
            column => (
                this.attributes as UpdateAttributes<InstanceType<T>>
            )[column]
                ?? null
        )
    }

    // ------------------------------------------------------------------------

    private setValuesSQL(): string {
        return Object.entries(this.onlyChangedAttributes())
            .map(([col, val]) =>
                `${this.alias}.${col} = ${PropertySQLHelper.valueSQL(val)}`
            )
            .join(' ')
    }

    // ------------------------------------------------------------------------

    private onlyChangedAttributes(): any {
        return (
            this.attributes instanceof BaseEntity ||
            this.attributes instanceof BasePolymorphicEntity
        )
            ? ColumnsSnapshots.changed(this.attributes)
            : this.validAttributes()
    }

    // ------------------------------------------------------------------------

    private validAttributes(): UpdateAttributes<InstanceType<T>> {
        return Object.fromEntries(Object.entries(this.attributes).flatMap(
            ([key, value]) => this.columnsNames.includes(
                key as UpdateAtt5ributesKey<InstanceType<T>>
            )
                ? [[key, value]]
                : []
        )) as UpdateAttributes<InstanceType<T>>
    }
}

export {
    type UpdateAttributes,
    type UpdateAtt5ributesKey as UpdateAttibutesKey
}