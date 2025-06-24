import EntityMetadata from "../EntityMetadata"
import EntityUnionMetadata from "../EntityUnionMetadata"
import { JoinTableMetadata } from "../EntityMetadata"

import BaseEntity from "../../BaseEntity"
import EntityUnion from "../../BaseEntityUnion"

// Types
import type MySQLConnection from "../../Connection"
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"

export default class MetadataHandler {
    public static registerEntitiesConnection(
        connection: MySQLConnection,
        ...entities: EntityTarget[]
    ): void {
        for (const entity of entities) EntityMetadata.findOrBuild(entity)
            .defineConnection(connection)
    }

    // ------------------------------------------------------------------------

    public static normalizeMetadata() {
        JoinTableMetadata.makeUniqueJoinTables()
    }

    // ------------------------------------------------------------------------

    public static getTargetConnection(target: EntityTarget): (
        MySQLConnection | undefined
    ) {
        return EntityMetadata.findOrBuild(target).connection
            ?? Reflect.getOwnMetadata('temp-connection', target)
    }

    // ------------------------------------------------------------------------

    public static loadMetadata(
        target: EntityTarget | UnionEntityTarget
    ): (
            EntityMetadata | EntityUnionMetadata
        ) {
        switch (true) {
            case (target as any).prototype instanceof EntityUnion: return (
                EntityUnionMetadata.find(target as UnionEntityTarget)!
            )

            case (target as any).prototype instanceof BaseEntity: return (
                EntityMetadata.find(target as EntityTarget)!
            )
        }

        throw new Error
    }
}