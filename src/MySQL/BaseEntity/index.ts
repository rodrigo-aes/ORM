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
import type { EntityTarget, EntityUnionTarget } from "../../types/General"
import type { EntityProperties } from "../QueryBuilder"

export default abstract class BaseEntity {
    protected hidden: string[] = []

    constructor() {
        ColumnsSnapshots.set(this, this.toJSON())
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.constructor as EntityTarget)
    }

    // ------------------------------------------------------------------------

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

    public async save<T extends BaseEntity>(this: T): Promise<T> {
        Object.assign(
            this,
            await new Repository(this.constructor as EntityTarget)
                .updateOrCreate(this)
        )

        return this
    }

    // ------------------------------------------------------------------------

    public async delete<T extends BaseEntity>(this: T): Promise<void> {
        const primaryName = this.getMetadata().columns.primary.name as (
            keyof T
        )

        await new Repository(this.constructor as EntityTarget)
            .delete({ [primaryName]: this[primaryName] })
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
        const metadata = this.getRelationMetadataByName(name)

        if (!metadata) throw new Error
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
        const metadata = this.getRelationMetadataByName(name)

        if (!metadata) throw new Error
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
        const metadata = this.getRelationMetadataByName(name)

        if (!metadata) throw new Error
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
        const metadata = this.getRelationMetadataByName(name)

        if (!metadata) throw new Error
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
        const metadata = this.getRelationMetadataByName(name)

        if (!metadata) throw new Error
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
        const metadata = this.getRelationMetadataByName(name)

        if (!metadata) throw new Error
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
        const metadata = this.getRelationMetadataByName(name)

        if (!metadata) throw new Error
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
        const metadata = this.getRelationMetadataByName(name)

        if (!metadata) throw new Error
        if (!(metadata instanceof PolymorphicHasManyMetadata)) throw new Error

        return new PolymorphicHasMany(metadata, this, related)
    }

    // ------------------------------------------------------------------------

    protected polymorphicBelongsTo<
        T extends BaseEntity,
        Related extends EntityUnionTarget
    >(
        this: T,
        name: string,
        related: Related
    ): PolymorphicBelongsTo<T, Related> {
        const metadata = this.getRelationMetadataByName(name)

        if (!metadata) throw new Error
        if (!(metadata instanceof PolymorphicBelongsToMetadata)) throw new Error

        return new PolymorphicBelongsTo(metadata, this, related)
    }

    // Privates ---------------------------------------------------------------
    private getRelationMetadataByName(name: string): (
        RelationMetadataType | undefined
    ) {
        return this.getMetadata().relations?.find(
            rel => rel.name === name
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
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

    public static getRepository<
        T extends Repository<Target> = Repository<typeof this>,
        Target extends (EntityTarget & BaseEntity) = any
    >(this: Target): T {
        return this.getMetadata().repository as T
    }

    // ------------------------------------------------------------------------

    public static scope<T extends EntityTarget>(
        this: T & BaseEntity,
        name: string,
        ...args: any[]
    ): T {
        const scope = this.getMetadata().scopes?.getScopeOptions(name, ...args)
        if (!scope) throw new Error

        const scoped = class extends (this as new (...args: any[]) => any) { }

        Object.assign(scoped, this)
        Reflect.defineMetadata('entity-metadata', this.getMetadata(), scoped)
        Reflect.defineMetadata('current-scope', scope, scoped)

        return scoped as T
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

    public static findByPk<T extends EntityTarget>(
        this: T,
        pk: any,
        mapTo: ResultMapOption = 'entity'
    ) {
        return new Repository(this).findByPk(pk, mapTo)
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