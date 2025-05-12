import {
    JoinColumnMetadata,
    JoinColumnsMetadata,
    type JoinTableMetadata
} from "../../../../Metadata"
import JoinColumnBuilder from "../JoinColumnBuilder"

import type { TableColumnAction } from "../../../DatabaseSchema/TableSchema/types"

export default class JoinColumnsBuilder extends JoinColumnsMetadata<
    JoinColumnBuilder
> {
    constructor(table: JoinTableMetadata, ...columns: JoinColumnMetadata[]) {
        super(table, ...columns as JoinColumnsMetadata<JoinColumnBuilder>)
        this.instantiateBuilders(table)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public createSQL() {
        return this.map(column => column.createSQL()).join(', ')
    }

    // ------------------------------------------------------------------------

    public alterSQL(schema: TableColumnAction[]): string {
        return schema.map(([action, column, schema]) => {
            switch (action) {
                case "ADD": return column!.addSQL()
                case "MODIFY": return column!.modifySQL()
                case "DROP": return schema!.dropSQL()

                default: throw new Error
            }
        }).join(', ')
    }

    // Privates ---------------------------------------------------------------
    private instantiateBuilders(table: JoinTableMetadata) {
        for (const index in this) this[index] = new JoinColumnBuilder(
            table, this[index]
        )
    }
}