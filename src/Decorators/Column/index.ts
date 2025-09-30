import 'reflect-metadata'

import { ColumnsMetadata, type DataType } from '../../Metadata'
import type { EntityTarget } from '../../types'

export default function Column<Entity extends object>(dataType: DataType) {
    return function (
        target: Entity,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .registerColumn(name, dataType)
    }
}   