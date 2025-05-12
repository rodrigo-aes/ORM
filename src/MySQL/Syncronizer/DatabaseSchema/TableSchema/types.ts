import type ColumnSchema from "./ColumnSchema"
import type { ColumnBuilder, JoinColumnBuilder } from "../../TableBuilder"

export type TableColumn = ColumnBuilder | JoinColumnBuilder
export type AlterColumnAction = 'ADD' | 'MODIFY' | 'DROP' | 'NONE'
export type TableColumnAction = [
    AlterColumnAction,
    TableColumn | undefined,
    ColumnSchema | undefined
]