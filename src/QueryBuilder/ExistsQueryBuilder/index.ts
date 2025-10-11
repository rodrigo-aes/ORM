import { MetadataHandler } from "../../Metadata"
import BaseEntity from "../../BaseEntity"
import BasePolymorphicEntity from "../../BasePolymorphicEntity"

// SQL Builders
import {
    Exists,
    Cross,

    type ExistsQueryOptions,
    type CrossExistsQueryOptions,
    type ConditionalQueryOptions,
} from "../../SQLBuilders"

// Query Builders
import ConditionalQueryHandler from "../ConditionalQueryBuilder"

// Types
import type { Target, TargetMetadata } from "../../types"

import type { WhereQueryHandler } from "../types"

/** @internal */
export default class ExistsQueryBuilder<T extends Target> {

    protected metadata: TargetMetadata<T>

    private _options!: string | (
        ConditionalQueryOptions<InstanceType<T>> &
        CrossExistsQueryOptions
    )

    constructor(
        public target: T,
        public alias?: string
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get options(): ExistsQueryOptions<InstanceType<T>> {
        return { [Exists]: this._options }
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public exists<Source extends Target | WhereQueryHandler<T>>(
        exists: Source,
        conditional: typeof exists extends Target
            ? WhereQueryHandler<Extract<Source, Target>>
            : never
    ): this {
        if (this.asTarget(exists)) {
            const where = new ConditionalQueryHandler(
                exists as Target,
                this.alias
            );

            (conditional as WhereQueryHandler<Target>)(where)

            const opt = {
                target: exists,
                where: where.toQueryOptions()
            }

            if ((this._options as CrossExistsQueryOptions)[Cross]) (
                (this._options as CrossExistsQueryOptions)[Cross]?.push(opt)
            );

            (this._options as CrossExistsQueryOptions)[Cross] = [opt]

            return this
        }

        const where = new ConditionalQueryHandler(this.target, this.alias);
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

    // Privates ---------------------------------------------------------------
    private asTarget(target: Function): boolean {
        return (
            target.prototype instanceof BaseEntity ||
            target.prototype instanceof BasePolymorphicEntity
        )
    }
}