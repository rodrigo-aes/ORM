import type { DataType, ForeignKeyActionListener } from "../../../../Metadata"

export type ForeignKeyReferences = {
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
    nullable?: boolean
    primary?: boolean
    autoIncrement?: boolean
    defaultValue?: string | number | null
    unsigned?: boolean
    unique?: boolean
    isForeignKey?: boolean
    references?: ForeignKeyReferences
}

export type ColumnSchemaAction = 'ADD' | 'ALTER' | 'DROP' | 'NONE'