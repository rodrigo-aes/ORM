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
    public primary?: boolean
    public isForeignKey?: boolean

    private static readonly commonPropsKeys: (keyof ColumnMetadata)[] = [
        'primary',
        'isForeignKey',
    ]

    constructor(
        public target: PolymorphicEntityTarget,
        public name: string,
        public sources?: ColumnMetadata[]
    ) {
        if (sources) Object.assign(this, this.getCommonProps())
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
            primary: this.primary,
            isForeignKey: this.isForeignKey,
        }
    }

    // Private ----------------------------------------------------------------
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