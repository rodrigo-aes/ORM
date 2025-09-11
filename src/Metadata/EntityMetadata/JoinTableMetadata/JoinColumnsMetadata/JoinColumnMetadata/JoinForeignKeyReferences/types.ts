import type { EntityTarget } from "../../../../../../types/General"
import type { EntityMetadataJSON } from "../../../../types"
import type { ColumnMetadataJSON } from "../../../../ColumnsMetadata/ColumnMetadata"

export type JoinForeignKeyReferencedGetter = () => EntityTarget

export type ForeignKeyActionListener = (
    'CASCADE' |
    'SET NULL' |
    'RESTRICT' |
    'NO ACTION'
)

export type ForeignKeyReferencesInitMap = {
    referenced: JoinForeignKeyReferencedGetter
    constrained?: boolean
    onDelete?: ForeignKeyActionListener
    onUpdate?: ForeignKeyActionListener
    scope?: any
}

export type JoinForeignKeyReferencesJSON = {
    entity: EntityMetadataJSON
    column: ColumnMetadataJSON
    name: string
    constrained: true
    onDelete?: ForeignKeyActionListener
    onUpdate?: ForeignKeyActionListener
}