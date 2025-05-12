import { JoinTableMetadata } from "../../../Metadata"
import JoinColumnsBuilder from "./JoinColumnsBuilder"
import JoinColumnBuilder from "./JoinColumnBuilder"

// Helpers
import { SQLStringHelper } from "../../../Helpers"

// Types
import type MySQLConnection from "../../../Connection"
import type { TableColumnAction } from "../../DatabaseSchema/TableSchema/types"

export default class JoinTableBuilder extends JoinTableMetadata {
    public columns!: JoinColumnsBuilder

    constructor({ relateds, tableName }: JoinTableMetadata) {
        super(relateds, tableName)

        this.columns = this.joinColumnsBuilder()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public create(connection: MySQLConnection) {
        return connection.query(this.createSQL())
    }

    // ------------------------------------------------------------------------

    public async alter(
        connection: MySQLConnection,
        columns: TableColumnAction[]
    ) {
        if (this.shouldAlterColumns(columns)) await connection.query(
            this.alterSQL(columns)
        )

        for (const foreignKeySQL of this.alterForeignKeysSQL(columns)) {
            console.log(foreignKeySQL)
            await connection.query(foreignKeySQL)
        }
    }

    // ------------------------------------------------------------------------

    public createSQL() {
        const sql = SQLStringHelper.normalizeSQL(`
            CREATE TABLE ${this.tableName} (${this.columns.createSQL()})
        `)

        console.log(sql)
        return sql
    }

    // ------------------------------------------------------------------------

    public alterSQL(columns: TableColumnAction[]) {
        const sql = SQLStringHelper.normalizeSQL(`  
            ALTER TABLE ${this.tableName} ${this.columns.alterSQL(columns)}
        `)

        console.log(sql)
        return sql
    }

    // ------------------------------------------------------------------------

    public alterForeignKeysSQL(columns: TableColumnAction[]): string[] {
        return this.foreignKeyColumnsActions(columns)
            .flatMap(([_, column, schema]) => {
                switch (schema!.alterForeignKeyAction(column!) as (
                    'MODIFY' | 'DROP'
                )) {
                    case "MODIFY": return [
                        SQLStringHelper.normalizeSQL(`
                            ALTER TABLE ${this.tableName}
                                ${column!.dropForeignKeySQL()}
                        `),
                        SQLStringHelper.normalizeSQL(`
                            ALTER TABLE ${this.tableName}
                                ${column!.addForeignKeySQL()}
                        `)
                    ]

                    // --------------------------------------------------------

                    case "DROP": return SQLStringHelper.normalizeSQL(`
                        ALTER TABLE ${this.tableName} 
                            ${column!.dropForeignKeySQL()}
                    `)
                }
            })
    }

    // Protecteds -------------------------------------------------------------
    protected override register() { }

    // Privates ---------------------------------------------------------------
    private joinColumnsBuilder(): JoinColumnsBuilder {
        return new JoinColumnsBuilder(this, ...this.columns)
    }

    // ------------------------------------------------------------------------

    private shouldAlterColumns(columns: TableColumnAction[]) {
        return columns
            .filter(([action, column, schema]) => (
                action !== 'NONE' &&
                (column && schema?.shouldAlterColumn(column))
            ))
            .length > 0
    }

    // ------------------------------------------------------------------------

    private foreignKeyColumnsActions(columns: TableColumnAction[]) {
        return columns.filter(([_, column, schema]) => (
            (column && schema) && (
                schema.shouldAlterForeignKey(column) ||
                schema?.shouldDropForeignKey(column)
            )
        ))
    }
}

export {
    JoinColumnsBuilder,
    JoinColumnBuilder
}