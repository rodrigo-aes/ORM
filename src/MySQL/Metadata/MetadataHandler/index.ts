import EntityMetadata from "../EntityMetadata"
import EntityUnionMetadata from "../EntityUnionMetadata"
import { JoinTableMetadata } from "../EntityMetadata"

import BaseEntity from "../../BaseEntity"
import BasePolymorphicEntity from "../../BasePolymorphicEntity"

// Components
import TemMetadata from "../TempMetadata"

// Types
import type MySQLConnection from "../../Connection"
import type { EntityTarget, EntityUnionTarget } from "../../../types/General"

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

    public static loadMetadata(target: EntityTarget | EntityUnionTarget): (
        EntityMetadata | EntityUnionMetadata
    ) {
        switch (true) {
            case (target as any).prototype instanceof BaseEntity: return (
                EntityMetadata.find(target as EntityTarget)
                ?? TemMetadata.getMetadata(target)
            )!

            case (target as any).prototype instanceof BasePolymorphicEntity: return (
                EntityUnionMetadata.find(target as EntityUnionTarget)
                ?? TemMetadata.getMetadata(target)
            )!
        }

        throw new Error
    }

    // ------------------------------------------------------------------------

    public static getTargetParents<T extends EntityTarget | EntityUnionTarget>(
        target: T
    ): T[] {
        const parents: T[] = []
        let parent = Object.getPrototypeOf(target)

        while (parent && parent !== Function.prototype) {
            parents.push(parent)
            parent = Object.getPrototypeOf(parent)
        }

        return parents
    }
}