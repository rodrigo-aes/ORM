import type {
    ColumnMetadataJSON,
    DataTypeMetadataJSON
} from "../../../EntityMetadata"

export interface PolymorphicColumnMetadataJSON extends Omit<
    ColumnMetadataJSON, 'dataType'
> {
    dataTypes: DataTypeMetadataJSON[]
}