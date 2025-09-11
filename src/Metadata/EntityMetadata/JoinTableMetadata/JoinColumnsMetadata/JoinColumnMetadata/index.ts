import JoinForeignKeyReferences from "./JoinForeignKeyReferences"

import type JoinTableMetadata from "../.."
import type DataType from "../../../DataType"
import type { JoinColumnInitMap, JoinColumnMetadataJSON } from "./types"

export default class JoinColumnMetadata {
    public readonly isForeignKey = true
    public references: JoinForeignKeyReferences

    constructor(
        private table: JoinTableMetadata,
        initMap: JoinColumnInitMap
    ) {
        this.references = this.makeReferences(initMap)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get tableName(): string {
        return this.table.tableName
    }

    // ------------------------------------------------------------------------

    public get name(): string {
        return `${this.references.referenced().name.toLowerCase()}Id`
    }

    // ------------------------------------------------------------------------

    public get dataType(): DataType {
        return this.references.column.dataType
    }

    // ------------------------------------------------------------------------

    public get length(): number | undefined {
        return this.references.column.length
    }

    // ------------------------------------------------------------------------

    public get unsigned(): boolean | undefined {
        return this.references.column.unsigned
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): JoinColumnMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                dataType: this.dataType.toJSON(),
                references: this.references.toJSON()
            }),
            Object.entries(this).filter(
                ([key]) => [
                    'name',
                    'length',
                    'unsigned',
                    'isForeignKey',
                ]
                    .includes(key)
            )
        ]) as JoinColumnMetadataJSON
    }

    // Privates ---------------------------------------------------------------
    private makeReferences(initMap: JoinColumnInitMap) {
        return new JoinForeignKeyReferences(this.table, this, {
            constrained: true,
            ...initMap
        })
    }
}

export type {
    JoinColumnInitMap,
    JoinColumnMetadataJSON
}