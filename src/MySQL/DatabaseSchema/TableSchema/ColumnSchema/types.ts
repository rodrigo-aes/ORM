import type { DataType } from "../../../Metadata"
import type ForeignKeyReferencesSchema from "./ForeignKeyReferencesSchema"
import type { ForeignKeyReferencesSchemaMap } from "./ForeignKeyReferencesSchema"


export type ColumnSchemaInitMap = {
    tableName: string
    name: string
    dataType: string | DataType
} & Omit<ColumnPropertiesMap, 'references'> & {
    references?: ForeignKeyReferencesSchemaMap
}

export type ColumnPropertiesMap = {
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
