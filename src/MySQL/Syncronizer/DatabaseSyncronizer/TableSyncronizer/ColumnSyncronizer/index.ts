import {
    ColumnSchema,

    type ColumnPropertiesMap,
    type ForeignKeyReferencesSchema
} from "../../../../DatabaseSchema"

import { ColumnSQLBuilder } from "../../../../SQLBuilders"
import { DataType } from "../../../../Metadata"

// Types
import type { ColumnSyncAction } from "./types"

export default class ColumnSyncronizer extends ColumnSQLBuilder {
    protected _action?: ColumnSyncAction
    protected _fkAction?: ColumnSyncAction

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public compare(schema?: ColumnSchema): (
        [ColumnSyncAction, ColumnSyncAction]
    ) {
        if (!this._action) this._action = this.action(schema) as (
            ColumnSyncAction
        )

        if (!this._fkAction) this._fkAction = schema
            ? this.foreignKeyAction(schema)
            : 'NONE'

        return [this._action, this._fkAction]
    }

    // ------------------------------------------------------------------------

    public actionSQL(schema?: ColumnSchema): string | undefined {
        switch (this.compare(schema)[0]) {
            case 'ADD': return this.addSQL()
            case 'ALTER': return this.modifySQL()
            case 'DROP': return this.dropSQL()
        }
    }

    // ------------------------------------------------------------------------

    public foreignKeyActionSQL(schema: ColumnSchema): string {
        switch (this.foreignKeyAction(schema)) {
            case 'ADD': return this.addForeignKeySQL()
            case 'ALTER': return `
                ${this.dropForeignKeySQL()},
                ${this.addForeignKeySQL()}
            `
            case 'DROP': return this.dropForeignKeySQL()

            case 'NONE': return ''
        }
    }

    // Protecteds -------------------------------------------------------------
    protected action(schema?: ColumnSchema): Omit<ColumnSyncAction, 'DROP'> {
        switch (true) {
            case !schema: return 'ADD';
            case this.shouldAlter(schema!): return 'ALTER'

            default: return 'NONE'
        }
    }

    // ------------------------------------------------------------------------

    protected foreignKeyAction(schema: ColumnSchema): (
        ColumnSyncAction
    ) {
        switch (true) {
            case (
                !schema.map.isForeignKey &&
                this.map.isForeignKey
            ): return 'ADD'

            case (
                schema.map.isForeignKey &&
                !this.map.isForeignKey
            ): return 'DROP'

            case (
                !!schema.map.references &&
                !!this.map.references &&
                this.shouldAlterForeignKey(schema.map.references)
            ): return 'ALTER'

            default: return 'NONE'
        }
    }

    // ------------------------------------------------------------------------

    protected shouldAlter(schema: ColumnSchema): boolean {
        const { references, ...map } = this.map

        for (const [key, value] of Object.entries(map) as (
            [keyof ColumnPropertiesMap, any][]
        ))
            if (!this.compareValues(value, schema.map[key])) return true

        if (!this.compareDataTypes(
            this.dataType, schema.map.columnType!
        ))
            return true

        return false
    }

    // ------------------------------------------------------------------------

    protected shouldAlterForeignKey(references: ForeignKeyReferencesSchema): (
        boolean
    ) {
        for (const [key, value] of Object.entries(this.map.references!) as (
            [keyof ForeignKeyReferencesSchema, string | null][]
        ))
            if (!this.compareValues(value, references[key])) return true

        return false
    }

    // ------------------------------------------------------------------------

    protected compareDataTypes(
        previous: DataType | string,
        current: DataType | string
    ): boolean {
        switch (typeof previous) {
            case "string": switch (typeof current) {
                case "string": return previous === current
                case "object": return this.compareStrAndObjDataTypes(
                    previous,
                    current
                )
            }
            case "object": switch (typeof current) {
                case "string": return this.compareStrAndObjDataTypes(
                    current,
                    previous
                )
                case "object": return (
                    previous.buildSQL() === current.buildSQL()
                )
            }
        }
    }

    // ------------------------------------------------------------------------

    protected compareStrAndObjDataTypes(
        string: string,
        object: DataType
    ): boolean {
        return object
            .buildSQL()
            .replace(
                object.type.toUpperCase(),
                object.type
            )
            === string
                .replace('unsigned', '')
                .trim()
    }

    // ------------------------------------------------------------------------

    protected compareValues(value: any, compare: any): boolean {
        switch (typeof value) {
            case "string":
            case "number":
            case "bigint": return value === compare
            case "boolean": return value === !!compare
            case "undefined": return !!compare
            case "function": return value() === compare

            default: return true
        }
    }
}