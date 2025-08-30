import type { ActionType } from "../types"
import type ColumnSchema from "./ColumnSchema"
import type {
    ColumnSchemaInitMap,
    ForeignKeyReferencesSchema
} from "./ColumnSchema"
export type TableSchemaInitMap = {
    tableName: string
    columns: (ColumnSchema | ColumnSchemaInitMap)[]
}


export type TableSchemaAction = [ActionType, (
    ColumnSchema |
    ForeignKeyReferencesSchema
)]