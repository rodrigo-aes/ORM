import {
    EntityMetadata,
    DataType,

    type TextLength,
    type IntegerLength,
    type JSONColumnConfig,
    type BitLength,
    type BlobLength,
    type ComputedType
} from "../../Metadata"

import ColumnSchema, {
    ForeignKeyReferencesSchema,

    type ColumnSchemaInitMap,
    type ColumnSchemaMap,
} from "./ColumnSchema"

// Types
import type { EntityTarget, Constructor } from "../../../types/General"
import type { TableSchemaInitMap, TableSchemaAction } from "./types"

export default class TableSchema<
    T extends ColumnSchema = ColumnSchema
> extends Array<T> {
    public dependencies: string[]
    public actions: TableSchemaAction[] = []

    constructor(
        public name: string,
        ...columns: (T | Omit<ColumnSchemaInitMap, 'tableName'>)[]
    ) {
        super(...columns.map(col => col instanceof ColumnSchema
            ? col
            : new ColumnSchema({
                ...col,
                tableName: name
            }) as T
        ))

        this.dependencies = this.flatMap(({ dependence }) => dependence ?? [])
    }

    protected static get ColumnConstructor(): typeof ColumnSchema {
        return ColumnSchema
    }

    static get [Symbol.species]() {
        return Array
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public column(name: string, dataType: DataType): T {
        return this.buildColumn(name, dataType)
    }

    // ------------------------------------------------------------------------

    public string(name: string, length?: number): T {
        return this.buildColumn(name, DataType.VARCHAR(length))
    }

    // ------------------------------------------------------------------------

    public text(name: string, length?: TextLength): T {
        return this.buildColumn(name, DataType.TEXT(length))
    }

    // ------------------------------------------------------------------------

    public int(name: string, length?: IntegerLength): T {
        return this.buildColumn(name, DataType.INT(length))
    }

    // ------------------------------------------------------------------------

    public bigInt(name: string): T {
        return this.buildColumn(name, DataType.INT('BIG'))
    }

    // ------------------------------------------------------------------------

    public tinyInt(name: string): T {
        return this.buildColumn(name, DataType.INT('TINY'))
    }

    // ------------------------------------------------------------------------

    public float(name: string, M: number, D: number): T {
        return this.buildColumn(name, DataType.FLOAT(M, D))
    }

    // ------------------------------------------------------------------------

    public decimal(name: string, M: number, D: number): T {
        return this.buildColumn(name, DataType.DECIMAL(M, D))
    }

    // ------------------------------------------------------------------------

    public double(name: string, M: number, D: number): T {
        return this.buildColumn(name, DataType.DOUBLE(M, D))
    }

    // ------------------------------------------------------------------------

    public boolean(name: string): T {
        return this.buildColumn(name, DataType.BOOLEAN())
    }

    // ------------------------------------------------------------------------

    public enum(name: string, options: string[]): T {
        return this.buildColumn(name, DataType.ENUM(...options))
    }

    // ------------------------------------------------------------------------

    public set(name: string, options: string[]): T {
        return this.buildColumn(name, DataType.SET(...options))
    }

    // ------------------------------------------------------------------------

    public timestamp(name: string): T {
        return this.buildColumn(name, DataType.TIMESTAMP())
    }

    // ------------------------------------------------------------------------

    public datetime(name: string): T {
        return this.buildColumn(name, DataType.DATETIME())
    }

    // ------------------------------------------------------------------------

    public date(name: string): T {
        return this.buildColumn(name, DataType.DATE())
    }

    // ------------------------------------------------------------------------

    public time(name: string): T {
        return this.buildColumn(name, DataType.TIME())
    }

    // ------------------------------------------------------------------------

    public year(name: string): T {
        return this.buildColumn(name, DataType.YEAR())
    }

    // ------------------------------------------------------------------------

    public json(name: string): T {
        return this.buildColumn(name, DataType.JSON())
    }

    // ------------------------------------------------------------------------

    public jsonRef(
        name: string,
        dataType: DataType,
        config: JSONColumnConfig
    ): T {
        return this.buildColumn(name, DataType.JSONReference(dataType, config))
    }

    // ------------------------------------------------------------------------

    public bit(name: string, length?: BitLength): T {
        return this.buildColumn(name, DataType.BIT(length))
    }

    // ------------------------------------------------------------------------

    public binary(name: string, length: number): T {
        return this.buildColumn(name, DataType.BINARY(length))
    }

    // ------------------------------------------------------------------------

    public varbinary(name: string, length: number): T {
        return this.buildColumn(name, DataType.VARBINARY(length))
    }

    // ------------------------------------------------------------------------

    public blob(name: string, length?: BlobLength): T {
        return this.buildColumn(name, DataType.BLOB(length))
    }

    // ------------------------------------------------------------------------

    public computed(
        name: string,
        dataType: DataType,
        as: string,
        type: ComputedType
    ): T {
        return this.buildColumn(name, DataType.COMPUTED(dataType, as, type))
    }

    // ------------------------------------------------------------------------

    public alterColumn(name: string): T {
        const col = this.findOrThrow(name)
        this.actions.push(['ALTER', col])

        return col
    }

    // ------------------------------------------------------------------------

    public dropColumn(name: string): void {
        const col = this.findOrThrow(name)
        this.actions.push(['DROP', col])
    }

    // ------------------------------------------------------------------------

    public addConstraint(column: string): ForeignKeyReferencesSchema {
        const col = this.findOrThrow(column)
        if (col.map.references) throw new Error

        if (this.colAlreadyInActions(column)) return col.constained()

        col.map.references = new ForeignKeyReferencesSchema(
            this.name,
            col.name
        )
        this.actions.push(['CREATE', col.map.references])

        return col.map.references
    }

    // ------------------------------------------------------------------------

    public alterConstraint(column: string): ForeignKeyReferencesSchema {
        const col = this.findOrThrow(column)
        if (!col.map.references) throw new Error

        if (this.colAlreadyInActions(column)) return col.alterConstraint()

        this.actions.push(['ALTER', col.map.references])

        return col.map.references
    }

    // ------------------------------------------------------------------------

    public dropConstraint(column: string): void {
        const col = this.findOrThrow(column)
        if (!col.map.references) throw new Error

        if (this.colAlreadyInActions(column)) return col.dropConstraint()

        this.actions.push(['DROP', col.map.references])
    }

    // ------------------------------------------------------------------------

    public findColumn(columnName: string) {
        return this.find(col => col.name === columnName)
    }

    // Protecteds -------------------------------------------------------------
    protected buildColumn(name: string, dataType: DataType): T {
        const col = new ColumnSchema({
            tableName: this.name,
            name,
            dataType
        }) as T

        this.push(col)
        this.actions.push(['CREATE', col])

        return col
    }

    // Privates ---------------------------------------------------------------
    private findOrThrow(name: string): T {
        const col = this.findColumn(name)
        if (!col) throw new Error

        return col
    }

    // ------------------------------------------------------------------------

    private colAlreadyInActions(column: string): boolean {
        return !!this.actions.find(([_, { name }]) => name === column)
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromMetadata<T extends Constructor<TableSchema>>(
        this: T,
        source: EntityMetadata | EntityTarget
    ): InstanceType<T> {
        const { tableName, columns } = (this as T & typeof TableSchema)
            .metadataFromSource(source)

        return new this(
            tableName,
            ...columns.map(
                column => (this as T & typeof TableSchema)
                    .ColumnConstructor
                    .buildFromMetadata(column)
            )
        ) as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    public static buildJoinTablesFromMetadata(
        source: EntityMetadata | EntityTarget
    ): TableSchema[] {
        return this.metadataFromSource(source).joinTables?.map(
            ({ tableName, columns }) => new this(
                tableName,
                ...columns.map(
                    column => this.ColumnConstructor.buildFromMetadata(column)
                )
            )
        )
            ?? []
    }

    // Privates ---------------------------------------------------------------
    private static metadataFromSource(source: EntityMetadata | EntityTarget) {
        const metadata = source instanceof EntityMetadata
            ? source
            : EntityMetadata.find(source)

        if (!metadata) throw new Error

        return metadata
    }
}

export {
    ColumnSchema,

    type TableSchemaInitMap,
    type ColumnSchemaInitMap,
    type ColumnSchemaMap,
    type ForeignKeyReferencesSchema
}