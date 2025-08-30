import ColumnSchema from "../../../../DatabaseSchema/TableSchema/ColumnSchema"

// Metadata
import { DataType } from "../../../../Metadata"

// SQL Builders
import ForeignKeyConstraintSQLBuilder from "./ForeignKeyConstraintSQLBuilder"

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
        return (
            this.map.isForeignKey &&
            this.foreignKeyConstraint?.map.constrained
        )
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
        return (
            this.map.isForeignKey &&
            this.foreignKeyConstraint?.map.constrained
        )
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

    public alterForeignKeySQL(): string {
        return this.foreignKeyConstraint?.alterSQL() ?? ''
    }

    // ------------------------------------------------------------------------

    public syncAlterSQL(schema?: ColumnSchema) {
        const fkSQL = schema ? this.syncForeignKeyActionSQL(schema) : ''

        return SQLStringHelper.normalizeSQL(`
            ${this.alterSQL()}${fkSQL ? `, ${fkSQL}` : ''}
        `)
    }

    // ------------------------------------------------------------------------

    public dropSQL(): string {
        return SQLStringHelper.normalizeSQL(
            `${this.shouldDropForeignKeySQL()} DROP COLUMN ${this.name}`
        )
    }

    // ------------------------------------------------------------------------

    public dropForeignKeySQL(): string {
        return this.foreignKeyConstraint?.dropSQL() ?? ''
    }

    // ------------------------------------------------------------------------

    public syncActionSQL(schema?: ColumnSchema): string | undefined {
        throw new Error
    }

    // ------------------------------------------------------------------------

    public syncForeignKeyActionSQL(schema: ColumnSchema): string | undefined {
        throw new Error
    }

    // ------------------------------------------------------------------------

    public migrateAlterSQL(action: Omit<ActionType, 'CREATE'>): string {
        switch (action) {
            case 'ALTER': return [
                this.alterSQL(),
                this.childMigrateAlterSQL()
            ]
                .join(', ')

            case 'DROP': return this.dropSQL()
        }

        throw new Error
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
            this.uniqueSQL(),
            this.primarySQL(),
            this.autoIncrementSQL(),
            this.defaultSQL()
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
        return this.map.unique ? 'UNIQUE' : ''
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
        return this.map.defaultValue
            ? `DEFAULT ${PropertySQLHelper.valueSQL(this.map.defaultValue)}`
            : ''
    }
}

export {
    ForeignKeyConstraintSQLBuilder
}