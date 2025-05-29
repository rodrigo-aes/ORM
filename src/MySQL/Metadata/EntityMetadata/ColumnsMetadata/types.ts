import type { EntityTarget } from "../../../../types/General"
import type { ColumnMetadataJSON } from "./ColumnMetadata"

export type ColumnsMetadataJSON<
    T extends EntityTarget = any
> = ColumnMetadataJSON<T>[]