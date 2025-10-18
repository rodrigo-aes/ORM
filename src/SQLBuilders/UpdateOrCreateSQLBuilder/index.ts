import { EntityMetadata } from "../../Metadata"

// Procedures
import { UpdateOrCreate } from "../Procedures"

// SQL Builder
import FindOneSQLBuilder from "../FindOneSQLBuilder"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../types"
import type { UpdateOrCreateAttibutes } from "./types"
import type { EntityPropertiesKeys } from "../../types"

export default class UpdateOrCreateSQLBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    private _columns: EntityPropertiesKeys<InstanceType<T>>[] = []
    private _values: any[] = []

    constructor(
        public target: T,
        public attributes: UpdateOrCreateAttibutes<InstanceType<T>>,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = EntityMetadata.findOrThrow(this.target)
        this.mergeAttributes()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get columns(): EntityPropertiesKeys<InstanceType<T>>[] {
        return this._columns = this._columns ?? Object.keys(
            this.mergeAttributes()
        )
    }

    // ------------------------------------------------------------------------

    public get columnValues(): any[] {
        return this._values = this._values ?? Object.values(
            this.mergeAttributes()
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public fields(...names: EntityPropertiesKeys<InstanceType<T>>[]): this {
        this._columns.push(...names)
        return this
    }

    // ------------------------------------------------------------------------

    public values(...values: any[]): this {
        this._values.push(...values)
        return this
    }

    // ------------------------------------------------------------------------

    public setData(attributes: UpdateOrCreateAttibutes<InstanceType<T>>): (
        this
    ) {
        this.attributes = attributes
        this.mergeAttributes()

        return this
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return UpdateOrCreate
            .connection(this.metadata.connection)
            .callSQL(this.insertOrUpdateSQL(), this.selectSQL())
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
        return new FindOneSQLBuilder(
            this.target,
            { where: this.mergeAttributes() as any },
            this.alias
        )
            .SQL()
    }

    // Privates ---------------------------------------------------------------
    private propertiesSQL(): string {
        return this.columns.join(', ')
    }

    // ------------------------------------------------------------------------

    private valuesSQL(): string {
        return this.columnValues
            .map(value => PropertySQLHelper.valueSQL(value))
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private updateSQL(): string {
        return this.columns
            .map((prop) => `${prop} = VALUES(${prop})`)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private mergeAttributes(): UpdateOrCreateAttibutes<InstanceType<T>> {
        this.attributes = {
            ...this.attributes,
            ...Object.fromEntries(
                this._columns.map((key, index) => [key, this._values[index]])
            )
        }

        this._columns = Object.keys(this.attributes) as (
            EntityPropertiesKeys<InstanceType<T>>[]
        )
        this._values = Object.values(this.attributes)

        return this.attributes
    }
}

export {
    type UpdateOrCreateAttibutes
}