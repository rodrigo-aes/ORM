import type { DataType, ForeignKeyActionListener } from "../../../Metadata"

export type ForeignKeyReferencesSchema = {
    constrained?: boolean
    name?: string
    tableName: string | null
    columnName: string | null
    onDelete?: ForeignKeyActionListener | null
    onUpdate?: ForeignKeyActionListener | null
}

export type ColumnSchemaInitMap = {
    tableName: string
    name: string
    dataType: string | DataType
} & ColumnPropertiesMap

export type ColumnPropertiesMap = {
    columnType?: string
    nullable?: boolean
    primary?: boolean
    autoIncrement?: boolean
    defaultValue?: string | number | null
    unsigned?: boolean
    unique?: boolean
    isForeignKey?: boolean
    references?: ForeignKeyReferencesSchema
}   
