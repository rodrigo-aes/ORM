import { EntityMetadata, DataType } from "../../Metadata"
import ColumnSchema, {
    type ColumnSchemaInitMap,
    type ColumnPropertiesMap,
    type ForeignKeyReferencesSchema
} from "./ColumnSchema"

// Types
import type { EntityTarget, Constructor } from "../../../types/General"
import type { TableSchemaInitMap, TableSchemaAction } from "./types"

export default class TableSchema<
    T extends ColumnSchema = ColumnSchema
> extends Array<T> {
    public dependencies: string[]

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
        const column = new ColumnSchema({
            tableName: this.name,
            name,
            dataType
        }) as T

        this.push(column)
        return column
    }

    // ------------------------------------------------------------------------

    public findColumn(columnName: string) {
        return this.find(col => col.name === columnName)
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
    type TableSchemaAction,
    type ColumnSchemaInitMap,
    type ColumnPropertiesMap,
    type ForeignKeyReferencesSchema
}