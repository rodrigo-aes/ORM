import type { EntityTarget } from "../../../types"
import type { ColumnMetadataJSON } from "./ColumnMetadata"

export type ColumnsMetadataJSON<
    T extends EntityTarget = any
> = ColumnMetadataJSON[]