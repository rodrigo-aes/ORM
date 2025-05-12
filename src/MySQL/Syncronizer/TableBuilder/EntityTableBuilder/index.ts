import { EntityMetadata } from "../../../Metadata"
import ColumnsBuilder, { ColumnBuilder } from "./ColumnsBuilder"

// Utils
import Log from "../../../../utils/Log"

// Helpers
import { SQLStringHelper } from "../../../Helpers"

// Types
import type MySQLConnection from "../../../Connection"
import type { EntityTarget } from "../../../../types/General"
import type { TableColumnAction } from "../../DatabaseSchema"


export default class EntityTableBuilder extends EntityMetadata {
    protected readonly shouldRegister: boolean = false

    public columns!: ColumnsBuilder;

    constructor({ target, tableName, ...rest }: EntityMetadata) {
        super(target, { tableName })

        Object.assign(this, {
            ...rest,
            columns: this.columnsBuilder(),
        })
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async create(connection: MySQLConnection) {
        this.buildTableInitLog()
        await connection.query(this.createSQL())
        this.buildTableSuccessLog()
    }

    // ------------------------------------------------------------------------

    public async alter(
        connection: MySQLConnection,
        columns: TableColumnAction[]
    ) {
        await connection.query(this.alterSQL(columns))

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
    private columnsBuilder() {
        return new ColumnsBuilder(this.target, ...this.columns)
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

    // ------------------------------------------------------------------------

    private buildTableInitLog() {
        Log.composedLine(
            `Syncronizing table #[info]${this.tableName}`,
            'time'
        )
    }

    // ------------------------------------------------------------------------

    private buildTableSuccessLog() {
        Log.composedLine(
            `Table #[info]${this.tableName} #[default]syncronized #[success]SUCCESS`,
            'time'
        )
        Log.out('')
    }

    // ------------------------------------------------------------------------

    public static from(target: EntityTarget) {
        const metadata = this.find(target)
        if (!metadata) throw new Error

        return new EntityTableBuilder(metadata)
    }
}

export {
    ColumnBuilder
}