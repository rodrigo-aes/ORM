import type { DataType } from "../../../Metadata"
import type { ActionType } from "../../types"
import type ForeignKeyReferencesSchema from "./ForeignKeyReferencesSchema"
import type { ForeignKeyReferencesSchemaMap } from "./ForeignKeyReferencesSchema"
import type { ColumnPattern } from "../../../Metadata"

export interface ColumnSchemaMap {
    columnType?: string
    nullable?: boolean
    primary?: boolean
    autoIncrement?: boolean
    defaultValue?: any
    unsigned?: boolean
    unique?: boolean
    isForeignKey?: boolean
    references?: ForeignKeyReferencesSchema

    pattern?: ColumnPattern
}

export type ColumnSchemaInitMap = (
    {
        tableName: string
        name: string
        dataType: string | DataType
    } &
    Omit<ColumnSchemaMap, 'references'>
    & {
        references?: (
            ForeignKeyReferencesSchema |
            ForeignKeyReferencesSchemaMap
        )
    }
)


export type ColumnSchemaAction = [
    ActionType,
    ForeignKeyReferencesSchema
]
