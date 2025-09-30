import type {
    JoinForeignKeyReferencedGetter,
    ForeignKeyActionListener,
    JoinForeignKeyReferencesJSON
} from "./JoinForeignKeyReferences"

import type { SQLColumnType } from "../../../../ColumnsMetadata/ColumnMetadata"

export type JoinColumnInitMap = {
    referenced: JoinForeignKeyReferencedGetter,
    onDelete?: ForeignKeyActionListener,
    onUpdate?: ForeignKeyActionListener
}

export type JoinColumnMetadataJSON = {
    name: string
    dataType: SQLColumnType
    length?: number
    unsigned?: boolean
    isForeignKey: true
    references: JoinForeignKeyReferencesJSON
}