import { EntityMetadata } from "../../Metadata"

import UnionEntity from "../../UnionEntity"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../../types/General"
import type { EntityCreationAttributes } from "./types"

export default class CreateQueryBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    public alias?: string

    private _propertyNames?: (
        keyof EntityCreationAttributes<InstanceType<T>>
    )[]

    private _values?: any[]

    constructor(
        public target: T,
        public options: EntityCreationAttributes<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get columns(): (
        keyof EntityCreationAttributes<InstanceType<T>>
    )[] {
        return this._propertyNames ?? this.getPropertyNames()
    }

    // ------------------------------------------------------------------------

    public get values(): any[] {
        return this._values ?? this.getValues()
    }

    // ------------------------------------------------------------------------

    public get args(): string {
        return Array(this.columns.length).fill('?').join(', ')
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(this.handleSQLType())
    }

    // ------------------------------------------------------------------------

    public getValues(): any[] {
        this._values = Object.entries(this.options)
            .flatMap(([columnName, value]) =>
                this.metadata.columns.findColumn(columnName)
                    ? value
                    : []
            )

        return this._values
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        if (this.target === UnionEntity) {
            return Reflect.getOwnMetadata(
                this.alias,
                this.target
            )
        }

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
            INSERT INTO ${this.metadata.tableName} (
                ${this.columns.join(', ')}
            )
            VALUES (
                ${this.args}
            )
        `
    }

    // ------------------------------------------------------------------------

    private unionSQL(): string {
        return ''
    }

    // ------------------------------------------------------------------------

    private getPropertyNames(): (
        keyof EntityCreationAttributes<InstanceType<T>>
    )[] {
        this._propertyNames = Object.keys(this.options).filter(
            (columnName) => this.metadata.columns.findColumn(columnName)
        ) as (keyof EntityCreationAttributes<InstanceType<T>>)[]

        return this._propertyNames
    }
}