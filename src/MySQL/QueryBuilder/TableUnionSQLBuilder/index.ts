import {
    EntityUnionMetadata,

    type EntityMetadata,
    type EntityUnionColumnMetadata
} from "../../Metadata"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../../types/General"

export default class TableUnionSQLBuilder extends EntityUnionMetadata {
    private _unionMetadata?: EntityUnionMetadata

    constructor(
        name: string,
        targets: EntityTarget[]
    ) {
        super(name, undefined, targets)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get unionMetadata(): EntityMetadata {
        return this._unionMetadata ?? this.registerEntityUnionMetadata()
    }

    // Privates ---------------------------------------------------------------
    private get restColumns(): EntityUnionColumnMetadata[] {
        return [...this.columns].filter(
            ({ name }) => !['primaryKey', 'entityType'].includes(name)
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(
            `WITH ${this.name} AS (${this.tablesSQL()})`
        )
    }

    // Privates ---------------------------------------------------------------
    private registerEntityUnionMetadata(): EntityUnionMetadata {
        this._unionMetadata = new EntityUnionMetadata(
            this.name,
            undefined,
            this.targets
        )

        return this._unionMetadata
    }

    // ------------------------------------------------------------------------

    private tablesSQL(): string {
        return this.entities.map(entity => this.targetTableSQL(entity))
            .join(' UNION ALL ')
    }

    // ------------------------------------------------------------------------

    private targetTableSQL(entity: EntityMetadata): string {
        return `
            SELECT ${this.propertiesSQL(entity)} FROM ${entity.tableName}
        `
    }

    // ------------------------------------------------------------------------

    private propertiesSQL(entity: EntityMetadata): string {
        return [
            this.primaryKeySQL(entity),
            this.targetTypeSQL(entity),
            ...this.restPropertiesSQL(entity)
        ]
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private primaryKeySQL(entity: EntityMetadata): string {
        return `${entity.columns.primary.name} AS primaryKey`
    }

    // ------------------------------------------------------------------------

    private targetTypeSQL(entity: EntityMetadata): string {
        return `"${entity.target.name}" AS entityType`
    }

    // ------------------------------------------------------------------------

    private restPropertiesSQL(entity: EntityMetadata): string[] {
        return this.restColumns.map(
            column => {
                const entityColumn = entity.columns.find(
                    ({ name }) => name === column.name
                )

                return !!entityColumn
                    ? `${entityColumn.name} AS ${column.name}`
                    : `NULL AS ${column.name}`
            }
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildUnion(name: string, targets: EntityTarget[]): (
        EntityUnionMetadata
    ) {
        return new EntityUnionMetadata(name, undefined, targets)
    }

    // ------------------------------------------------------------------------

    public static findUnion(targets: EntityTarget[]): (
        EntityUnionMetadata | undefined
    ) {
        return Reflect.getOwnMetadata('entity-union', targets)
    }

    // ------------------------------------------------------------------------

    public static findOrBuildUnion(targets: EntityTarget[], name?: string): (
        EntityUnionMetadata
    ) {
        return this.findUnion(targets) ?? this.buildUnion(
            name ?? this.buildUnionName(targets),
            targets
        )
    }

    // ------------------------------------------------------------------------

    private static buildUnionName(targets: EntityTarget[]): string {
        return targets.map(({ name }) => name.toLowerCase())
            .join('_')
    }
}