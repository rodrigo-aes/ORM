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

    private _properties?: EntityPropertiesKeys<InstanceType<T>>[]
    private _values?: any[]

    public alias: string

    constructor(
        public target: T,
        public attributes: UpdateOrCreateAttibutes<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get properties(): EntityPropertiesKeys<InstanceType<T>>[] {
        return this._properties ?? this.getPropetiesNames()
    }

    // ------------------------------------------------------------------------

    public get values(): any[] {
        return this._values ?? this.getValues()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
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
                where: this.attributes as (
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
        return this.properties.join(', ')
    }

    // ------------------------------------------------------------------------

    private valuesSQL(): string {
        return this.values.map(value => PropertySQLHelper.valueSQL(value))
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private updateSQL(): string {
        return this.properties.map(
            (prop) => `${prop as string} = VALUES(${prop as string})`
        )
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private getPropetiesNames(): EntityPropertiesKeys<InstanceType<T>>[] {
        this._properties = Object.keys(this.attributes) as (
            EntityPropertiesKeys<InstanceType<T>>[]
        )

        return this._properties
    }

    // ------------------------------------------------------------------------

    private getValues(): any[] {
        this._values = Object.values(this.attributes)
        return this._values
    }
}