import { ColumnsMetadata, ColumnMetadata } from "../../../../Metadata"
import ColumnBuilder from "./ColumnBuilder"

import type { TableColumnAction } from "../../../DatabaseSchema"
import type { EntityTarget } from "../../../../../types/General"

export default class ColumnsBuilder extends ColumnsMetadata<ColumnBuilder> {
    constructor(target: EntityTarget, ...columns: ColumnMetadata[]) {
        super(target, ...columns as ColumnsMetadata<ColumnBuilder>)
        this.convertBuilders()
    }

    public createSQL(): string {
        return this.map(column => column.createSQL()).join(', ')
    }

    public alterSQL(schema: TableColumnAction[]): string {
        return schema
            .filter(([action]) => action !== 'NONE')
            .flatMap(([action, column, schema]) => {
                switch (action) {
                    case "ADD": return column!.addSQL()

                    // --------------------------------------------------------

                    case "MODIFY": return schema?.shouldAlterColumn(column!)
                        ? column!.modifySQL()
                        : []

                    // --------------------------------------------------------

                    case "DROP": return schema!.dropSQL()
                }
            })
            .join(', ')
    }

    protected mergeParentsColumns(): void { }

    private convertBuilders() {
        for (const index in this)
            this[index] = this.columnMetadataToColumnBuilder(this[index])
    }

    private columnMetadataToColumnBuilder(column: ColumnMetadata) {
        return ColumnBuilder.from(column)
    }

    protected override register(): void { }
}

export {
    ColumnBuilder
}