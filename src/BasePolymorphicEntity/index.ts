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
import { PolymorphicColumn } from "../Decorators"

// Handlers
import { PolymorphicEntityBuilder } from "../Handlers"

// Types
import type {
    PolymorphicEntityTarget,
    EntityTarget,
    LocalOrInternalPolymorphicEntityTarget,
    Constructor,
    EntityProperties
} from "../types"
import type BaseEntity from "../BaseEntity"
import type { SourceEntity } from "./types"
import type { UnionEntitiesMap } from "../Metadata"
import type { ResultSetHeader } from "mysql2"
import type { ResultMapOption, DeleteResult } from "../Handlers"
import type {
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

// Exceptions
import PolyORMException from "../Errors"

/**
 * All polymorphic entities needs to extends BaseEntity class
 * @example
* class Authenticable extends BasePolymorphicEntity<[User, Admin]> {}
*/

export default abstract class BasePolymorphicEntity<Targets extends object[]> {
    /**
     * Entity primary key
     */
    public primaryKey: any

    /**
     * Entity type
     */
    public entityType!: string

    constructor(properties?: any) {
        if (properties) Object.assign(this, properties)
        this.getTrueMetadata().computedProperties?.assign(this)

        ColumnsSnapshots.set(this, this.toJSON())
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entities(): UnionEntitiesMap {
        return this.getTrueMetadata().entities
    }

    // Protecteds -------------------------------------------------------------
    /**
     * An array of properties keys that must be hidden in JSON
     */
    protected get hidden(): string[] {
        return []
    }

    // ------------------------------------------------------------------------

    /**
     * An array of properties keys that must be included in JSON
     */
    protected get include(): string[] {
        return []
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Get polymorphic entity metadata
     */
    public getMetadata() {
        return this.getTrueMetadata().toJSON()
    }

    // ------------------------------------------------------------------------
    /**
     * Get a instance of polymorphic entity repository
     */
    public getRepository<
        T extends PolymorphicRepository<Constructor<this>> = (
            PolymorphicRepository<Constructor<this>>
        )
    >(): T {
        return this.getTrueMetadata().getRepository() as T
    }

    // ------------------------------------------------------------------------
    /**
     * Get a instance of polymorphic entity query builder
     */
    public getQueryBuilder<T extends PolymorphicEntityTarget>(
        this: T
    ): PolymorphicEntityQueryBuilder<T> {
        return new PolymorphicEntityQueryBuilder(this)
    }

    // ------------------------------------------------------------------------
    /**
     * Make as JSON object of entity properties
     * @returns - A object with included properties and without hidden
     * properties
     */
    public toJSON<T extends BasePolymorphicEntity<Targets>>(this: T): (
        EntityProperties<T>
    ) {
        const json = Object.fromEntries(this.getTrueMetadata().columns
            .map(({ name }) => [name, this[name as keyof typeof this]])) as (
                EntityProperties<T>
            )

        return this.hide(json)
    }

    // ------------------------------------------------------------------------
    /**
     * Hidde entity hidden properties
     * @param json - Optional data to make hidden
     * @returns A object without hidden properties
    */
    public hide<T extends BasePolymorphicEntity<Targets>>(
        this: T, json?: EntityProperties<T>
    ): EntityProperties<T> {
        if (!json) json = this.toJSON()
        for (const key of this.hidden) delete json[key as keyof typeof json]

        return json
    }

    // ------------------------------------------------------------------------
    /**
     * Fill entity properties with a data object
     * @returns {this} - Same entity instance
     */
    public fill<T extends BasePolymorphicEntity<Targets>>(
        this: T,
        data: Partial<EntityProperties<T>>
    ): T {
        Object.assign(this, data)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Convert current polymorphic instance to source entity instance
     * @returns - A original entity instance
     */
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

    /**
     * Update or create a register of the source entity in database and return
     * the current polymorphic instance
     * @returns - Same polymorhic instance
     */
    public async save<T extends BasePolymorphicEntity<any>>(this: T): (
        Promise<T>
    ) {
        return this.fill(await this.getRepository().updateOrCreate(
            this.entities[this.entityType] as EntityTarget,
            this,
        ))
    }

    // ------------------------------------------------------------------------

    /**
     * Update the register of the source entity in database and returns the
     * current polymorphic instance
     * @param attributes - Update attributes data
     * @returns - Same polymorphic instance
     */
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

    /**
     * Delete the register of the source entity in database
     */
    public async delete<T extends BasePolymorphicEntity<any>>(this: T) {
        await this.getRepository().delete(this.entities[this.entityType], this)
    }

    // Protecteds -------------------------------------------------------------
    /**
     * Create a instance of HasOneHandler class for current instance and
     * related
     * @param name - Relation name
     * @param related - Related entity
     * @returns {HasOne<T, Related>} - HasOneHandler instance
     */
    protected hasOne<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): HasOne<T, Related> {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof HasOneMetadata)) throw (
            PolyORMException.Metadata.instantiate(
                'INVALID_RELATION', metadata.type, name, 'HasOne'
            )
        )

        return new HasOne(metadata, target, related) as HasOne<T, Related>
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of HasManyHandler class for current instance and
     * related
     * @param name - Relation name
     * @param related - Related entity
     * @returns {HasMany<T, Related>} - HasManyHandler instance
     */
    protected hasMany<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): HasMany<T, Related> {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof HasManyMetadata)) throw (
            PolyORMException.Metadata.instantiate(
                'INVALID_RELATION', metadata.type, name, 'HasMany'
            )
        )

        return new HasMany(metadata, target, related) as HasMany<T, Related>
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of BelongsToHandler class for current instance and
     * related
     * @param name - Relation name
     * @param related - Related entity
     * @returns {BelongsTo<T, Related>} - BelongsToHandler instance
     */
    protected belongsTo<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): BelongsTo<T, Related> {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof BelongsToMetadata)) throw (
            PolyORMException.Metadata.instantiate(
                'INVALID_RELATION', metadata.type, name, 'BelongsTo'
            )
        )

        return new BelongsTo(metadata, target, related) as BelongsTo<
            T,
            Related
        >
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of HasOneThroughHandler class for current instance and
     * related (Note: hasOneThrough method doesn't need through entity)
     * @param name - Relation name
     * @param related - Related entity
     * @returns {HasOneThrough<T, Related>} - HasOneThroughHandler instance
    */
    protected hasOneThrough<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): HasOneThrough<T, Related> {
        const [metadata] = this.getRelationMetadata(name)
        if (!(metadata instanceof HasOneThroughMetadata)) throw (
            PolyORMException.Metadata.instantiate(
                'INVALID_RELATION', metadata.type, name, 'HasOneThrough'
            )
        )

        return new HasOneThrough(metadata, this, related) as HasOneThrough<
            T,
            Related
        >
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of HasManyThroughHandler class for current instance
     * and related (Note: hasManyThrough method doesn't need through entity)
     * @param name - Relation name
     * @param related - Related entity
     * @returns {HasManyThrough<T, Related>} - HasManyThroughHandler instance
     */
    protected hasManyThrough<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): HasManyThrough<T, Related> {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof HasManyThroughMetadata)) throw (
            PolyORMException.Metadata.instantiate(
                'INVALID_RELATION', metadata.type, name, 'HasManyThrough'
            )
        )

        return new HasManyThrough(metadata, target, related) as HasManyThrough<
            T,
            Related
        >
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of BelongsToManyHandler class for current instance and
     * related
     * @param name - Relation name
     * @param related - Related entity
     * @returns {BelongsToMany<T, Related>} - BelongsToManyHandler instance
     */
    protected belongsToMany<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): BelongsToMany<T, Related> {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof BelongsToManyMetadata)) throw (
            PolyORMException.Metadata.instantiate(
                'INVALID_RELATION', metadata.type, name, 'BelongsToMany'
            )
        )

        return new BelongsToMany(metadata, target, related) as BelongsToMany<
            T,
            Related
        >
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of PolymporhicHasOneHandler class for current instance
     * and related
     * @param name - Relation name
     * @param related - Related entity
     * @returns {PolymporhicHasOne<T, Related>} - PolymporhicHasOneHandler
     * instance
     */
    protected polymorphicHasOne<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): PolymorphicHasOne<T, Related> {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof PolymorphicHasOneMetadata)) throw (
            PolyORMException.Metadata.instantiate(
                'INVALID_RELATION', metadata.type, name, 'PolymorphicHasOne'
            )
        )

        return new PolymorphicHasOne(metadata, target, related) as (
            PolymorphicHasOne<T, Related>
        )
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of PolymporhicManyOneHandler class for current
     * instance and related
     * @param name - Relation name
     * @param related - Related entity
     * @returns {PolymporhicManyOne<T, Related>} - PolymporhicManyOneHandler
     * instance
     */
    protected polymorphicHasMany<
        T extends PolymorphicEntityTarget,
        Related extends EntityTarget
    >(
        this: T & BasePolymorphicEntity<any>,
        name: string,
        related: Related
    ): PolymorphicHasMany<T, Related> {
        const [metadata, target] = this.getRelationMetadata(name)
        if (!(metadata instanceof PolymorphicHasManyMetadata)) throw (
            PolyORMException.Metadata.instantiate(
                'INVALID_RELATION', metadata.type, name, 'PolymorphicHasMany'
            )
        )

        return new PolymorphicHasMany(metadata, target, related) as (
            PolymorphicHasMany<T, Related>
        )
    }

    // ------------------------------------------------------------------------
    /**
     * Create a instance of PolymporhicBelongsToHandler class for current
     * instance and relateds
     * @param name - Relation name
     * @param related - Related entities or a PolymorphicEntity
     * @returns {PolymporhicBelongsTo<T, Related>} - 
     * PolymporhicBelongsToHandler instance
     */
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
            PolyORMException.Metadata.instantiate(
                'INVALID_RELATION', metadata.type, name, 'PolymorphicBelongsTo'
            )
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
    /** @internal */
    private getTrueMetadata(): PolymorphicEntityMetadata {
        return MetadataHandler.targetMetadata(
            this.constructor as PolymorphicEntityTarget
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private getTrueSourceMetadata(): EntityMetadata {
        return MetadataHandler.targetMetadata(this.entities[this.entityType])
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private getRelationMetadata(name: string): (
        [RelationMetadataType, this | BaseEntity]
    ) {
        let meta = this.getTrueMetadata().relations.search(name)
            ?? this.getTrueSourceMetadata().relations.findOrThrow(name)

        return [
            meta,
            this instanceof meta.target ? this : this.toSourceEntity()
        ]
    }

    // Static Getters =========================================================
    // Decorators -------------------------------------------------------------
    /**
     * Define polymorphic column decorator
     */
    public static get Column() {
        return PolymorphicColumn
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Get polymorphic entity metadata
     */
    public static getMetadata<T extends PolymorphicEntityTarget>(
        this: T & typeof BasePolymorphicEntity
    ) {
        return this.getTrueMetadata().toJSON()
    }

    // ------------------------------------------------------------------------
    /**
     * Get a instance of polymorphic entity repository
     */
    public static getRepository<
        T extends PolymorphicRepository<Target> = PolymorphicRepository<
            typeof this
        >,
        Target extends (
            PolymorphicEntityTarget & typeof BasePolymorphicEntity
        ) = any
    >(this: Target): T {
        return this.getTrueMetadata().getRepository() as T
    }

    // ------------------------------------------------------------------------
    /**
     * Get a instance of polymorphic entity query builder
     */
    public static getQueryBuilder<T extends PolymorphicEntityTarget>(
        this: T
    ): PolymorphicEntityQueryBuilder<T> {
        return new PolymorphicEntityQueryBuilder(this)
    }

    // ------------------------------------------------------------------------

    /**
     * Apply scope to polymorphic entity
     * @param name - Scope name
     * @param args - Scope args
     * @returns - Scoped static polymorphic entity
     */
    public static scope<T extends PolymorphicEntityTarget>(
        this: T & typeof BasePolymorphicEntity,
        name: string,
        ...args: any[]
    ): T {
        const scope = this.getTrueMetadata().scopes?.getScope(name, ...args)
        if (!scope) throw PolyORMException.Metadata.instantiate(
            "UNKNOWN_SCOPE", name, this.name
        )

        const scoped = this.reply()
        TempMetadata.reply(scoped, this).setScope(scoped, scope)

        return scoped as T
    }

    // ------------------------------------------------------------------------

    /**
     * Scope polymorphic entity collection 
     * @param collection - Collection name or constructor
     * @returns - Scoped static polymorphic entity
     */
    public static collection<T extends PolymorphicEntityTarget>(
        this: T & typeof BasePolymorphicEntity,
        collection: string | typeof Collection
    ): T {
        const coll: typeof Collection = typeof collection === 'object'
            ? collection
            : this.getTrueMetadata().collections?.search(collection as string)

        if (!coll) throw PolyORMException.Metadata.instantiate(
            'UNKNOWN_COLLECTION', collection, this.name
        )

        const scoped = this.reply()
        TempMetadata.reply(scoped, this).setCollection(scoped, coll)

        return scoped as T
    }

    // ------------------------------------------------------------------------

    /**
     * Build a instance of polymorphic entity with attributes data
     * @param attributes - Entity attributes
     * @returns - Polymorphic entity instance
     */
    public static build<T extends PolymorphicEntityTarget>(
        this: T,
        attributes: CreationAttributes<InstanceType<T>>
    ): InstanceType<T> {
        return new this(attributes) as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    /**
     * Search a register in database and return a polymorphic 
     * entity instance case finded
     * @param pk - Entity primary key
     * @param mapTo - Switch data mapped return
     * @default - 'entity'
     * @returns - Entity instance or `null`
     */
    public static findByPk<T extends PolymorphicEntityTarget>(
        this: T & typeof BasePolymorphicEntity,
        pk: any,
        mapTo: ResultMapOption = 'entity'
    ) {
        return this.getRepository().findByPk(pk, mapTo)
    }

    // ------------------------------------------------------------------------

    /**
    *  Search all register matched by options in database
    * @param options - Find options
    * @param mapTo @param mapTo - Switch data mapped return
    * @default 'entity'
    * @returns - A polymorphic entity instance collection
    */
    public static find<T extends PolymorphicEntityTarget>(
        this: T & typeof BasePolymorphicEntity,
        options: FindQueryOptions<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ) {
        return this.getRepository().find(options, mapTo)
    }

    // ------------------------------------------------------------------------

    /**
    *  Search the first register matched by options in database
    * @param options - Find one options
    * @param mapTo @param mapTo - Switch data mapped return
    * @default 'entity'
    * @returns - A polymorphic entity instance or `null`
    */
    public static findOne<T extends PolymorphicEntityTarget>(
        this: T & typeof BasePolymorphicEntity,
        options: FindOneQueryOptions<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ) {
        return this.getRepository().findOne(options, mapTo)
    }

    // ------------------------------------------------------------------------

    /**
    *  Search all register matched by options in database and paginate
    * @param options - Find options
    * @param mapTo @param mapTo - Switch data mapped return
    * @default 'entity'
    * @returns - A polymorphic entity instance pagination collection
    */
    public static paginate<T extends PolymorphicEntityTarget>(
        this: T & typeof BasePolymorphicEntity,
        options: PaginationQueryOptions<InstanceType<T>>
    ) {
        this.getRepository().paginate(options)
    }

    // ------------------------------------------------------------------------

    /**
     * Count database registers matched by options
     * @param options - Count options
     * @returns - The count number result
     */
    public static count<T extends EntityTarget>(
        this: T & typeof BaseEntity,
        options: CountQueryOption<InstanceType<T>>
    ): Promise<number> {
        return this.getRepository().count(options)
    }

    // ------------------------------------------------------------------------

    /**
     * Make multiple count database registers matched by options
     * @param options - A object containing the count name key and count
     * options value
     * @returns - A object with count names keys and count results
     */
    public static countMany<
        T extends EntityTarget,
        Opts extends CountQueryOptions<InstanceType<T>>
    >(
        this: T & typeof BaseEntity,
        options: Opts
    ): Promise<CountManyQueryResult<T, Opts>> {
        return this.getRepository().countMany(options)
    }

    // ------------------------------------------------------------------------

    /**
     * Create a source entity register in database and returns a polymorphic 
     * entity instance of created register
     * @param source - Source entity
     * @param attributes - Creation attributes data
     * @param mapTo - Return options map to case `this` returns a instance of 
     * polymorphic entity case `source` returns a instance of source entity 
     * @returns - Source or polymorphic entity instance
     */
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

    /**
     * Create many resgisters in database and return a polymorphic or source 
     * entity instances collection for created resgiters
     * @param source - Source entity
     * @param attributes - An array list for each register source entity 
     * creation attributes
     * @param mapTo - Return options map to case `this` returns a collection
     * of polymorphic entities instances case `source` returns a 
     * collection of source entities instances 
     * @returns - A collection of source or polymorphic entities instances
     */
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

    /**
     * Update all resgisters matched by conditional where optionsof the source 
     * entity in database with the data attributes
     * @param source - Source entity
     * @param attributes - Update attributes data
     * @param where - Conditional where options
     * @returns - A result header of the affected registers
     */
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

    /**
     * Update a existent source entity register matched by attributes data or 
     * create a new 
     * @param source - Source entity
     * @param attributes - Update or create attributes data
     * @param mapTo - Return options map to case `this` returns a instance of 
     * polymorphic entity case `source` returns a instance of source entity 
     * @returns - A polymorphic or source entity instance for updated or 
     * created register
     */
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

    /**
     * Delete all source entity registers matched by conditional where 
     * options in database
     * @param source  - Source entity
     * @param where - Conditional where options
     * @returns - A result header of the affected register in database
     */
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

    // Privates ---------------------------------------------------------------
    /** @internal */
    private static getTrueMetadata<T extends PolymorphicEntityTarget>(
        this: T
    ): PolymorphicEntityMetadata {
        return MetadataHandler.targetMetadata(this)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private static reply<T extends PolymorphicEntityTarget>(this: T): T {
        const replic = class extends (this as new (...args: any[]) => any) { }
        Object.assign(replic, this)

        return replic as T
    }
}

export {
    InternalPolymorphicEntities
}