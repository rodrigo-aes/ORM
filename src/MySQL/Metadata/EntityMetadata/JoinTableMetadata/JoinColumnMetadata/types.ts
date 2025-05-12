import type {
    JoinForeignKeyReferencedGetter,
    ForeignKeyActionListener
} from "./JoinForeignKeyReferences"

export type JoinColumnInitMap = {
    referenced: JoinForeignKeyReferencedGetter,
    onDelete?: ForeignKeyActionListener,
    onUpdate?: ForeignKeyActionListener
}