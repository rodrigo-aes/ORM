import ConnectionsMetadata from "../ConnectionsMetadata"
import EntityMetadata from "../EntityMetadata"
import PolymorphicEntityMetadata from "../PolymorphicEntityMetadata"
import { JoinTablesMetadata } from "../EntityMetadata"

import BaseEntity from "../../BaseEntity"
import BasePolymorphicEntity from "../../BasePolymorphicEntity"

// Components
import TempMetadata from "../TempMetadata"

// Types
import type { PolyORMConnection } from "../../Metadata"
import type {
    EntityTarget,
    PolymorphicEntityTarget,
    CollectionTarget,
    Target,
    TargetMetadata,
    TargetRepository,
    Constructor,
} from "../../types"

// Exceptions
import PolyORMException from "../../Errors"

export default class MetadataHandler {
    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static registerEntitiesConnection(
        connection: PolyORMConnection,
        ...targets: EntityTarget[]
    ): void {
        for (const target of targets) EntityMetadata
            .findOrBuild(target)
            .defineDefaultConnection(connection)
    }

    // ------------------------------------------------------------------------

    public static normalize() {
        JoinTablesMetadata.makeAllUnique()
    }

    // ------------------------------------------------------------------------

    public static register<T extends Target>(
        metadata: TargetMetadata<T>,
        target: T,
    ): void {
        Reflect.defineMetadata(
            this.resolveTargetMetadataKey(target),
            metadata,
            target
        )
    }

    // ------------------------------------------------------------------------

    public static targetMetadata<T extends Target>(target: T): (
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

            // ----------------------------------------------------------------

            default: throw PolyORMException.Metadata.instantiate(
                'INVALID_ENTITY', target.name
            )
        }
    }

    // ------------------------------------------------------------------------

    public static getConnection(target: Target): PolyORMConnection {
        return TempMetadata.getConnection(target)
            ?? Reflect.getOwnMetadata('default-connection', target)!
            ?? PolyORMException.Metadata.throw(
                'MISSING_ENTITY_CONNECTION', target.name
            )
    }

    // ------------------------------------------------------------------------

    public static setDefaultConnection(
        connection: PolyORMConnection | string,
        target: Target
    ): void {
        if (!Reflect.getOwnMetadata('default-connection', target)) (
            Reflect.defineMetadata(
                'default-connection',
                this.resolveConnection(connection),
                target
            )
        )
    }

    // ------------------------------------------------------------------------

    public static setTempConnection(
        connection: PolyORMConnection | string,
        target: Target
    ): void {
        TempMetadata.setConnection(target, this.resolveConnection(connection))
    }

    // ------------------------------------------------------------------------

    public static getRepository<T extends Target>(target: T): (
        Constructor<TargetRepository<T>> | undefined
    ) {
        return Reflect.getOwnMetadata('repository', target)
    }

    // ------------------------------------------------------------------------

    public static setRepository<T extends Target>(
        repository: Constructor<TargetRepository<T>>,
        target: T
    ): void {
        Reflect.defineMetadata('repository', repository, target)
    }

    // Privates ---------------------------------------------------------------
    private static resolveConnection(connection: PolyORMConnection | string): (
        PolyORMConnection
    ) {
        switch (typeof connection) {
            case 'object': return connection
            case 'string': return ConnectionsMetadata.getOrThrow(connection)
        }
    }

    // ------------------------------------------------------------------------

    private static resolveTargetMetadataKey(target: Target): (
        `${'entity' | 'polymorphic-Entity'}-metadata`
    ) {
        switch (true) {
            case target.prototype instanceof BaseEntity: return (
                'entity-metadata'
            )

            // ----------------------------------------------------------------

            case target.prototype instanceof BasePolymorphicEntity: return (
                'polymorphic-Entity-metadata'
            )

            // ----------------------------------------------------------------

            default: throw PolyORMException.Metadata.instantiate(
                'INVALID_ENTITY', target.name
            )
        }
    }
}