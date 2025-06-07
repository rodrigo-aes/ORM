import { EntityMetadata } from "../Metadata"

// Query Builder
import QueryBuilder from "../QueryBuilder/QueryBuilder"

// Components
import { Collection, RelationCollection } from "./Components"

// Types
import type MySQLConnection from "../Connection"
import type { EntityTarget } from "../../types/General"
import type {
    CreationAttributes,
    EntityCreationAttributes,
    EntityProperties,
} from "../QueryBuilder"

export default abstract class BaseEntity {
    protected hidden: string[] = []

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get connection(): MySQLConnection {
        const connection = BaseEntity.getTargetConnection(
            this.constructor as EntityTarget
        )

        if (connection) return connection

        throw new Error
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): any {
        return Object.entries(this)
            .filter(([key]) => typeof key === 'string')
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
    }

    // ------------------------------------------------------------------------

    public fill<T extends BaseEntity>(
        this: T,
        data: Partial<EntityProperties<T>>
    ): T {
        Object.assign(this, data)
        return this
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static getConnection<T extends (EntityTarget & typeof BaseEntity)>(
        this: T
    ): MySQLConnection | undefined {
        return EntityMetadata.findOrBuild(this as EntityTarget).connection
            ?? this.tempConnection()
    }

    // ------------------------------------------------------------------------

    public static getQueryBuilder<
        T extends (EntityTarget & typeof BaseEntity)
    >(
        this: T
    ): QueryBuilder<T> {
        return new QueryBuilder(this)
    }

    // ------------------------------------------------------------------------

    // public static create<T extends (EntityTarget & typeof BaseEntity)>(
    //     this: T,
    //     attributes: EntityCreationAttributes<InstanceType<T>>
    // ): Promise<InstanceType<T>> {
    //     return this.getQueryBuilder().create(attributes)
    // }

    // // ------------------------------------------------------------------------

    // public static createMany<T extends (EntityTarget & typeof BaseEntity)>(
    //     this: T,
    //     attributes: EntityCreationAttributes<InstanceType<T>>[]
    // ): Promise<InstanceType<T>[]> {
    //     return this.getQueryBuilder().createMany(attributes)
    // }

    // ------------------------------------------------------------------------

    public static build<T extends EntityTarget>(
        this: T,
        attributes: CreationAttributes<InstanceType<T>>
    ): InstanceType<T> {
        const entity = new this().fill(attributes as any)
        return entity as InstanceType<T>
    }

    // Privates ---------------------------------------------------------------
    private static tempConnection(): (
        MySQLConnection | undefined
    ) {
        return Reflect.getOwnMetadata('temp-connection', this)
    }

    // ------------------------------------------------------------------------

    private static getTargetConnection(target: EntityTarget): (
        MySQLConnection | undefined
    ) {
        return EntityMetadata.findOrBuild(target).connection
            ?? Reflect.getOwnMetadata('temp-connection', target)
    }
}

export {
    Collection,
    RelationCollection
}