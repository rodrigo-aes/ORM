import { EntityMetadata } from "../Metadata"

// Query Builder
import { QueryBuilder } from "../QueryBuilder"

// Components
import { Collection, ColumnsSnapshots } from "./Components"

// Repository
import Repository, {
    type FindQueryOptions,
    type FindOneQueryOptions,
    type CreationAttributes,
    type UpdateAttributes,
    type UpdateOrCreateAttibutes,
    type ConditionalQueryOptions,
    type ResultMapOption,
    type DeleteResult
} from "../Repository"

// Types
import type { ResultSetHeader } from "mysql2"
import type { EntityTarget } from "../../types/General"
import type { EntityProperties } from "../QueryBuilder"

export default abstract class BaseEntity {
    protected hidden: string[] = []

    constructor() {
        ColumnsSnapshots.set(this, this.toJSON())
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON<T extends BaseEntity>(this: T): EntityProperties<T> {
        const json = Object.fromEntries([...this.getMetadata().columns].map(
            ({ name }) => [name, this[name as keyof typeof this]]
        )) as (
                EntityProperties<T>
            )

        this.hide(json)

        return json
    }

    // ------------------------------------------------------------------------

    public hide<T extends BaseEntity>(this: T, json?: EntityProperties<T>): (
        EntityProperties<T>
    ) {
        if (!json) json = this.toJSON()
        for (const key of this.hidden) delete json[key as keyof typeof json]

        return json
    }

    // ------------------------------------------------------------------------

    public fill<T extends BaseEntity>(
        this: T,
        data: Partial<EntityProperties<T>>
    ): T {
        Object.assign(this, data)
        return this
    }

    // ------------------------------------------------------------------------

    public getMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.constructor as EntityTarget)
    }

    // Static Methods =========================================================
    public static getMetadata<T extends EntityTarget>(this: T): (
        EntityMetadata
    ) {
        return EntityMetadata.findOrBuild(this)
    }

    // ------------------------------------------------------------------------

    public static getQueryBuilder<T extends EntityTarget>(this: T): (
        QueryBuilder<T>
    ) {
        return new QueryBuilder(this)
    }

    // ------------------------------------------------------------------------

    public static build<T extends EntityTarget>(
        this: T,
        attributes: CreationAttributes<InstanceType<T>>
    ): InstanceType<T> {
        const entity = new this().fill(attributes as any)
        return entity as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    public static find<T extends EntityTarget>(
        this: T,
        options: FindQueryOptions<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ) {
        return new Repository(this).find(options, mapTo)
    }

    // ------------------------------------------------------------------------

    public static findOne<T extends EntityTarget>(
        this: T,
        options: FindOneQueryOptions<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ) {
        return new Repository(this).findOne(options, mapTo)
    }

    // ------------------------------------------------------------------------

    public static create<T extends EntityTarget>(
        this: T,
        attributes: CreationAttributes<InstanceType<T>>
    ): Promise<InstanceType<T>> {
        return new Repository(this).create(attributes)
    }

    // ------------------------------------------------------------------------

    public static createMany<T extends EntityTarget>(
        this: T,
        attributes: CreationAttributes<InstanceType<T>>[]
    ): Promise<InstanceType<T>[]> {
        return new Repository(this).createMany(attributes)
    }

    // ------------------------------------------------------------------------

    public static update<T extends EntityTarget>(
        this: T,
        attributes: UpdateAttributes<InstanceType<T>>,
        where: ConditionalQueryOptions<InstanceType<T>>
    ): Promise<ResultSetHeader> {
        return new Repository(this).update(attributes, where) as (
            Promise<ResultSetHeader>
        )
    }

    // ------------------------------------------------------------------------

    public static updateOrCreate<T extends EntityTarget>(
        this: T,
        attributes: UpdateOrCreateAttibutes<InstanceType<T>>,
    ): Promise<InstanceType<T>> {
        return new Repository(this).updateOrCreate(attributes)
    }

    // ------------------------------------------------------------------------

    public static delete<T extends EntityTarget>(
        this: T,
        where: ConditionalQueryOptions<InstanceType<T>>
    ): Promise<DeleteResult> {
        return new Repository(this).delete(where)
    }
}

export {
    ColumnsSnapshots,
    Collection
}