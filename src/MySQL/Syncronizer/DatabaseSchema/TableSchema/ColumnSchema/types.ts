export type ColumnSchemaInitMap = {
    tableName: string
    columnName: string
    dataType: string
    columnType: string
    length: number | null
    isNullable: boolean
    isPrimary: boolean
    isAutoIncrement: boolean
    hasDefaultValue: boolean
    defaultValue: string | number | null
    isUnsigned: boolean
    isUnique: boolean
    isForeignKey: boolean
    foreignTable: string | null
    foreignColumn: string | null
    foreignKeyName: string | null
    onDelete: string | null
    onUpdate: string | null
}
