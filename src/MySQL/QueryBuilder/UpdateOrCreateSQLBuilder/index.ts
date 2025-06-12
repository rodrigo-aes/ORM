import { EntityMetadata } from "../../Metadata"

// Procedures
import { UpdateOrCreate, type UpdateOrCreateArgs } from "../Procedures"

// SQL Builder
import FindSQLBuilder from "../FindSQLBuilder"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../../types/General"
import type { UpdateOrCreateAttibutes } from "./types"
import type { EntityPropertiesKeys } from "../types"
import type { ConditionalQueryOptions } from "../ConditionalQueryBuilder"

export default class UpdateOrCreateSQLBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    private _properties: EntityPropertiesKeys<InstanceType<T>>[] = []
    private _values: any[] = []

    public alias: string

    constructor(
        public target: T,
        public attributes: UpdateOrCreateAttibutes<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()

        this.mergeAttributes()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get columnsNames(): EntityPropertiesKeys<InstanceType<T>>[] {
        return this._properties ?? this.getPropetiesNames()
    }

    // ------------------------------------------------------------------------

    public get columnsValues(): any[] {
        return this._values ?? this.getValues()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public fields(...names: EntityPropertiesKeys<InstanceType<T>>[]): this {
        this._properties = [...this._properties, ...names]
        return this
    }

    // ------------------------------------------------------------------------

    public values(...values: any[]): this {
        this._values = [...this._values, ...values]
        return this
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return UpdateOrCreate.SQL(...this.arguments())
    }

    // ------------------------------------------------------------------------

    public arguments(): UpdateOrCreateArgs {
        return [
            this.insertOrUpdateSQL(),
            this.selectSQL()
        ]
    }

    // ------------------------------------------------------------------------

    public insertOrUpdateSQL(): string {
        return SQLStringHelper.normalizeSQL(`
            INSERT INTO ${this.metadata.tableName} (${this.propertiesSQL()}) 
            VALUES (${this.valuesSQL()})
            ON DUPLICATE KEY UPDATE ${this.updateSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public selectSQL(): string {
        return new FindSQLBuilder(
            this.target,
            {
                where: this.mergeAttributes() as (
                    ConditionalQueryOptions<InstanceType<T>>
                ),
                limit: 1
            },
            this.alias
        )
            .SQL()
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    private propertiesSQL(): string {
        return this.columnsNames.join(', ')
    }

    // ------------------------------------------------------------------------

    private valuesSQL(): string {
        return this.columnsValues
            .map(value => PropertySQLHelper.valueSQL(value))
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private updateSQL(): string {
        return this.columnsNames
            .map((prop) => `${prop as string} = VALUES(${prop as string})`)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private getPropetiesNames(): EntityPropertiesKeys<InstanceType<T>>[] {
        this._properties = Object.keys(this.mergeAttributes()) as (
            EntityPropertiesKeys<InstanceType<T>>[]
        )

        return this._properties
    }

    // ------------------------------------------------------------------------

    private getValues(): any[] {
        this._values = Object.values(this.mergeAttributes())
        return this._values
    }

    // ------------------------------------------------------------------------

    private mergeAttributes(): UpdateOrCreateAttibutes<InstanceType<T>> {
        const setted = Object.fromEntries(this._properties.map(
            (key, index) => [key, this._values[index]]
        ))

        this.attributes = {
            ...this.attributes,
            ...setted
        }

        this._properties = Object.keys(this.attributes) as (
            EntityPropertiesKeys<InstanceType<T>>[]
        )
        this._values = Object.values(this.attributes)

        return this.attributes
    }
}

export {
    type UpdateOrCreateAttibutes
}