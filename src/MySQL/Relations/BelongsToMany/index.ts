import HasManyRelation from "../ManyRelation/HasManyRelation"

// SQL Builders
import {
    BelongsToManyHandlerSQLBuilder,
    type CreationAttributes
} from "../../QueryBuilder"

// Types
import type { EntityTarget } from "../../../types/General"
import type { BelongsToManyMetadata } from "../../Metadata"

export default class BelongsToMany<
    Target extends object,
    Related extends EntityTarget
> extends HasManyRelation<Target, Related> {
    constructor(
        protected metadata: BelongsToManyMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
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

    public attach(...relateds: (InstanceType<Related> | any)[]): (
        Promise<void>
    ) {
        return this.queryExecutionHandler
            .executeVoidOperation(this.sqlBuilder.attachSQL(relateds))
    }

    // ------------------------------------------------------------------------

    public detach(...relateds: (InstanceType<Related> | any)[]): (
        Promise<void>
    ) {
        return this.queryExecutionHandler
            .executeVoidOperation(this.sqlBuilder.detachSQL(relateds))
    }

    // ------------------------------------------------------------------------

    public sync(...relateds: (InstanceType<Related> | any)[]): (
        Promise<void>
    ) {
        return this.queryExecutionHandler
            .executeVoidOperation(this.sqlBuilder.syncSQL(relateds))
    }

    // ------------------------------------------------------------------------

    public syncWithoutDelete(...relateds: (InstanceType<Related> | any)[]): (
        Promise<void>
    ) {
        return this.queryExecutionHandler
            .executeVoidOperation(
                this.sqlBuilder.syncWithoutDeleteSQL(relateds)
            )
    }
}