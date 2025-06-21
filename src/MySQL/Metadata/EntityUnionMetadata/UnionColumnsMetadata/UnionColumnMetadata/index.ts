import { DataType } from "../../../EntityMetadata"
import UnionForeignKeyReferences from "./UnionForeignKeyReferences"


// Types
import type { UnionEntityTarget } from "../../../../../types/General"
import type { ColumnMetadataJSON } from "../../../EntityMetadata"

export default class UnionColumnMetadata {
    public length?: number
    public nullable?: boolean
    public defaultValue?: any
    public unique?: boolean
    public primary?: boolean
    public autoIncrement?: boolean
    public unsigned?: boolean
    public isForeignKey?: boolean
    public references?: UnionForeignKeyReferences

    constructor(
        public target: UnionEntityTarget | null,
        public name: string,
        public dataType: DataType
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): ColumnMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                dataType: this.dataType.toJSON(),
                references: this.references?.toJSON()
            }),
            ...Object.entries(this).filter(
                ([key]) => [
                    'name',
                    'length',
                    'nullable',
                    'defaultValue',
                    'unique',
                    'primary',
                    'autoIncrement',
                    'unsigned',
                    'isForeignKey',
                ]
                    .includes(key)
            )
        ]) as ColumnMetadataJSON
    }
}