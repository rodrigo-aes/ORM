import type { DataType } from "../../../Metadata"
import type { ActionType } from "../../types"
import type ForeignKeyReferencesSchema from "./ForeignKeyReferencesSchema"
import type { ForeignKeyReferencesSchemaMap } from "./ForeignKeyReferencesSchema"

export interface ColumnSchemaMap {
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

export type ColumnSchemaAction = [ActionType, ForeignKeyReferencesSchema]
