import type { SQLColumnType } from "../ColumnMetadata"

export default abstract class DataType {
    protected constructor(public type: SQLColumnType) { }

    public buildSQL(): string {
        return this.type.toUpperCase()
    }
}