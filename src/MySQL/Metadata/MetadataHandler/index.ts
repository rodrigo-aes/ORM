import EntityMetadata from "../EntityMetadata"
import { JoinTableMetadata } from "../EntityMetadata"

// Types
import type MySQLConnection from "../../Connection"
import type { EntityTarget } from "../../../types/General"

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
}