import {
    JoinColumnMetadata,
    type JoinTableMetadata
} from "../../../../Metadata"

export default class JoinColumnBuilder extends JoinColumnMetadata {
    constructor(table: JoinTableMetadata, metadata: JoinColumnMetadata) {
        super(table, metadata.references)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public createSQL() {
        const columnSQL = this.columnSQL()
        const foreignKeySQL = this.foreignKeySQL()

        return `${columnSQL}, ${foreignKeySQL}`
    }

    // ------------------------------------------------------------------------

    public addSQL() {
        return `ADD COLUMN ${this.columnSQL()}, ${this.addForeignKeySQL()}`
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

    // Privates ---------------------------------------------------------------
    private columnSQL(): string {
        return [
            this.nameSQL(),
            this.typeSQL(),
            this.unsignedSQL(),
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

    private foreignKeySQL() {
        return `
            CONSTRAINT ${this.references.name}
                FOREIGN KEY (${this.name}) ${this.foreignKeyReferences()}
        `
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
    public static from(table: JoinTableMetadata, column: JoinColumnMetadata) {
        return new JoinColumnBuilder(table, column)
    }
}