import { EntityMetadata } from "../../Metadata"

import UnionEntity from "../../UnionEntity"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../../types/General"
import type {
    CreationAttributes,
    EntityCreationAttributes,
    CreationAttibutesKey,
    AttributesNames,
} from "./types"

export default class CreateQueryBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    public alias?: string

    private _bulk: boolean
    private _propertyNames?: AttributesNames<InstanceType<T>>
    private _values?: any[]

    constructor(
        public target: T,
        public attributes?: CreationAttributes<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()

        this._bulk = Array.isArray(this.attributes)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get columnsNames(): CreationAttibutesKey<InstanceType<T>>[] {
        return [...(this._propertyNames ?? this.getFields())]
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
        return SQLStringHelper.normalizeSQL(this.handleSQLType())
    }

    // ------------------------------------------------------------------------

    public fields(...names: CreationAttibutesKey<InstanceType<T>>[]): this {
        this._propertyNames = new Set(names) as (
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

    public mapAttributes(): CreationAttributes<InstanceType<T>> {
        const [first] = this.columnsValues

        return Array.isArray(first)
            ? this.columnsValues.map(
                (values: any[]) => this.mapCreationAttibutes(values)
            )
            : this.mapCreationAttibutes(this.columnsValues)
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    private handleSQLType(): string {
        if (this.target.prototype instanceof UnionEntity) return (
            this.unionSQL()
        )

        return this.entitySQL()
    }

    // ------------------------------------------------------------------------

    private entitySQL(): string {
        return `
            INSERT INTO ${this.metadata.tableName} (${this.columnsSQL()})
            VALUES ${this.placeholdersSQL()}
            RETURNING ${this.columnsSQL()}
        `
    }

    // ------------------------------------------------------------------------

    private unionSQL(): string {
        return ''
    }

    // ------------------------------------------------------------------------

    private columnsSQL(): string {
        return this.columnsNames.join(', ')
    }

    // ------------------------------------------------------------------------

    private placeholdersSQL(): string {
        return this._bulk
            ? this.bulkPlaceholderSQL()
            : this.placeholderSQL()
    }

    // ------------------------------------------------------------------------

    private placeholderSQL(): string {
        return `(${Array(this.columnsNames.length).fill('?').join(', ')})`
    }

    // ------------------------------------------------------------------------

    private bulkPlaceholderSQL(): string {
        return Array(
            (this.attributes as CreationAttibutesKey<InstanceType<T>>[])
                .length
        )
            .fill(this.placeholderSQL())
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private getFields(): AttributesNames<InstanceType<T>> {
        this._propertyNames = new Set([...(
            this._bulk
                ? this.bulkPropertyNames()
                : this.propertyNames()
        )]) as (
                AttributesNames<InstanceType<T>>
            )

        return this._propertyNames
    }

    // ------------------------------------------------------------------------

    private propertyNames(
        attributes?: EntityCreationAttributes<InstanceType<T>>
    ): CreationAttibutesKey<InstanceType<T>>[] {
        return Object.keys(attributes ?? this.attributes ?? {})
            .filter(key => this.metadata.columns.findColumn(key)) as (
                CreationAttibutesKey<InstanceType<T>>[]
            )
    }

    // ------------------------------------------------------------------------

    private bulkPropertyNames(): CreationAttibutesKey<InstanceType<T>>[] {
        return (this.attributes as EntityCreationAttributes<InstanceType<T>>[])
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
                this.attributes as EntityCreationAttributes<InstanceType<T>>
            )[column]
                ?? null
        )
    }

    // ------------------------------------------------------------------------

    private bulkCreateValues(): any[][] {
        return (this.attributes as EntityCreationAttributes<InstanceType<T>>[])
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
    type CreationAttributes,
    type EntityCreationAttributes,
    type CreationAttibutesKey
}