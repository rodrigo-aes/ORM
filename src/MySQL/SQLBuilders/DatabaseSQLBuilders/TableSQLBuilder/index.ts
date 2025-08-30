import TableSchema from "../../../DatabaseSchema/TableSchema"
import ColumnSQLBuilder from "./ColumnSQLBuilder"

import { SQLStringHelper } from "../../../Helpers"

export default abstract class TableSQLBuilder<
    T extends ColumnSQLBuilder = ColumnSQLBuilder
> extends TableSchema<T> {
    public createSQL() {
        return SQLStringHelper.normalizeSQL(`
            CREATE TABLE ${this.name} (${this.createColumnsSQL()})
        `)
    }

    // ------------------------------------------------------------------------

    public alterSQL(schema: TableSchema) {
        return SQLStringHelper.normalizeSQL(`  
            ALTER TABLE ${this.name} ${this.alterColumnsSQL(schema)}
        `)
    }

    // ------------------------------------------------------------------------

    public dropSQL() {
        return `DROP TABLE ${this.name}`
    }

    // ------------------------------------------------------------------------

    public abstract actionSQL(schema?: TableSchema): string | undefined

    // Privates ---------------------------------------------------------------
    private createColumnsSQL(): string {
        return this.map(column => column.createSQL()).join(', ')
    }

    // ------------------------------------------------------------------------

    private alterColumnsSQL(schema: TableSchema): string {
        return this.map(column => column.actionSQL(
            schema.findColumn(column.name)
        ))
            .filter(action => !!action)
            .join(', ')
    }
}

export {
    ColumnSQLBuilder
}