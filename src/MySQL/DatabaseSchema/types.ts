import type TableSchema from "./TableSchema"

export type ActionType = 'CREATE' | 'ALTER' | 'DROP'
export type DatabaseSchemaAction = [ActionType, TableSchema]