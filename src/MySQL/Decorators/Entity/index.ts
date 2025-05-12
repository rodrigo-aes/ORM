import 'reflect-metadata'
import { EntityMetadata } from '../../Metadata'

// Types
import type { EntityTarget } from '../../../types/General'

export default function Entity(tableName?: string) {
    return function (target: EntityTarget) {
        EntityMetadata.findOrBuild(target as EntityTarget, {
            tableName
        })
    }
}