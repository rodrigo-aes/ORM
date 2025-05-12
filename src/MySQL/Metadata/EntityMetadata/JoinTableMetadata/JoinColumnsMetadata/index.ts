import JoinColumnMetadata, {
    type JoinColumnInitMap
} from "../JoinColumnMetadata"

import type JoinTableMetadata from ".."
import type { EntityTarget } from "../../../../../types/General"

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

    public findTargetColumn(target: EntityTarget): (
        JoinColumnMetadata | undefined
    ) {
        return this.findColumn(`${target.name}Id`)
    }
}

export {
    JoinColumnMetadata,
    type JoinColumnInitMap,
}