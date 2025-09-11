import type { ColumnSchemaMap } from "../../../../DatabaseSchema"
import type ForeignKeyConstraintSQLBuilder from "./ForeignKeyConstraintSQLBuilder"

export interface ColumnSQLBuilderMap extends ColumnSchemaMap {
    references?: ForeignKeyConstraintSQLBuilder
}