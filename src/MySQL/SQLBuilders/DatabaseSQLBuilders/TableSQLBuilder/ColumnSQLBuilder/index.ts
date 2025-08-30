import ColumnSchema from "../../../../DatabaseSchema/TableSchema/ColumnSchema"
import { DataType } from "../../../../Metadata"

// Helpers
import { SQLStringHelper } from "../../../../Helpers"

export default abstract class ColumnSQLBuilder extends ColumnSchema {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public createSQL() {
        const foreignKeySQL = this.foreignKeySQL()

        return SQLStringHelper.normalizeSQL(`
            ${this.columnSQL()}
            ${foreignKeySQL ? `, ${foreignKeySQL}` : ''}
        `)
    }

    // ------------------------------------------------------------------------

    public addSQL() {
        const foreignKeySQL = this.addForeignKeySQL()

        return SQLStringHelper.normalizeSQL(`
            ADD COLUMN ${this.columnSQL()}
            ${foreignKeySQL ? `, ${foreignKeySQL}` : ''}
        `)
    }

    // ------------------------------------------------------------------------

    public addForeignKeySQL() {
        const foreignKeySQL = this.foreignKeySQL()
        return foreignKeySQL
            ? `ADD ${foreignKeySQL}`
            : ''
    }

    // ------------------------------------------------------------------------

    public modifySQL(schema?: ColumnSchema) {
        const fkSQL = schema ? this.foreignKeyActionSQL(schema) : ''

        return SQLStringHelper.normalizeSQL(`
            MODIFY COLUMN ${this.columnSQL()}
            ${fkSQL ? `, ${fkSQL}` : ''}
        `)
    }

    // ------------------------------------------------------------------------

    public abstract actionSQL(schema?: ColumnSchema): string | undefined

    // ------------------------------------------------------------------------

    public abstract foreignKeyActionSQL(schema: ColumnSchema): (
        string | undefined
    )

    // ------------------------------------------------------------------------

    public dropSQL(): string {
        return SQLStringHelper.normalizeSQL(
            `${this.shouldDropForeignKeySQL()} DROP COLUMN ${this.name}`
        )
    }

    // ------------------------------------------------------------------------

    public dropForeignKeySQL(): string {
        return this.map.references
            ? `DROP FOREIGN KEY ${this.map.references.map.name}`
            : ''
    }

    // Privates ---------------------------------------------------------------
    private shouldDropForeignKeySQL(): string {
        return this.map.isForeignKey
            ? this.dropForeignKeySQL()
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
            ? `DEFAULT ${this.formatDefaultValue(this.map.defaultValue)}`
            : ''
    }

    // ------------------------------------------------------------------------

    private formatDefaultValue(def: any) {
        switch (typeof def) {
            case "string":
            case "number":
            case "bigint":
            case "boolean":
            case "object": return JSON.stringify(def)
            case "function": return def()

            default: throw new Error
        }
    }

    // ------------------------------------------------------------------------

    private foreignKeySQL() {
        return (this.map.isForeignKey && this.map.references?.map.constrained)
            ? `
                CONSTRAINT ${this.foreignKeyName}
                    FOREIGN KEY (${this.name}) ${this.foreignKeyReferences()}`
            : ''
    }

    // ------------------------------------------------------------------------

    private foreignKeyReferences() {
        const {
            tableName,
            columnName,
            onDelete,
            onUpdate
        } = this.map.references!.map

        const onDelSQL = onDelete ? ` ON DELETE ${onDelete}` : ''
        const onUpdSQL = onUpdate ? ` ON UPDATE ${onUpdate}` : ''

        return (
            `REFERENCES ${tableName}(${columnName})${onDelSQL}${onUpdSQL}`
        )
    }
}