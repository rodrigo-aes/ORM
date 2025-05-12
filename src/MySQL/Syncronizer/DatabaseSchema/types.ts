import type { TableColumnAction } from "./TableSchema/types"
import type TableSchema from "./TableSchema"
import type { EntityTableBuilder, JoinTableBuilder } from "../TableBuilder"
import type ColumnSchema from "./TableSchema/ColumnSchema"


export type DatabaseSchemaMap = {
    tableName: string
    columns: ColumnSchema[]
}[]

export type SyncTableAction = 'CREATE' | 'ALTER' | 'DROP' | 'NONE'
export type SyncTableData = EntityTableBuilder | JoinTableBuilder | TableSchema
export type AlterTable = [
    SyncTableAction,
    SyncTableData,
    TableColumnAction[] | undefined
]