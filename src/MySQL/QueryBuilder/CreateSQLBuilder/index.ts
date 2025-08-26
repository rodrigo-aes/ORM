import { EntityMetadata } from "../../Metadata"

// Symbols
import { Old, New } from "../../Triggers"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../../types/General"
import type {
    CreationAttributesOptions,
    CreationAttributes,
    CreationAttibutesKey,
    AttributesNames,
} from "./types"

export default class CreateSQLBuilder<
    T extends EntityTarget
> {
    protected metadata: EntityMetadata

    public alias?: string

    private _bulk: boolean
    private _propertiesNames?: AttributesNames<InstanceType<T>>
    private _values?: any[]

    constructor(
        public target: T,
        public attributes?: CreationAttributesOptions<InstanceType<T>>,
        alias?: string,
        public absolute: boolean = false
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target) as (
            EntityMetadata
        )

        this._bulk = Array.isArray(this.attributes)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get columnsNames(): CreationAttibutesKey<InstanceType<T>>[] {
        return [...(this._propertiesNames ?? this.getFields())]
    }

    // ------------------------------------------------------------------------

    public get columnsValues(): any[] {
        return this._values ?? this.getValues()
    }

    // Setters ================================================================
    public set bulk(bulk: boolean) {
        this._bulk = bulk
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            INSERT INTO ${this.metadata.tableName} (${this.columnsSQL()})
            VALUES ${this.valuesSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public fields(...names: CreationAttibutesKey<InstanceType<T>>[]): this {
        this._propertiesNames = new Set(names) as (
            AttributesNames<InstanceType<T>>
        )

        return this
    }

    // ------------------------------------------------------------------------

    public values(...values: any[]): this {
        this._values = values
        return this
    }

    // ------------------------------------------------------------------------

    public setData(attributes: CreationAttributesOptions<InstanceType<T>>): (
        this
    ) {
        this.attributes = attributes
        this._propertiesNames = undefined
        this._values = undefined

        return this
    }

    // ------------------------------------------------------------------------

    public mapAttributes(): CreationAttributesOptions<InstanceType<T>> {
        const [first] = this.columnsValues

        return Array.isArray(first)
            ? this.columnsValues.map(
                (values: any[]) => this.mapCreationAttibutes(values)
            )
            : this.mapCreationAttibutes(this.columnsValues)
    }

    // Privates ---------------------------------------------------------------
    private columnsSQL(): string {
        return this.columnsNames.join(', ')
    }

    // ------------------------------------------------------------------------

    private valuesSQL(): string {
        return this.absolute
            ? this.handleValuesSQL()
            : this.placeholdersSQL()
    }

    // ------------------------------------------------------------------------

    private placeholdersSQL(): string {
        return this._bulk
            ? this.bulkPlaceholderSQL()
            : this.placeholderSetSQL()
    }

    // ------------------------------------------------------------------------

    private handleValuesSQL(): string {
        const [first] = this.columnsValues

        return Array.isArray(first)
            ? this.columnsValues.map(values => this.valueSetSQL(values)).join(
                ', '
            )
            : this.valueSetSQL(this.columnsValues)
    }

    // ------------------------------------------------------------------------

    private valueSetSQL(values: any[]): string {
        return `(${values.map(value =>
            (
                typeof value === 'object' &&
                Object.getOwnPropertySymbols(value).some(
                    symbol => [Old, New].includes(symbol)
                )
            )
                ? (
                    value![Old as keyof typeof value]
                    ?? value![New as keyof typeof value]
                )
                : PropertySQLHelper.valueSQL(value)
        ).join(', ')})`
    }

    // ------------------------------------------------------------------------

    private placeholderSetSQL(): string {
        return `(${Array(this.columnsNames.length).fill('?').join(', ')})`
    }

    // ------------------------------------------------------------------------

    private bulkPlaceholderSQL(): string {
        return Array(
            (this.attributes as CreationAttibutesKey<InstanceType<T>>[])
                .length
        )
            .fill(this.placeholderSetSQL())
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private getFields(): AttributesNames<InstanceType<T>> {
        this._propertiesNames = new Set([...(
            this._bulk
                ? this.bulkPropertyNames()
                : this.propertyNames()
        )]) as (
                AttributesNames<InstanceType<T>>
            )

        return this._propertiesNames
    }

    // ------------------------------------------------------------------------

    private propertyNames(attributes?: CreationAttributes<InstanceType<T>>): (
        CreationAttibutesKey<InstanceType<T>>[]
    ) {
        return Object.keys(attributes ?? this.attributes ?? {})
            .filter(key => this.metadata.columns.findColumn(key)) as (
                CreationAttibutesKey<InstanceType<T>>[]
            )
    }

    // ------------------------------------------------------------------------

    private bulkPropertyNames(): CreationAttibutesKey<InstanceType<T>>[] {
        return (this.attributes as CreationAttributes<InstanceType<T>>[])
            .flatMap(att => this.propertyNames(att)) as (
                CreationAttibutesKey<InstanceType<T>>[]
            )
    }

    // ------------------------------------------------------------------------

    private getValues(): any[] | any[][] {
        return this._bulk
            ? this.bulkCreateValues()
            : this.createValues()
    }

    // ------------------------------------------------------------------------

    private createValues(): any[] {
        return this.columnsNames.map(
            column => (
                this.attributes as CreationAttributes<InstanceType<T>>
            )[column]
                ?? null
        )
    }

    // ------------------------------------------------------------------------

    private bulkCreateValues(): any[][] {
        return (this.attributes as CreationAttributes<InstanceType<T>>[])
            .map(
                att => this.columnsNames.map(
                    column => att[column] ?? null
                )
            )
    }

    // ------------------------------------------------------------------------

    private mapCreationAttibutes(values: any[]): any {
        return Object.fromEntries(
            values.map((value, index) => [
                this.columnsNames[index], value
            ])
        )
    }
}

export {
    type CreationAttributesOptions,
    type CreationAttributes,
    type CreationAttibutesKey
}