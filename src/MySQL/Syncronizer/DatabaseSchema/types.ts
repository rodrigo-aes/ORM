import type { ColumnSchema, ColumnSchemaInitMap } from "./TableSchema"

export type TableSchemaInitMap = {
    tableName: string
    columns: (ColumnSchema | ColumnSchemaInitMap)[]
}

export type TableSchemaAction = 'CREATE' | 'ALTER' | 'DROP' | 'NONE'