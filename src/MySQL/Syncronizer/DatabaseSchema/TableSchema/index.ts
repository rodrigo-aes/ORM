import ColumnSchema, { type ColumnSchemaInitMap } from "./ColumnSchema"
import {
    EntityTableBuilder,
    JoinTableBuilder,

    type ColumnBuilder,
    type JoinColumnBuilder
} from "../../TableBuilder"

// Types
import type MySQLConnection from "../../../Connection"
import type { SyncronizerTable } from "../../types"
import type { TableColumnAction, AlterColumnAction } from "./types"

export default class TableSchema extends Array<ColumnSchema> {
    constructor(
        public name: string,
        ...columns: (ColumnSchema | ColumnSchemaInitMap)[]
    ) {
        super(...columns.map(col => col instanceof ColumnSchema
            ? col
            : new ColumnSchema(col)
        ))
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public findColumnSchema(columnName: string) {
        return this.find(col => col.columnName === columnName)
    }

    // ------------------------------------------------------------------------

    public drop(connection: MySQLConnection) {
        return connection.query(this.dropSQL())
    }

    // ------------------------------------------------------------------------

    public dropSQL() {
        const sql = `DROP TABLE ${this.name}`

        console.log(sql)
        return sql
    }

    // ------------------------------------------------------------------------

    public compare(table: SyncronizerTable): TableColumnAction[] {
        if (table instanceof EntityTableBuilder) {
            return this.compareEntityTable(table)
        }

        if (table instanceof JoinTableBuilder) {
            return this.compareJoinTable(table)
        }

        return []
    }

    // ------------------------------------------------------------------------

    public compareEntityTable(table: EntityTableBuilder): TableColumnAction[] {
        const toDrop = this.columnsToDrop(table).map(
            col => ['DROP', undefined, col]
        )

        const toAlter = table.columns.map(
            col => [
                this.alterColumnAction(col),
                col,
                this.findColumnSchema(col.name)
            ]
        )

        return [...toDrop, ...toAlter] as TableColumnAction[]
    }

    // ------------------------------------------------------------------------

    public compareJoinTable(table: JoinTableBuilder): TableColumnAction[] {
        const toDrop = this.columnsToDrop(table).map(
            col => ['DROP', undefined, col]
        )

        const toAlter = table.columns.map(
            col => [
                this.alterColumnAction(col),
                col,
                this.findColumnSchema(col.name)
            ]
        )

        return [...toDrop, ...toAlter] as TableColumnAction[]
    }

    // ------------------------------------------------------------------------

    public columnsToDrop(
        table: EntityTableBuilder | JoinTableBuilder
    ) {
        return this.filter(
            ({ columnName }) => !table.columns.findColumn(columnName)
        )
    }

    // ------------------------------------------------------------------------

    public compareForeignKey(column: ColumnBuilder) {
        const schema = this.findColumnSchema(column.name)
        if (schema) return schema.alterForeignKeyAction(column)
    }

    // Privates ---------------------------------------------------------------
    private alterColumnAction(column: ColumnBuilder | JoinColumnBuilder): (
        AlterColumnAction
    ) {
        const schema = this.findColumnSchema(column.name)
        if (!schema) return 'ADD'
        if (schema.shouldAlter(column)) return 'MODIFY'

        return 'NONE'
    }
}

export {
    ColumnSchema,

    type ColumnSchemaInitMap,
    type TableColumnAction
}