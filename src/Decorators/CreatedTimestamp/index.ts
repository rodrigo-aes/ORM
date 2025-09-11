import 'reflect-metadata'

import { ColumnsMetadata } from '../../Metadata'
import type { EntityTarget } from "../../types/General"

export default function CreatedTimestamp<Entity extends object>(
    target: Entity,
    name: string
) {
    ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
        .registerColumnPattern(name, 'created-timestamp')
}