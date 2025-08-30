import type ColumnSchema from "./ColumnSchema"
import type { ColumnSchemaInitMap } from "./ColumnSchema"

export type TableSchemaInitMap = {
    tableName: string
    columns: (ColumnSchema | ColumnSchemaInitMap)[]
}

export type TableSchemaAction = 'CREATE' | 'ALTER' | 'DROP' | 'NONE'