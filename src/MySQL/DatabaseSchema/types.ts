import type TableSchema from "./TableSchema"
import type TriggersSchema from "./TriggersSchema"

export type ActionType = 'CREATE' | 'ALTER' | 'DROP' | 'NONE'
export type DatabaseSchemaAction = [ActionType, TableSchema]

export type TableSchemaHandler = (table: TableSchema) => void