import type { EntityTarget } from "../../../../../types/General"
import type ColumnMetadata from ".."

export type ForeignKeyReferencedGetter = () => EntityTarget | EntityTarget[]

export type ForeignKeyActionListener = (
    'CASCADE' |
    'SET NULL' |
    'RESTRICT' |
    'NO ACTION'
)

export type ForeignKeyReferencesInitMap = {
    referenced: ForeignKeyReferencedGetter
    constrained?: boolean
    onDelete?: ForeignKeyActionListener
    onUpdate?: ForeignKeyActionListener
    scope?: any
}

export type RelatedColumnsMap = {
    [key: string]: ColumnMetadata
}