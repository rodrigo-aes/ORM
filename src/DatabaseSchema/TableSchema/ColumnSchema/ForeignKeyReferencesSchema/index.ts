import { EntityMetadata } from "../../../../Metadata"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { ForeignKeyActionListener } from "../../../../Metadata"
import type { ForeignKeyReferencesSchemaMap } from "./types"

export default class ForeignKeyReferencesSchema {
    public map: ForeignKeyReferencesSchemaMap = {}

    constructor(
        public tableName: string,
        public columnName: string,
        initMap?: ForeignKeyReferencesSchemaMap
    ) {
        if (initMap) Object.assign(this.map, initMap)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return `fk_${this.tableName}_${this.columnName}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public references(table: EntityTarget | string, column: string): this {
        if (typeof table === 'object') table = this.getTargetTableName(table)

        this.map.tableName = table as string
        this.map.columnName = column
        this.map.constrained = true

        return this
    }

    // ------------------------------------------------------------------------

    public onUpdate(action: ForeignKeyActionListener): this {
        this.map.onUpdate = action
        return this
    }

    // ------------------------------------------------------------------------

    public onDelete(action: ForeignKeyActionListener): this {
        this.map.onDelete = action
        return this
    }

    // Privates ---------------------------------------------------------------
    private getTargetTableName(target: EntityTarget): string {
        const meta = EntityMetadata.find(target)
        if (!meta) throw new Error

        return meta.tableName
    }
}

export {
    type ForeignKeyReferencesSchemaMap
}