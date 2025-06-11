import EntityMetadata, { ColumnMetadata } from "../../EntityMetadata"

import UnionEntity from "../../../UnionEntity"
import { UnionTarget } from "../../../UnionEntity/types"

// Types
import type { EntityTarget } from "../../../../types/General"
import type DataType from "../../EntityMetadata/DataType"

export default class EntityUnionColumnMetadata extends ColumnMetadata {
    public entities: EntityMetadata[]

    constructor(
        target: UnionTarget = UnionEntity,
        name: string,
        dataType: DataType,
        ...targets: EntityTarget[]
    ) {
        super(target, name, dataType)

        this.entities = this.loadEntities(targets)
    }

    // Instance Methods =======================================================
    // Privates ---------------------------------------------------------------
    private loadEntities(targets: EntityTarget[]): EntityMetadata[] {
        return targets.map(target => EntityMetadata.findOrBuild(target))
    }
}