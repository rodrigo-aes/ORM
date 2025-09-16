import {
    MetadataHandler,

    type EntityMetadata,
    type PolymorphicEntityMetadata
} from "../../Metadata"

// SQL Builders
import {
    FindOneSQLBuilder,

    type FindOneQueryOptions as SQLBuilderOptions,
    type RelationsOptions,
    type GroupQueryOptions,
    type EntityProperties,
    type EntityPropertiesKeys,
} from "../../SQLBuilders"

// Query Builders
import SelectQueryBuilder from "../SelectQueryBuilder"
import ConditionalQueryHandler from "../ConditionalQueryBuilder"
import JoinQueryBuilder from "../JoinQueryBuilder"
import GroupQueryBuilder from "../GroupQueryBuilder"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type FindOneResult,
    type ResultMapOption
} from "../../Handlers"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types/General"

import type { JoinQueryOptions } from "../JoinQueryBuilder"
import type { FindOneQueryOptions } from "./types"

import type {
    SelectQueryHandler,
    CountQueryHandler,
    JoinQueryHandler
} from "../types"

import type {
    CompatibleOperators,
    OperatorType
} from "../OperatorQueryBuilder"

import type { SelectPropertiesOptions } from "../SelectQueryBuilder"

export default class FindOneQueryBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

    protected _options: FindOneQueryOptions<T> = {}

    constructor(
        public target: T,
        public alias?: string,
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public select(selectClause: SelectQueryHandler<T>): this {
        this._options.select = new SelectQueryBuilder(
            this.target,
            this.alias
        )

        selectClause(this._options.select)

        return this
    }

    // ------------------------------------------------------------------------

    public properties(...properties: SelectPropertiesOptions<T>[]): this {
        if (!this._options.select) this._options.select = (
            new SelectQueryBuilder(this.target, this.alias)
        )

        this._options.select.properties(...properties)

        return this
    }

    // ------------------------------------------------------------------------

    public count(
        countClause: CountQueryHandler<T> | string,
        as?: string
    ): this {
        if (!this._options.select) this._options.select = (
            new SelectQueryBuilder(this.target, this.alias)
        )

        this._options.select.count(countClause, as)

        return this
    }

    // ------------------------------------------------------------------------

    public where<
        K extends EntityPropertiesKeys<InstanceType<T>>,
        Cond extends (
            EntityProperties<InstanceType<T>>[K] |
            CompatibleOperators<EntityProperties<InstanceType<T>>[K]>
        )
    >(
        propertie: K | string,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): this {
        if (!this._options.where) this._options.where = new ConditionalQueryHandler(
            this.target, this.alias
        )

        this._options.where.where(propertie, conditional, value)

        return this
    }

    // ------------------------------------------------------------------------

    public and = this.where

    // ------------------------------------------------------------------------

    public or(): this {
        if (!this._options.where) throw new Error
        this._options.where.or()

        return this
    }

    // ------------------------------------------------------------------------

    public orWhere<
        K extends EntityPropertiesKeys<InstanceType<T>>,
        Cond extends (
            EntityProperties<InstanceType<T>>[K] |
            CompatibleOperators<EntityProperties<InstanceType<T>>[K]>
        )
    >(
        propertie: K | string,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): this {
        if (!this._options.where) throw new Error

        this._options.where.orWhere(
            propertie,
            conditional,
            value
        )

        return this
    }

    // ------------------------------------------------------------------------

    public innerJoin<T extends EntityTarget>(
        related: T,
        joinClause?: JoinQueryHandler<T>
    ): this {
        const [name, target] = this.handleRelated(related)
        const handler = new JoinQueryBuilder(
            target,
            this.alias,
            true
        )

        if (joinClause) joinClause(handler)
        this._options.relations![name] = handler

        return this
    }

    // ------------------------------------------------------------------------

    public leftJoin<T extends EntityTarget>(
        related: T,
        joinClause?: JoinQueryHandler<T>
    ): this {
        const [name, target] = this.handleRelated(related)
        const handler = new JoinQueryBuilder(
            target,
            this.alias,
            false
        )

        if (joinClause) joinClause(handler)
        this._options.relations![name] = handler

        return this
    }

    // ------------------------------------------------------------------------

    public groupBy(...columns: GroupQueryOptions<InstanceType<T>>): this {
        this._options.group = new GroupQueryBuilder(this.target, this.alias)
            .groupBy(...columns)

        return this
    }

    // ------------------------------------------------------------------------

    public exec<MapTo extends ResultMapOption>(mapTo: MapTo): (
        Promise<FindOneResult<T, MapTo>>
    ) {
        return new MySQL2QueryExecutionHandler(
            this.target,
            this.toSQLBuilder(),
            mapTo
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return this.toSQLBuilder().SQL()
    }

    // ------------------------------------------------------------------------

    public toQueryOptions(): SQLBuilderOptions<InstanceType<T>> {
        const { select, where, group } = this._options

        return {
            select: select?.toQueryOptions(),
            where: where?.toQueryOptions(),
            relations: this.relationsToOptions(),
            group: group?.toQueryOptions(),
        }
    }

    // Protecteds -------------------------------------------------------------
    protected toSQLBuilder(): FindOneSQLBuilder<T> {
        return new FindOneSQLBuilder(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    protected relationsToOptions(): (
        RelationsOptions<InstanceType<T>> | undefined
    ) {
        if (!this._options.relations) return

        return Object.fromEntries(
            Object.entries(this._options.relations).map(
                ([name, value]) => [
                    name,
                    typeof value === 'boolean'
                        ? value
                        : (value as JoinQueryBuilder<any>).toQueryOptions()
                ]
            )
        ) as (
                RelationsOptions<InstanceType<T>>
            )
    }

    // Privates ---------------------------------------------------------------
    private handleRelated<Target extends EntityTarget>(
        related: Target
    ): [keyof JoinQueryOptions<T>, Target] {
        const rel = typeof related === 'string'
            ? this.metadata.relations?.find(
                ({ name }) => name === related
            )
            : this.metadata.relations?.find(
                ({ relatedTarget }) => relatedTarget === related
            )

        if (rel) return [
            rel.name as keyof JoinQueryOptions<T>,
            rel.relatedTarget as Target
        ]

        throw new Error
    }
}

export {
    type FindOneQueryOptions
}