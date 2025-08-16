import { DataType } from "../../../EntityMetadata"
import PolymorphicForeignKeyReferences from "./PolymorphicForeignKeyReferences"


// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../../types/General"

import type { ColumnMetadata, ColumnMetadataJSON } from "../../../EntityMetadata"

export default class PolymorphicColumnMetadata {
    public length?: number
    public nullable?: boolean
    public defaultValue?: any
    public unique?: boolean
    public primary?: boolean
    public autoIncrement?: boolean
    public unsigned?: boolean
    public isForeignKey?: boolean
    public references?: PolymorphicForeignKeyReferences

    constructor(
        public target: PolymorphicEntityTarget | null,
        public name: string,
        public dataType: DataType,
        public sources?: ColumnMetadata[]
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public targetSource(target: EntityTarget): ColumnMetadata | undefined {
        return this.sources?.find(source => source.target === target)
    }

    // ------------------------------------------------------------------------

    public toJSON(): ColumnMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                dataType: this.dataType?.toJSON(),
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

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildEntityTypeColumn(
        target: PolymorphicEntityTarget | null,
        ...types: EntityTarget[]
    ): PolymorphicColumnMetadata {
        return new PolymorphicColumnMetadata(
            target,
            'entityType',
            DataType.ENUM(...types.map(target => target.name))
        )
    }
}