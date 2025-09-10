import ColumnSchema from "../../../../DatabaseSchema/TableSchema/ColumnSchema"

// Metadata
import { DataType } from "../../../../Metadata"

// SQL Builders
import ForeignKeyConstraintSQLBuilder from "./ForeignKeyConstraintSQLBuilder"

// Symbols
import { CurrentTimestamp } from "./Symbols"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../../../Helpers"

// Types
import type { ActionType } from "../../../../DatabaseSchema"
import type { ColumnSQLBuilderMap } from "./types"

export default class ColumnSQLBuilder extends ColumnSchema {
    public override map!: ColumnSQLBuilderMap

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get foreignKeyConstraint(): (
        ForeignKeyConstraintSQLBuilder | undefined
    ) {
        return this.map.references
    }

    // Static Getters =========================================================
    // Protecteds =============================================================
    protected static get ForeignKeyConstructor(): (
        typeof ForeignKeyConstraintSQLBuilder
    ) {
        return ForeignKeyConstraintSQLBuilder
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public createSQL() {
        return SQLStringHelper.normalizeSQL(`
            ${this.columnSQL()}${this.createForeignKeySQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public createForeignKeySQL() {
        return this.foreignKeyConstraint?.map.constrained
            ? `, ${this.foreignKeyConstraint?.createSQL()}`
            : ''
    }

    // ------------------------------------------------------------------------

    public addSQL() {
        return SQLStringHelper.normalizeSQL(`
            ADD COLUMN ${this.columnSQL()}${this.addForeignKeySQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public addForeignKeySQL() {
        return this.foreignKeyConstraint?.map.constrained
            ? `, ${this.foreignKeyConstraint?.addSQL()}`
            : ''
    }

    // ------------------------------------------------------------------------

    public alterSQL() {
        return SQLStringHelper.normalizeSQL(`
            MODIFY COLUMN ${this.columnSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public dropAndAddSQL(): string {
        return `${this.dropSQL()}, ${this.addSQL()}${this.addForeignKeySQL()}`
    }

    // ------------------------------------------------------------------------

    public alterForeignKeySQL(): string {
        return this.foreignKeyConstraint?.alterSQL() ?? ''
    }

    // ------------------------------------------------------------------------

    public syncAlterSQL(schema?: ColumnSchema) {
        const beforeSQL = schema ? this.beforeModifySQL(schema) : ''
        const afterSQL = schema ? this.afterModifySQL(schema) : ''
        const fkSQL = schema ? this.syncForeignKeyActionSQL(schema) : ''

        return SQLStringHelper.normalizeSQL(`
            ${beforeSQL}
            ${this.alterSQL()}
            ${afterSQL}
            ${fkSQL ? `, ${fkSQL}` : ''}
        `)
    }

    // ------------------------------------------------------------------------

    public dropSQL(): string {
        return SQLStringHelper.normalizeSQL(
            `${this.shouldDropForeignKeySQL()} DROP COLUMN ${this.name};`
        )
    }

    // ------------------------------------------------------------------------

    public dropForeignKeySQL(): string {
        return this.foreignKeyConstraint?.dropSQL() ?? ''
    }

    // ------------------------------------------------------------------------

    public syncActionSQL(schema?: ColumnSchema): string | undefined {
        switch (this.compare(schema)[0]) {
            case 'CREATE': return this.addSQL()
            case 'ALTER': return this.syncAlterSQL()
            case "DROP/CREATE": return this.dropAndAddSQL()
            case 'DROP': return this.dropSQL()
        }
    }

    // ------------------------------------------------------------------------

    public syncForeignKeyActionSQL(schema: ColumnSchema): string {
        switch (this.foreignKeyAction(schema)) {
            case 'CREATE': return this.addForeignKeySQL()
            case 'ALTER': return this.alterForeignKeySQL()
            case 'DROP': return this.dropForeignKeySQL()

            default: return ''
        }
    }

    // ------------------------------------------------------------------------

    public migrateAlterSQL(action: Omit<ActionType, 'CREATE'>): string {
        switch (action) {
            case 'ALTER': return [
                this.alterSQL(),
                this.childMigrateAlterSQL()
            ]
                .join(', ')

            case 'DROP/CREATE': this.dropAndAddSQL()

            case 'DROP': return this.dropSQL()
        }

        throw new Error
    }

    // ------------------------------------------------------------------------

    public beforeModifySQL(schema: ColumnSchema): string {
        const { primary, unique } = schema.map

        const dropPrimarySQL = primary
            ? 'DROP PRIMARY KEY, '
            : ''

        const dropUniqueSQL = unique
            ? `DROP INDEX ${this.uniqueKeyName}, `
            : ''

        return `${dropPrimarySQL}${dropUniqueSQL}`
    }

    // ------------------------------------------------------------------------

    public afterModifySQL(schema: ColumnSchema): string {
        const { primary, unique } = schema.map

        const addPrimarySQL = primary
            ? `ADD PRIMARY KEY (${this.name})`
            : ''

        const addUniqueSQL = unique
            ? `ADD UNIQUE KEY ${this.uniqueKeyName} (${this.name})`
            : ''

        return `${addPrimarySQL}${addUniqueSQL}`
    }

    // Protecteds -------------------------------------------------------------
    protected childMigrateAlterSQL(): string {
        return this.actions.map(([action]) => {
            switch (action) {
                case "CREATE": return this.addForeignKeySQL()
                case "ALTER": return this.alterForeignKeySQL()
                case "DROP": return this.dropForeignKeySQL()
            }
        })
            .join(', ')
    }

    // Privates ---------------------------------------------------------------
    private shouldDropForeignKeySQL(): string {
        return this.map.isForeignKey
            ? `${this.dropForeignKeySQL()},`
            : ''
    }

    // ------------------------------------------------------------------------

    private columnSQL() {
        return [
            this.nameSQL(),
            this.typeSQL(),
            this.unsignedSQL(),
            this.nullSQL(),
            this.primarySQL(),
            this.autoIncrementSQL(),
            this.defaultSQL(),
            this.uniqueSQL(),
        ].join(' ')
    }

    // ------------------------------------------------------------------------

    private nameSQL() {
        return `\`${this.name}\``
    }

    // ------------------------------------------------------------------------

    private typeSQL() {
        if (!DataType.isDataType(this.dataType)) throw new Error
        return (this.dataType as DataType).buildSQL()
    }

    // ------------------------------------------------------------------------

    private unsignedSQL() {
        return this.map.unsigned ? 'UNSIGNED' : ''
    }

    // ------------------------------------------------------------------------

    private nullSQL() {
        return this.map.nullable ? 'NULL' : 'NOT NULL'
    }

    // ------------------------------------------------------------------------

    private uniqueSQL() {
        return this.map.unique
            ? `, UNIQUE KEY ${this.uniqueKeyName} (${this.name})`
            : ''
    }

    // ------------------------------------------------------------------------

    private primarySQL() {
        return this.map.primary ? 'PRIMARY KEY' : ''
    }

    // ------------------------------------------------------------------------

    private autoIncrementSQL() {
        return this.map.autoIncrement ? 'AUTO_INCREMENT' : ''
    }

    // ------------------------------------------------------------------------

    private defaultSQL() {
        switch (typeof this.map.defaultValue) {
            case "string":
            case "number":
            case "bigint":
            case "boolean":
            case "object": return (
                `DEFAULT ${PropertySQLHelper.valueSQL(this.map.defaultValue)}`
            )

            case "symbol": switch (this.map.defaultValue) {
                case CurrentTimestamp: return 'DEFAULT CURRENT_TIMESTAMP'
            }

            default: return ''
        }
    }
}

export {
    ForeignKeyConstraintSQLBuilder,
    CurrentTimestamp,

    type ColumnSQLBuilderMap
}