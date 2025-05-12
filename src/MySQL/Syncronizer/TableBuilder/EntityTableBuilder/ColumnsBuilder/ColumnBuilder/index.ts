import { ColumnMetadata } from "../../../../../Metadata"

export default class ColumnBuilder extends ColumnMetadata {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public createSQL() {
        const columnSQL = this.columnSQL()
        const foreignKeySQL = this.foreignKeySQL()

        return `${columnSQL}${foreignKeySQL ? `, ${foreignKeySQL}` : ''}`
    }

    // ------------------------------------------------------------------------

    public addSQL() {
        const columnSQL = `ADD COLUMN ${this.columnSQL()}`

        let foreignKeySQL = this.foreignKeySQL()
        if (foreignKeySQL) foreignKeySQL = `, ADD ${foreignKeySQL}`

        return `${columnSQL}${foreignKeySQL}`
    }

    // ------------------------------------------------------------------------

    public modifySQL() {
        return `MODIFY COLUMN ${this.columnSQL()}`
    }

    // ------------------------------------------------------------------------

    public addForeignKeySQL() {
        return `ADD ${this.foreignKeySQL()}`
    }

    // ------------------------------------------------------------------------

    public dropForeignKeySQL() {
        return `DROP FOREIGN KEY ${this.references!.name}`
    }

    // ------------------------------------------------------------------------

    public getDefaultValue(): any {
        return this.defaultValue
            ? this.formatDefaultValue(this.defaultValue)
            : undefined
    }

    // Privates ---------------------------------------------------------------
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
        return this.dataType.buildSQL()
    }

    // ------------------------------------------------------------------------

    private unsignedSQL() {
        return this.unsigned ? 'UNSIGNED' : ''
    }

    // ------------------------------------------------------------------------

    private nullSQL() {
        return this.nullable ? 'NULL' : 'NOT NULL'
    }

    // ------------------------------------------------------------------------

    private uniqueSQL() {
        return this.unique ? 'UNIQUE' : ''
    }

    // ------------------------------------------------------------------------

    private primarySQL() {
        return this.primary ? 'PRIMARY KEY' : ''
    }

    // ------------------------------------------------------------------------

    private autoIncrementSQL() {
        return this.autoIncrement ? 'AUTO_INCREMENT' : ''
    }

    // ------------------------------------------------------------------------

    private defaultSQL() {
        return this.defaultValue
            ? `DEFAULT ${this.formatDefaultValue(this.defaultValue)}`
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
        return (this.isForeignKey && this.references?.constrained)
            ? `
                CONSTRAINT ${this.references.name}
                    FOREIGN KEY (${this.name}) ${this.foreignKeyReferences()}`
            : ''
    }

    // ------------------------------------------------------------------------

    private foreignKeyReferences() {
        const {
            entity: { tableName },
            column: { name: columnName },
            onDelete,
            onUpdate
        } = this.references!

        const onDelSQL = onDelete ? ` ON DELETE ${onDelete}` : ''
        const onUpdSQL = onUpdate ? ` ON UPDATE ${onUpdate}` : ''

        return (
            `REFERENCES ${tableName}(${columnName})${onDelSQL}${onUpdSQL}`
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static from(column: ColumnMetadata) {
        const instance = new ColumnBuilder(
            column.target,
            column.name,
            column.dataType
        )
        Object.assign(instance, column)

        return instance
    }
}