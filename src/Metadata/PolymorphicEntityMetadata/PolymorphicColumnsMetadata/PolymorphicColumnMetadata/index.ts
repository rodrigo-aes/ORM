import { DataType } from "../../../EntityMetadata"
import PolymorphicForeignKeyReferences from "./PolymorphicForeignKeyReferences"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types"

import type { ColumnMetadata } from "../../../EntityMetadata"
import type { PolymorphicColumnMetadataJSON } from "./types"

export default class PolymorphicColumnMetadata {
    public dataType: DataType | DataType[]
    public length?: number
    public nullable?: boolean
    public defaultValue?: any
    public unique?: boolean
    public primary?: boolean
    public autoIncrement?: boolean
    public unsigned?: boolean
    public isForeignKey?: boolean

    // public references?: PolymorphicForeignKeyReferences

    private static readonly commonPropsKeys: (keyof ColumnMetadata)[] = [
        'nullable',
        'defaultValue',
        'unique',
        'primary',
        'autoIncrement',
        'unsigned',
        'isForeignKey',
    ]

    constructor(
        public target: PolymorphicEntityTarget | null,
        public name: string,
        public sources?: ColumnMetadata[],
        dataType?: DataType
    ) {
        if (sources) {
            this.dataType = this.mergeDataTypes()
            Object.assign(this, this.getCommonProps())
        }
        else this.dataType = dataType ?? (() => { throw new Error })()

    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public targetSource(target: EntityTarget): ColumnMetadata | undefined {
        return this.sources?.find(source => source.target === target)
    }

    // ------------------------------------------------------------------------

    public toJSON(): PolymorphicColumnMetadataJSON {
        return {
            name: this.name,

            dataTypes: Array.isArray(this.dataType)
                ? this.dataType.map(dataType => dataType.toJSON())
                : [this.dataType.toJSON()],

            length: this.length,
            nullable: this.nullable,
            defaultValue: this.defaultValue,
            unique: this.unique,
            primary: this.primary,
            autoIncrement: this.autoIncrement,
            unsigned: this.unsigned,
            isForeignKey: this.isForeignKey,
        }
    }

    // Private ----------------------------------------------------------------
    private mergeDataTypes(): DataType[] {
        const types = new Set<string>()

        return this.sources!
            .map(({ dataType }) => dataType)
            .filter(dataType => types.has(dataType.type)
                ? false
                : types.add(dataType.type)
            )
    }

    // ------------------------------------------------------------------------

    private getCommonProps(): any {
        return Object.fromEntries(
            PolymorphicColumnMetadata.commonPropsKeys.flatMap(key => {
                const [first] = this.sources!

                return this.sources!.every(
                    source => source[key] === first[key]
                )
                    ? [[key, first[key]]]
                    : []
            })
        )
    }
}

export {
    type PolymorphicColumnMetadataJSON
}