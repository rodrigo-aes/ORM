import type {
    ColumnMetadataJSON,
    DataTypeMetadataJSON
} from "../../../EntityMetadata"

export type PolymorphicColumnMetadataJSON = Omit<ColumnMetadataJSON, (
    'dataType' |
    'nullable' |
    'defaultValue' |
    'unique' |
    'autoIncrement' |
    'unsigned'
)> 