import 'reflect-metadata'

import {
    ColumnsMetadata,
    DataType,

    type ComputedType
} from '../../Metadata'

// Types
import type { EntityTarget } from '../../../types/General'

export default function ComputedColumn<Entity extends object>(
    dataType: DataType,
    as: string,
    type: ComputedType = 'STORED'
) {
    return function (
        target: Entity,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .registerColumn(name, DataType.COMPUTED(dataType, as, type))
    }
}   