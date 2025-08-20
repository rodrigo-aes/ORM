import { EntityMetadata, PolymorphicEntityMetadata } from "../../../Metadata"
import BaseEntity from "../../../BaseEntity"
import BasePolymorphicEntity from "../../../BasePolymorphicEntity"

// SQL Builders
import {
    Exists,
    Cross,

    type ExistsQueryOptions,
    type CrossExistsQueryOptions,
    type ConditionalQueryOptions,
} from "../../ConditionalSQLBuilder"

// Query Builders
import WhereQueryBuilder from "../WhereQueryBuilder"

// Handlers
import { MetadataHandler } from "../../../Metadata"

// Types
import type {
    EntityTarget
} from "../../../../types/General"

import type { WhereQueryFunction } from "../FindOneQueryBuilder/types"

export default class ExistsQueryBuilder<
    T extends EntityTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata
    private _options!: string | (
        ConditionalQueryOptions<InstanceType<T>> &
        CrossExistsQueryOptions
    )

    constructor(
        public target: T,
        public alias?: string
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get options(): ExistsQueryOptions<InstanceType<T>> {
        return { [Exists]: this._options }
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public exists<Source extends EntityTarget | WhereQueryFunction<T>>(
        exists: Source,
        conditional: typeof exists extends EntityTarget
            ? WhereQueryFunction<Source>
            : never
    ): this {
        if (
            BaseEntity.prototype.isPrototypeOf(exists.prototype) ||
            BasePolymorphicEntity.prototype.isPrototypeOf(exists.prototype)
        ) {
            const where = new WhereQueryBuilder(
                exists as EntityTarget,
                this.alias
            )

            conditional(where)
            const opt = {
                target: exists,
                where: where.toQueryOptions()
            }

            if ((this._options as CrossExistsQueryOptions)[Cross]) (
                (this._options as CrossExistsQueryOptions
                )[Cross]?.push(opt)
            );

            (this._options as CrossExistsQueryOptions)[Cross] = [opt]
            return this
        }

        const where = new WhereQueryBuilder(this.target, this.alias);
        (exists as WhereQueryFunction<T>)(where)

        this._options = {
            ...(this._options as ExistsQueryOptions<T>),
            ...where.toQueryOptions()
        }

        return this
    }

    // ------------------------------------------------------------------------

    public toQueryOptions(): ExistsQueryOptions<InstanceType<T>> {
        return this.options
    }
}