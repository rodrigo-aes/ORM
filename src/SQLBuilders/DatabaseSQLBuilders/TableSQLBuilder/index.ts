// Schemas
import TableSchema from "../../../DatabaseSchema/TableSchema"
import ColumnSchema from "../../../DatabaseSchema/TableSchema/ColumnSchema"
import ForeignKeyReferencesSchema from "../../../DatabaseSchema/TableSchema/ColumnSchema/ForeignKeyReferencesSchema"

// SQL Builders
import ColumnSQLBuilder, {
    ForeignKeyConstraintSQLBuilder,
    CurrentTimestamp,
    type ColumnSQLBuilderMap
} from "./ColumnSQLBuilder"

// Helpers
import { SQLStringHelper } from "../../../Helpers"

// Types
import type { ActionType } from "../../../DatabaseSchema"

export default class TableSQLBuilder<
    T extends ColumnSQLBuilder = ColumnSQLBuilder
> extends TableSchema<T> {
    public createSQL() {
        return SQLStringHelper.normalizeSQL(`
            CREATE TABLE ${this.name} (${this.createColumnsSQL()})
        `)
    }

    // ------------------------------------------------------------------------

    public syncAlterSQL(schema: TableSchema) {
        return SQLStringHelper.normalizeSQL(`  
            ALTER TABLE ${this.name} ${this.alterColumnsSQL(schema)}
        `)
    }

    // ------------------------------------------------------------------------

    public dropSQL() {
        return `DROP TABLE ${this.name}`
    }

    // ------------------------------------------------------------------------

    public syncActionSQL(schema?: TableSchema): string | undefined {
        switch (this.compare(schema)) {
            case 'ADD': return this.createSQL()
            case 'ALTER': return this.syncAlterSQL(schema!)
        }
    }

    // ------------------------------------------------------------------------

    public migrateAlterSQL(action: Omit<ActionType, 'CREATE'>): string {
        switch (action) {
            case 'ALTER': return SQLStringHelper.normalizeSQL(
                `ALTER TABLE ${this.name} ${this.migrateAlterChildsSQL()}`
            )

            case 'DROP': return this.dropSQL()
        }

        throw new Error
    }

    // Privates ---------------------------------------------------------------
    private createColumnsSQL(): string {
        return this.map(column => column.createSQL()).join(', ')
    }

    // ------------------------------------------------------------------------

    private alterColumnsSQL(schema: TableSchema): string {
        return this.map(column => column.syncActionSQL(
            schema.findColumn(column.name)
        ))
            .filter(action => !!action)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private migrateAlterChildsSQL(): string {
        return this.actions.map(([action, source]) => {
            switch (true) {
                case source instanceof ColumnSchema: return (
                    this.migrateAlterColumnSQL(source.name, action)
                )

                case source instanceof ForeignKeyReferencesSchema: return (
                    this.migrateAlterForeignKeyConstraintSQL(
                        source.name,
                        action
                    )
                )
            }
        })
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private migrateAlterColumnSQL(name: string, action: ActionType): string {
        const column = this.findColumn(name)
        if (!column) throw new Error

        switch (action) {
            case "CREATE": return column?.addSQL()

            case "ALTER":
            case 'DROP/CREATE':
            case "DROP": return column?.migrateAlterSQL(action)

            case "NONE": return ''
        }
    }

    // ------------------------------------------------------------------------

    private migrateAlterForeignKeyConstraintSQL(
        column: string,
        action: ActionType
    ): string {
        const constraint = this.findColumn(column)?.map.references
        if (!constraint) throw new Error

        return constraint.migrateAlterSQL(action)
    }
}

export {
    ColumnSQLBuilder,
    ForeignKeyConstraintSQLBuilder,
    CurrentTimestamp,

    type ColumnSQLBuilderMap
}