import {
    MetadataHandler,

    type EntityMetadata,
    type PolymorphicEntityMetadata
} from "../../Metadata"

// Query Handlers
import SelectQueryBuilder from "../SelectQueryBuilder"
import WhereQueryBuilder from "../WhereQueryBuilder"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types/General"

import type {
    RelationOptions,
    RelationsOptions
} from "../../SQLBuilders"

import type {
    JoinQueryOptions,
    JoinQueryClause,
} from "./types"

import type {
    SelectQueryHandler,
    WhereQueryHandler,
    JoinQueryHandler
} from "../types"

export default class JoinQueryBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

    private _options: JoinQueryClause<T> = {
        relations: {}
    }

    constructor(
        public target: T,
        public alias?: string,
        required?: boolean
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
        this._options.required = required
    }

    // Instace Methods ========================================================
    // Publics ----------------------------------------------------------------
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

    public select(selectClause: SelectQueryHandler<T>): this {
        this._options.select = new SelectQueryBuilder(
            this.target,
            this.alias
        )

        selectClause(this._options.select)

        return this
    }

    // ------------------------------------------------------------------------

    public on(onClause: WhereQueryHandler<T>): this {
        this._options.on = new WhereQueryBuilder(
            this.target,
            this.alias
        )

        onClause(this._options.on)

        return this
    }

    // ------------------------------------------------------------------------

    public toQueryOptions(): RelationOptions<InstanceType<T>> {
        const { required, select, on } = this._options

        return {
            required,
            select: select?.toQueryOptions(),
            on: on?.toQueryOptions(),
            relations: this.relationsToOptions()
        }
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

    // ------------------------------------------------------------------------

    private relationsToOptions(): (
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

}

export {
    type JoinQueryOptions
}