import EntityMetadata from "../EntityMetadata"
import PolymorphicEntityMetadata from "../PolymorphicEntityMetadata"
import { JoinTableMetadata } from "../EntityMetadata"

import BaseEntity from "../../BaseEntity"
import BasePolymorphicEntity from "../../BasePolymorphicEntity"

// Components
import TempMetadata from "../TempMetadata"

// Types
import type MySQLConnection from "../../Connection"
import type {
    EntityTarget,
    PolymorphicEntityTarget,
    Target,
    TargetMetadata,
} from "../../types/General"

export default class MetadataHandler {
    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static registerConnectionEntities(
        connection: MySQLConnection,
        ...entities: EntityTarget[]
    ): void {
        for (const entity of entities) EntityMetadata
            .findOrBuild(entity)
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
        return Reflect.getOwnMetadata('temp-connection', target)
            ?? EntityMetadata.findOrBuild(target).connection
    }

    // ------------------------------------------------------------------------

    public static loadMetadata<T extends Target>(target: T): (
        TargetMetadata<T>
    ) {
        switch (true) {
            case target.prototype instanceof BaseEntity: return (
                EntityMetadata.find(target as EntityTarget)
                ?? TempMetadata.getMetadata(target)
            ) as TargetMetadata<T>

            // ----------------------------------------------------------------

            case target.prototype instanceof BasePolymorphicEntity: return (
                PolymorphicEntityMetadata.find(
                    target as PolymorphicEntityTarget
                )
                ?? TempMetadata.getMetadata(target)
            ) as TargetMetadata<T>
        }

        throw new Error
    }

    // ------------------------------------------------------------------------

    public static getTargetParents<T extends Target>(target: T): T[] {
        const parents: T[] = []
        let parent = Object.getPrototypeOf(target)

        while (parent && parent !== Function.prototype) {
            parents.push(parent)
            parent = Object.getPrototypeOf(parent)
        }

        return parents
    }
}