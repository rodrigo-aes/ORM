import EntityMetadata from "../../.."

import type JoinTableMetadata from "../.."
import type JoinColumnMetadata from ".."
import type { ColumnMetadata } from "../../../ColumnsMetadata"

import type {
    JoinForeignKeyReferencedGetter,
    ForeignKeyActionListener,
    ForeignKeyReferencesInitMap
} from "./types"

export default class JoinForeignKeyReferences {
    public readonly constrained = true
    public onDelete?: ForeignKeyActionListener
    public onUpdate?: ForeignKeyActionListener

    referenced!: JoinForeignKeyReferencedGetter

    constructor(
        private table: JoinTableMetadata,
        private _column: JoinColumnMetadata,
        initMap: ForeignKeyReferencesInitMap
    ) {
        Object.assign(this, initMap)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entity(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.referenced())
    }

    // ------------------------------------------------------------------------

    public get column(): ColumnMetadata {
        return this.entity.columns.primary
    }

    // ------------------------------------------------------------------------

    public get name(): string | undefined {
        return `fk_${this.table.tableName}_${this._column.name}`
    }
}

export type {
    JoinForeignKeyReferencedGetter,
    ForeignKeyActionListener,
    ForeignKeyReferencesInitMap
}