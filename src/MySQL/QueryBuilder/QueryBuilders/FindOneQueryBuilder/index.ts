import { EntityMetadata } from "../../../Metadata"

// SQL Builders
import FindOneSQLBuilder from "../../FindOneSQLBuilder"

// Query Builders
import SelectQueryBuilder from "../SelectQueryBuilder"
import WhereQueryBuilder from "../WhereQueryBuilder"
import JoinQueryBuilder from "../JoinQueryBuilder"
import GroupQueryBuilder from "../GroupQueryBuilder"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type FindOneResult,
    type ResultMapOption
} from "../../../Handlers"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { FindOneQueryOptions as SQLBuilderOptions } from "../../FindOneSQLBuilder"
import type { RelationsOptions } from "../../JoinSQLBuilder/types"
import type { JoinQueryOptions } from "../JoinQueryBuilder"
import type { GroupQueryOptions } from "../../GroupSQLBuilder"

import type {
    FindOneQueryOptions,
    SelectQueryFunction,
    JoinQueryFunction
} from "./types"

import type { EntityProperties, EntityPropertiesKeys } from "../../types"

import type {
    CompatibleOperators,
    OperatorType
} from "../OperatorQueryBuilder"

import type {
    SelectPropertiesOptions,
    SelectCountFunction
} from "../SelectQueryBuilder"

export default class FindOneQueryBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    protected _options: FindOneQueryOptions<T> = {}

    constructor(
        public target: T,
        public alias?: string,
    ) {
        this.metadata = this.loadMetadata()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public select(selectClause: SelectQueryFunction<T>): this {
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
        countClause: SelectCountFunction<T> | string,
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
        if (!this._options.where) this._options.where = new WhereQueryBuilder(
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
        joinClause?: JoinQueryFunction<T>
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
        joinClause?: JoinQueryFunction<T>
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
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    private toSQLBuilder(): FindOneSQLBuilder<T> {
        return new FindOneSQLBuilder(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
    }

    // ------------------------------------------------------------------------

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