import {
    EntityMetadata,
    HasOneMetadata,
    HasManyMetadata,
    BelongsToMetadata,
    HasOneThroughMetadata,
    HasManyThroughMetadata,
    BelongsToManyMetadata,
    PolymorphicHasOneMetadata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    type RelationMetadataType
} from "../Metadata"

// Handlers
import { MetadataHandler, TempMetadata } from "../Metadata"

// Query Builder
import {
    QueryBuilder,
    type FindQueryOptions,
    type FindOneQueryOptions,
    type PaginationQueryOptions,
    type CreationAttributes,
    type UpdateAttributes,
    type UpdateOrCreateAttibutes,
    type ConditionalQueryOptions,
} from "../QueryBuilder"

// Components
import {
    Collection,
    Pagination,
    ColumnsSnapshots,

    type PaginationInitMap
} from "./Components"

// Repository
import Repository, {
    type ResultMapOption,
    type DeleteResult
} from "../Repository"

// Relations
import {
    HasOne,
    HasMany,
    BelongsTo,
    HasOneThrough,
    HasManyThrough,
    BelongsToMany,
    PolymorphicHasOne,
    PolymorphicHasMany,
    PolymorphicBelongsTo
} from '../Relations'

// Types
import type { ResultSetHeader } from "mysql2"
import type {
    EntityTarget,
    PolymorphicEntityTarget,
    LocalOrInternalPolymorphicEntityTarget,
    Constructor
} from "../../types/General"

import type { EntityProperties } from "../QueryBuilder"

export default abstract class BaseEntity {
    protected hidden: string[] = []

    constructor(properties?: any) {
        if (properties) Object.assign(this, properties)
        this.getMetadata().computedProperties?.assign(this)

        ColumnsSnapshots.set(this, this.toJSON())
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getMetadata(): EntityMetadata {
        return MetadataHandler.loadMetadata(
            this.constructor as EntityTarget
        ) as EntityMetadata
    }

    // ------------------------------------------------------------------------

    public getRepository<
        T extends Repository<Constructor<this>> = Repository<Constructor<this>>
    >(): T {
        return this.getMetadata().getRepository() as T
    }

    // ------------------------------------------------------------------------

    public toJSON<T extends BaseEntity>(this: T): EntityProperties<T> {
        const json = Object.fromEntries([...this.getMetadata().columns].map(
            ({ name }) => [name, this[name as keyof typeof this]]
        )) as (
                EntityProperties<T>
            )

        return this.hide(json)
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

    public async save(): Promise<this> {
        this.fill(await this.getRepository().updateOrCreate(this, 'json'))
        return this
    }

    // ------------------------------------------------------------------------

    public async update(attributes: UpdateAttributes<this>): Promise<this> {
        this.fill(attributes)
        await this.getRepository().update(this, this)

        return this
    }

    // ------------------------------------------------------------------------

    public async delete<T extends BaseEntity>(this: T): Promise<void> {
        await this.getRepository().delete(this)
    }

    // Protecteds -------------------------------------------------------------
    protected hasOne<
        T extends BaseEntity,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): HasOne<T, Related> {
        const metadata = this.getRelationMetadata(name)
        if (!(metadata instanceof HasOneMetadata)) throw new Error

        return new HasOne(metadata, this, related)
    }

    // ------------------------------------------------------------------------

    protected hasMany<
        T extends BaseEntity,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): HasMany<T, Related> {
        const metadata = this.getRelationMetadata(name)
        if (!(metadata instanceof HasManyMetadata)) throw new Error

        return new HasMany(metadata, this, related)
    }

    // ------------------------------------------------------------------------

    protected belongsTo<
        T extends BaseEntity,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): BelongsTo<T, Related> {
        const metadata = this.getRelationMetadata(name)
        if (!(metadata instanceof BelongsToMetadata)) throw new Error

        return new BelongsTo(metadata, this, related)
    }

    // ------------------------------------------------------------------------

    protected hasOneThrough<
        T extends BaseEntity,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): HasOneThrough<T, Related> {
        const metadata = this.getRelationMetadata(name)
        if (!(metadata instanceof HasOneThroughMetadata)) throw new Error

        return new HasOneThrough(metadata, this, related)
    }

    // ------------------------------------------------------------------------

    protected hasManyThrough<
        T extends BaseEntity,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): HasManyThrough<T, Related> {
        const metadata = this.getRelationMetadata(name)
        if (!(metadata instanceof HasManyThroughMetadata)) throw new Error

        return new HasManyThrough(metadata, this, related)
    }

    // ------------------------------------------------------------------------

    protected belongsToMany<
        T extends BaseEntity,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): BelongsToMany<T, Related> {
        const metadata = this.getRelationMetadata(name)
        if (!(metadata instanceof BelongsToManyMetadata)) throw new Error

        return new BelongsToMany(metadata, this, related)
    }

    // ------------------------------------------------------------------------

    protected polymorphicHasOne<
        T extends BaseEntity,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): PolymorphicHasOne<T, Related> {
        const metadata = this.getRelationMetadata(name)
        if (!(metadata instanceof PolymorphicHasOneMetadata)) throw new Error

        return new PolymorphicHasOne(metadata, this, related)
    }

    // ------------------------------------------------------------------------

    protected polymorphicHasMany<
        T extends BaseEntity,
        Related extends EntityTarget
    >(
        this: T,
        name: string,
        related: Related
    ): PolymorphicHasMany<T, Related> {
        const metadata = this.getRelationMetadata(name)
        if (!(metadata instanceof PolymorphicHasManyMetadata)) throw new Error

        return new PolymorphicHasMany(metadata, this, related)
    }

    // ------------------------------------------------------------------------

    protected polymorphicBelongsTo<
        T extends BaseEntity,
        Related extends PolymorphicEntityTarget | EntityTarget[]
    >(
        this: T,
        name: string,
        related: Related
    ): PolymorphicBelongsTo<T, LocalOrInternalPolymorphicEntityTarget<Related>> {
        const metadata = this.getRelationMetadata(name)
        if (!(metadata instanceof PolymorphicBelongsToMetadata)) throw new Error

        return new PolymorphicBelongsTo(
            metadata,
            this,
            (
                Array.isArray(related)
                    ? metadata.relatedTarget
                    : related
            ) as LocalOrInternalPolymorphicEntityTarget<Related>
        )
    }

    // Privates ---------------------------------------------------------------
    private getRelationMetadata(name: string): (
        RelationMetadataType
    ) {
        const meta = this.getMetadata().relations?.find(
            rel => rel.name === name
        )

        if (meta) return meta

        throw new Error
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static getMetadata<T extends EntityTarget>(this: T): (
        EntityMetadata
    ) {
        return MetadataHandler.loadMetadata(this) as EntityMetadata
    }

    // ------------------------------------------------------------------------

    public static getQueryBuilder<T extends EntityTarget>(this: T): (
        QueryBuilder<T>
    ) {
        return new QueryBuilder(this)
    }

    // ------------------------------------------------------------------------

    public static getRepository<
        T extends Repository<Target> = Repository<typeof this>,
        Target extends (EntityTarget & typeof BaseEntity) = any
    >(this: Target): T {
        return this.getMetadata().getRepository() as T
    }

    // ------------------------------------------------------------------------

    public static scope<T extends EntityTarget>(
        this: T & typeof BaseEntity,
        name: string,
        ...args: any[]
    ): T {
        const scope = this.getMetadata().scopes?.getScope(name, ...args)
        if (!scope) throw new Error

        const scoped = this.reply()
        TempMetadata.reply(scoped, this).setScope(scoped, scope)

        return scoped as T
    }

    // ------------------------------------------------------------------------

    public static collection<T extends EntityTarget>(
        this: T & typeof BaseEntity,
        collection: string | typeof Collection
    ): T {
        const coll: typeof Collection = typeof collection === 'object'
            ? collection
            : this.getMetadata().collections?.search(collection as string)

        if (!coll) throw new Error

        const scoped = this.reply()
        TempMetadata.reply(scoped, this).setCollection(scoped, coll)

        return scoped as T
    }

    // ------------------------------------------------------------------------

    public static build<T extends EntityTarget>(
        this: T,
        attributes: CreationAttributes<InstanceType<T>>
    ): InstanceType<T> {
        return new this(attributes) as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    public static findByPk<T extends EntityTarget>(
        this: T & typeof BaseEntity,
        pk: any,
        mapTo: ResultMapOption = 'entity'
    ) {
        return this.getRepository().findByPk(pk, mapTo)
    }

    // ------------------------------------------------------------------------

    public static find<T extends EntityTarget>(
        this: T & typeof BaseEntity,
        options: FindQueryOptions<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ) {
        return this.getRepository().find(options, mapTo)
    }

    // ------------------------------------------------------------------------

    public static findOne<T extends EntityTarget>(
        this: T & typeof BaseEntity,
        options: FindOneQueryOptions<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ) {
        return this.getRepository().findOne(options, mapTo)
    }

    // ------------------------------------------------------------------------

    public static paginate<T extends EntityTarget>(
        this: T & typeof BaseEntity,
        options: PaginationQueryOptions<InstanceType<T>>
    ) {
        this.getRepository().paginate(options)
    }

    // ------------------------------------------------------------------------

    public static create<T extends EntityTarget>(
        this: T & typeof BaseEntity,
        attributes: CreationAttributes<InstanceType<T>>
    ): Promise<InstanceType<T>> {
        return this.getRepository().create(attributes)
    }

    // ------------------------------------------------------------------------

    public static createMany<T extends EntityTarget>(
        this: T & typeof BaseEntity,
        attributes: CreationAttributes<InstanceType<T>>[]
    ): Promise<InstanceType<T>[]> {
        return this.getRepository().createMany(attributes)
    }

    // ------------------------------------------------------------------------

    public static update<T extends EntityTarget>(
        this: T & typeof BaseEntity,
        attributes: UpdateAttributes<InstanceType<T>>,
        where: ConditionalQueryOptions<InstanceType<T>>
    ): Promise<ResultSetHeader> {
        return this.getRepository().update(attributes, where) as (
            Promise<ResultSetHeader>
        )
    }

    // ------------------------------------------------------------------------

    public static updateOrCreate<T extends EntityTarget>(
        this: T & typeof BaseEntity,
        attributes: UpdateOrCreateAttibutes<InstanceType<T>>,
    ): Promise<InstanceType<T>> {
        return this.getRepository().updateOrCreate(attributes as (
            UpdateOrCreateAttibutes<InstanceType<T & typeof BaseEntity>>
        ))
    }

    // ------------------------------------------------------------------------

    public static delete<T extends EntityTarget>(
        this: T & typeof BaseEntity,
        where: ConditionalQueryOptions<InstanceType<T>>
    ): Promise<DeleteResult> {
        return this.getRepository().delete(where)
    }

    // Privates --------------------------------------------------------------
    private static reply<T extends EntityTarget>(this: T): T {
        const replic = class extends (this as new (...args: any[]) => any) { }
        Object.assign(replic, this)

        return replic as T
    }
}

export {
    ColumnsSnapshots,
    Collection,
    Pagination,

    type PaginationInitMap
}