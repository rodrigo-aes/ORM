import { EntityMetadata } from "../../../../Metadata"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { ForeignKeyActionListener } from "../../../../Metadata"
import type { ForeignKeyReferencesSchemaMap } from "./types"

export default class ForeignKeyReferencesSchema {
    /** @internal */
    constructor(
        public tableName: string,
        public columnName: string,

        /** @internal */
        public map: ForeignKeyReferencesSchemaMap = {}
    ) { }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return `fk_${this.tableName}_${this.columnName}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Define `this` references table and column
     * @param table - referenced table name or table entity target
     * @param column - references table column name
     * @returns {this} - `this`
     */
    public references(table: EntityTarget | string, column: string): this {
        if (typeof table === 'object') table = this.getTargetTableName(table)

        this.map.tableName = table as string
        this.map.columnName = column
        this.map.constrained = true

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define `this` ON UPDATE action listener
     * @param {ForeignKeyActionListener} action - Action listenes
      * @returns {this} - `this`
     */
    public onUpdate(action: ForeignKeyActionListener): this {
        this.map.onUpdate = action
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define `this` ON DELETE action listener
     * @param {ForeignKeyActionListener} action - Action listenes
      * @returns {this} - `this`
     */
    public onDelete(action: ForeignKeyActionListener): this {
        this.map.onDelete = action
        return this
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private getTargetTableName(target: EntityTarget): string {
        const meta = EntityMetadata.find(target)
        if (!meta) throw new Error

        return meta.tableName
    }
}

export {
    type ForeignKeyReferencesSchemaMap
}