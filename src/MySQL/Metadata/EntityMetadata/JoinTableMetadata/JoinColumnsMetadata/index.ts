import JoinColumnMetadata, {
    type JoinColumnInitMap
} from "./JoinColumnMetadata"

import type JoinTableMetadata from ".."
import type { EntityTarget } from "../../../../../types/General"

import type { JoinColumnsMetadataJSON } from "./types"
export default class JoinColumnsMetadata<
    T extends JoinColumnMetadata = JoinColumnMetadata
> extends Array<T> {
    constructor(
        private table: JoinTableMetadata,
        ...columns: T[]
    ) {
        super(...columns)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public registerColumn(initMap: JoinColumnInitMap) {
        this.push(new JoinColumnMetadata(this.table, initMap) as T)
    }

    // ------------------------------------------------------------------------

    public findColumn(columnName: string): JoinColumnMetadata | undefined {
        return this.find(({ name }) => name === columnName)
    }

    // ------------------------------------------------------------------------

    public getColumn(columnName: string): JoinColumnMetadata {
        const column = this.findColumn(columnName)
        if (!column) throw new Error

        return column
    }

    // ------------------------------------------------------------------------

    public getTargetColumn(target: EntityTarget): (
        JoinColumnMetadata
    ) {
        return this.getColumn(`${target.name.toLowerCase()}Id`)
    }

    // ------------------------------------------------------------------------

    public toJSON(): JoinColumnsMetadataJSON {
        return [...this].map(column => column.toJSON())
    }
}

export {
    JoinColumnMetadata,
    type JoinColumnInitMap,
    type JoinColumnsMetadataJSON
}