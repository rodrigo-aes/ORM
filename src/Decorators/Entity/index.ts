import 'reflect-metadata'
import { EntityMetadata } from '../../Metadata'

// Types
import type { EntityTarget } from '../../types'

export default function Entity(tableName?: string) {
    return function (target: EntityTarget) {
        EntityMetadata.findOrBuild(target, tableName)
    }
}