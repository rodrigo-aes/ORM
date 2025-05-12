import type { EntityTarget } from "../../../../../../types/General"

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