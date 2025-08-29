import {
    MetadataHandler,
    TempMetadata,

    HasOneMetadata,
    HasManyMetadata,
    BelongsToMetadata,
    HasOneThroughMetadata,
    HasManyThroughMetadata,
    BelongsToManyMetadata,
    PolymorphicHasOneMetadata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    type PolymorphicEntityMetadata,
    type EntityMetadata,
    type RelationMetadataType
} from "../Metadata"

// Childs
import { InternalPolymorphicEntities } from "./Components"
import { ColumnsSnapshots, Collection } from "../BaseEntity"

// Query Builder
import { PolymorphicEntityQueryBuilder } from "../QueryBuilder"

// Repository
import PolymorphicRepository, {
    type CountManyQueryResult
} from "../PolymorphicRepository"

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

// Decorators
import {
    ExcludeColumns,
    Combine
} from "../Decorators"

// Handlers
import { PolymorphicEntityBuilder } from "../Handlers"

// Types
import type {
    PolymorphicEntityTarget,
    EntityTarget,
    LocalOrInternalPolymorphicEntityTarget,
    Constructor
} from "../../types/General"
import type BaseEntity from "../BaseEntity"
import type { SourceEntity } from "./types"
import type { UnionEntitiesMap } from "../Metadata"
import type { ResultSetHeader } from "mysql2"
import type { ResultMapOption, DeleteResult } from "../Handlers"
import type {
    EntityProperties,
    FindQueryOptions,
    FindOneQueryOptions,
    PaginationQueryOptions,
    CountQueryOption,
    CountQueryOptions,
    CreationAttributes,
    UpdateAttributes,
    UpdateOrCreateAttibutes,
    ConditionalQueryOptions,
} from "../SQLBuilders"

export default abstract class BasePolymorphicEntity<Targets extends object[]> {
    protected hidden: string[] = []

    public entities: UnionEntitiesMap = this.getMetadata().entities

    public primaryKey: any
    public entityType!: string

    constructor(properties?: any) {
        if (properties) Object.assign(this, properties)
        this.getMetadata().computedProperties?.assign(this)

        ColumnsSnapshots.set(this, this.toJSON())
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getMetadata(): PolymorphicEntityMetadata {
        return MetadataHandler.loadMetadata(
            this.constructor as PolymorphicEntityTarget
        ) as PolymorphicEntityMetadata
    }

    // ------------------------------------------------------------------------

    public getSourceMetadata(): EntityMetadata {
        return MetadataHandler.loadMetadata(
            this.entities[this.entityType]
        ) as EntityMetadata
    }

    // ------------------------------------------------------------------------

    public static getQueryBuilder<T extends PolymorphicEntityTarget>(
        this: T
    ): PolymorphicEntityQueryBuilder<T> {
        return new PolymorphicEntityQueryBuilder(this)
    }

    // ------------------------------------------------------------------------

    public getRepository<
        T extends PolymorphicRepository<Constructor<this>> = (
            PolymorphicRepository<Constructor<this>>
        )
    >(): T {
        return this.getMetadata().getRepository() as T
    }

    // ------------------------------------------------------------------------

    public toJSON<T extends BasePolymorphicEntity<Targets>>(this: T): (
        EntityProperties<T>
    ) {
        const json = Object.fromEntries([...this.getMetadata().columns].map(
            ({ name }) => [name, this[name as keyof typeof this]]
        )) as (
                EntityProperties<T>
            )

        return this.hide(json)
    }

    // ------------------------------------------------------------------------

    public hide<T extends BasePolymorphicEntity<Targets>>(
        this: T, json?: EntityProperties<T>
    ): EntityProperties<T> {
        if (!json) json = this.toJSON()
        for (const key of this.hidden) delete json[key as keyof typeof json]

        return json
    }

    // ------------------------------------------------------------------------

    public fill<T extends BasePolymorphicEntity<Targets>>(
        this: T,
        data: Partial<EntityProperties<T>>
    ): T {
        Object.assign(this, data)
        return this
    }

    // ------------------------------------------------------------------------

    public toSourceEntity<T extends object | undefined = undefined>() {
        return PolymorphicEntityBuilder.buildSourceEntity(
            this.entities[this.entityType],
            this
        ) as (
                T extends object
                ? T
                : T extends undefined
                ? SourceEntity<Targets>
                : never
            )
    }

    // ------------------------------------------------------------------------

    public async save<T extends BasePolymorphicEntity<any>>(
        this: T,
        source?: Constructor<Targets[number]>
    ): Promise<T> {
        if (!this.entityType && !source) throw new Error

        this.fill(
            await this.getRepository().updateOrCreate(
                (
                    this.entityType
                        ? this.entities[this.entityType]
                        : source
                ) as EntityTarget,
                this,
            ) as any
        )

        return this
    }

    // ------------------------------------------------------------------------

    public async update(attributes: UpdateAttributes<this>): Promise<this> {
        this.fill(attributes)

        await this.getRepository().update(
            this.entities[this.entityType],
            this,
            this
        )

        return this
    }

    // ------------------------------------------------------------------------

    public async delete<T extends BasePolymorphicEntity<any>>(this: T): (
        Promise<void>
    ) {
        await this.getRepository().delete(this.entities[this.entityType], this)
    }

    // Protecteds -------------------------------------------------------------
    protected hasOne<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): HasOne<T, Related> {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof HasOneMetadata)) throw new Error

        return new HasOne(metadata, target, related) as HasOne<T, Related>
    }

    // ------------------------------------------------------------------------

    protected hasMany<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): HasMany<T, Related> {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof HasManyMetadata)) throw new Error

        return new HasMany(metadata, target, related) as HasMany<T, Related>
    }

    // ------------------------------------------------------------------------

    protected belongsTo<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): BelongsTo<T, Related> {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof BelongsToMetadata)) throw new Error

        return new BelongsTo(metadata, target, related) as BelongsTo<
            T,
            Related
        >
    }

    // ------------------------------------------------------------------------

    protected hasOneThrough<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): HasOneThrough<T, Related> {
        const [metadata] = this.getRelationMetadata(name)
        if (!(metadata instanceof HasOneThroughMetadata)) throw new Error

        return new HasOneThrough(metadata, this, related) as HasOneThrough<
            T,
            Related
        >
    }

    // ------------------------------------------------------------------------

    protected hasManyThrough<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): HasManyThrough<T, Related> {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof HasManyThroughMetadata)) throw new Error

        return new HasManyThrough(metadata, target, related) as HasManyThrough<
            T,
            Related
        >
    }

    // ------------------------------------------------------------------------

    protected belongsToMany<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): BelongsToMany<T, Related> {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof BelongsToManyMetadata)) throw new Error

        return new BelongsToMany(metadata, target, related) as BelongsToMany<
            T,
            Related
        >
    }

    // ------------------------------------------------------------------------

    protected polymorphicHasOne<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): PolymorphicHasOne<T, Related> {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof PolymorphicHasOneMetadata)) throw new Error

        return new PolymorphicHasOne(metadata, target, related) as (
            PolymorphicHasOne<T, Related>
        )
    }

    // ------------------------------------------------------------------------

    protected polymorphicHasMany<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): PolymorphicHasMany<T, Related> {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof PolymorphicHasManyMetadata)) throw new Error

        return new PolymorphicHasMany(metadata, target, related) as (
            PolymorphicHasMany<T, Related>
        )
    }

    // ------------------------------------------------------------------------

    protected polymorphicBelongsTo<
        T extends PolymorphicEntityTarget,
        Related extends PolymorphicEntityTarget | EntityTarget[]
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): PolymorphicBelongsTo<
        T,
        LocalOrInternalPolymorphicEntityTarget<Related>
    > {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof PolymorphicBelongsToMetadata)) throw (
            new Error
        )

        return new PolymorphicBelongsTo(
            metadata,
            target,
            (
                Array.isArray(related)
                    ? metadata.relatedTarget
                    : related
            ) as LocalOrInternalPolymorphicEntityTarget<Related>
        ) as (
                PolymorphicBelongsTo<
                    T,
                    LocalOrInternalPolymorphicEntityTarget<Related>
                >
            )
    }

    // Privates ---------------------------------------------------------------
    private getRelationMetadata(name: string): (
        [RelationMetadataType, BaseEntity | this]
    ) {
        let meta = this.getMetadata().relations?.find(rel => rel.name === name)
        if (meta) return [meta, this]

        meta = this.getSourceMetadata().relations?.find(
            rel => rel.name === name
        )
        if (meta) return [meta, this.toSourceEntity()]

        throw new Error
    }

    // Static Getters =========================================================
    // Decorators -------------------------------------------------------------
    public static get Combine() {
        return Combine
    }

    // ------------------------------------------------------------------------

    public static get Exclude() {
        return ExcludeColumns
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static getMetadata<T extends PolymorphicEntityTarget>(this: T): (
        PolymorphicEntityMetadata
    ) {
        return MetadataHandler.loadMetadata(this) as PolymorphicEntityMetadata
    }

    // ------------------------------------------------------------------------

    public static getRepository<
        T extends PolymorphicRepository<Target> = PolymorphicRepository<
            typeof this
        >,
        Target extends (
            PolymorphicEntityTarget & typeof BasePolymorphicEntity
        ) = any
    >(this: Target): T {
        return this.getMetadata().getRepository() as T
    }

    // ------------------------------------------------------------------------

    public static scope<T extends PolymorphicEntityTarget>(
        this: T & typeof BasePolymorphicEntity,
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

    public static collection<T extends PolymorphicEntityTarget>(
        this: T & typeof BasePolymorphicEntity,
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

    public static build<T extends PolymorphicEntityTarget>(
        this: T,
        attributes: CreationAttributes<InstanceType<T>>
    ): InstanceType<T> {
        return new this(attributes) as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    public static findByPk<T extends PolymorphicEntityTarget>(
        this: T & typeof BasePolymorphicEntity,
        pk: any,
        mapTo: ResultMapOption = 'entity'
    ) {
        return this.getRepository().findByPk(pk, mapTo)
    }

    // ------------------------------------------------------------------------

    public static find<T extends PolymorphicEntityTarget>(
        this: T & typeof BasePolymorphicEntity,
        options: FindQueryOptions<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ) {
        return this.getRepository().find(options, mapTo)
    }

    // ------------------------------------------------------------------------

    public static findOne<T extends PolymorphicEntityTarget>(
        this: T & typeof BasePolymorphicEntity,
        options: FindOneQueryOptions<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ) {
        return this.getRepository().findOne(options, mapTo)
    }

    // ------------------------------------------------------------------------

    public static paginate<T extends PolymorphicEntityTarget>(
        this: T & typeof BasePolymorphicEntity,
        options: PaginationQueryOptions<InstanceType<T>>
    ) {
        this.getRepository().paginate(options)
    }

    // ------------------------------------------------------------------------

    // ------------------------------------------------------------------------

    public static count<T extends EntityTarget>(
        this: T & typeof BaseEntity,
        options: CountQueryOption<InstanceType<T>>
    ): Promise<number> {
        return this.getRepository().count(options)
    }

    // ------------------------------------------------------------------------

    public static countMany<
        T extends EntityTarget,
        Opts extends CountQueryOptions<InstanceType<T>>
    >(
        this: T & typeof BaseEntity,
        options: Opts
    ): Promise<CountManyQueryResult<T, Opts>> {
        return this.getRepository().countMany(options)
    }

    public static create<
        T extends PolymorphicEntityTarget,
        Source extends EntityTarget
    >(
        this: T & typeof BasePolymorphicEntity,
        source: Source,
        attributes: CreationAttributes<InstanceType<Source>>,
        mapTo: 'this' | 'source' = 'this'
    ) {
        return this.getRepository().create(source, attributes, mapTo)
    }

    // ------------------------------------------------------------------------

    public static createMany<
        T extends PolymorphicEntityTarget,
        Source extends EntityTarget
    >(
        this: T & typeof BasePolymorphicEntity,
        source: Source,
        attributes: CreationAttributes<InstanceType<Source>>[],
        mapTo: 'this' | 'source' = 'this'
    ) {
        return this.getRepository().createMany(source, attributes, mapTo)
    }

    // ------------------------------------------------------------------------

    public static update<
        T extends PolymorphicEntityTarget,
        Source extends EntityTarget
    >(
        this: T & typeof BasePolymorphicEntity,
        source: Source,
        attributes: UpdateAttributes<InstanceType<Source>>,
        where: ConditionalQueryOptions<InstanceType<Source>>
    ): Promise<ResultSetHeader> {
        return this.getRepository().update(source, attributes, where) as (
            Promise<ResultSetHeader>
        )
    }

    // ------------------------------------------------------------------------

    public static updateOrCreate<
        T extends PolymorphicEntityTarget,
        Source extends EntityTarget
    >(
        this: T & typeof BasePolymorphicEntity,
        source: Source,
        attributes: UpdateOrCreateAttibutes<InstanceType<Source>>,
        mapTo: 'this' | 'source' = 'this'
    ) {
        return this.getRepository().updateOrCreate(source, attributes, mapTo)
    }

    // ------------------------------------------------------------------------

    public static delete<
        T extends PolymorphicEntityTarget,
        Source extends EntityTarget
    >(
        this: T & typeof BasePolymorphicEntity,
        source: Source,
        where: ConditionalQueryOptions<InstanceType<Source>>
    ): Promise<DeleteResult> {
        return this.getRepository().delete(source, where)
    }

    // Privates --------------------------------------------------------------
    private static reply<T extends PolymorphicEntityTarget>(this: T): T {
        const replic = class extends (this as new (...args: any[]) => any) { }
        Object.assign(replic, this)

        return replic as T
    }
}

export {
    InternalPolymorphicEntities
}