import { HooksMetadata } from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { ResultSetHeader } from "mysql2"
import type { ConditionalQueryOptions } from "../../../QueryBuilder"

export default function AfterBulkUpdate<Entity extends object>(
    target: Entity,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<(
        where: ConditionalQueryOptions<Entity> | undefined,
        result: ResultSetHeader
    ) => void | Promise<void>>
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addAfterBulkUpdate(propertyName)
}