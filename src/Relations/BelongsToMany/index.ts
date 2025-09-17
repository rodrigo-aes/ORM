import HasManyRelation from "../ManyRelation/HasManyRelation"

// SQL Builders
import {
    BelongsToManyHandlerSQLBuilder,
    type CreationAttributes
} from "../../SQLBuilders"

// Types
import type { EntityTarget } from "../../types/General"
import type { BelongsToManyMetadata } from "../../Metadata"

/** HasMany relation handler */
export default class BelongsToMany<
    Target extends object,
    Related extends EntityTarget
> extends HasManyRelation<Target, Related> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: BelongsToManyMetadata,

        /** @internal */
        protected target: Target,

        /** @internal */
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected get sqlBuilder(): (
        BelongsToManyHandlerSQLBuilder<Target, Related>
    ) {
        return new BelongsToManyHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override async create(
        attributes: CreationAttributes<InstanceType<Related>>
    ): Promise<InstanceType<Related>> {
        const entity = await super.create(attributes)

        await this.queryExecutionHandler
            .executeVoidOperation(
                ...this.sqlBuilder.createForeingKeysSQL(entity)
            )

        return entity
    }

    // ------------------------------------------------------------------------

    public override async createMany(
        attributes: CreationAttributes<InstanceType<Related>>[]
    ): Promise<InstanceType<Related>[]> {
        const entities = await super.createMany(attributes)

        await this.queryExecutionHandler
            .executeVoidOperation(
                ...this.sqlBuilder.createForeingKeysSQL(entities)
            )

        return entities
    }

    // ------------------------------------------------------------------------

    /**
     * Attach relations on join table to relateds passed
     * @param relateds - Array of related entity instance or primary key
     */
    public attach(...relateds: (InstanceType<Related> | any)[]): (
        Promise<void>
    ) {
        return this.queryExecutionHandler
            .executeVoidOperation(this.sqlBuilder.attachSQL(relateds))
    }

    // ------------------------------------------------------------------------

    /**
     * Datach relations on join table to relateds passed
     * @param relateds - Array of related entity instance or primary key
     */
    public detach(...relateds: (InstanceType<Related> | any)[]): (
        Promise<void>
    ) {
        return this.queryExecutionHandler
            .executeVoidOperation(this.sqlBuilder.detachSQL(relateds))
    }

    // ------------------------------------------------------------------------

    /**
     * Syncronize all attachs and detachs keeping only in relateds array
     * @param relateds - Array of related entity instance or primary key
     */
    public sync(...relateds: (InstanceType<Related> | any)[]): (
        Promise<void>
    ) {
        return this.queryExecutionHandler
            .executeVoidOperation(this.sqlBuilder.syncSQL(relateds))
    }
}