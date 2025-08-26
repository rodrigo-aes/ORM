import {
    MetadataHandler,

    type EntityMetadata,
    type PolymorphicEntityMetadata
} from "../../../Metadata"
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

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types/General"

import type { WhereQueryHandler } from "../types"

export default class ExistsQueryBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
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
    public exists<
        Source extends (
            EntityTarget |
            PolymorphicEntityTarget |
            WhereQueryHandler<T>
        )
    >(
        exists: Source,
        conditional: typeof exists extends (
            EntityTarget |
            PolymorphicEntityTarget
        )
            ? WhereQueryHandler<Extract<Source, (
                EntityTarget |
                PolymorphicEntityTarget
            )>>
            : never
    ): this {
        if (
            BaseEntity.prototype.isPrototypeOf(exists.prototype) ||
            BasePolymorphicEntity.prototype.isPrototypeOf(exists.prototype)
        ) {
            const where = new WhereQueryBuilder(
                exists as EntityTarget | PolymorphicEntityTarget,
                this.alias
            );

            (conditional as WhereQueryHandler<(
                EntityTarget |
                PolymorphicEntityTarget
            )>)(where)

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
        (exists as WhereQueryHandler<T>)(where)

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