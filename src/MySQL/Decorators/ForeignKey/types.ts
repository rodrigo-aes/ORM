import type { ForeignKeyActionListener } from "../../Metadata"

export type ForeignKeyConstraintOptions = {
    constrained?: boolean
    onDelete?: ForeignKeyActionListener,
    onUpdate?: ForeignKeyActionListener
}