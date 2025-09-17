import { MetadataHandler } from "../../Metadata"

// Query Handlers
import SelectQueryBuilder from "../SelectQueryBuilder"
import ConditionalQueryHandler from "../ConditionalQueryBuilder"

// Types
import type {
    Target,
    TargetMetadata,
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types/General"

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
    OnQueryHandler,
    JoinQueryHandler
} from "../types"

/**
 * Build `JOIN` options
 */
export default class JoinQueryBuilder<T extends Target> {
    /** @internal */
    protected metadata: TargetMetadata<T>

    /** @internal */
    private _options: JoinQueryClause<T> = {
        relations: {}
    }

    /** @internal */
    constructor(
        /** @internal */
        public target: T,

        /** @internal */
        public alias?: string,

        required?: boolean
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
        this._options.required = required
    }

    // Instace Methods ========================================================
    // Publics ----------------------------------------------------------------
    /**
     * Add required to current entity `INNER JOIN` to query options
     * @param related - Related entity target
     * @param joinClause - Join query handler
     * @returns {this} - `this`
     */
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

    /**
     * Add optional to current entity `LEFT JOIN` to query options
     * @param related - Related entity target
     * @param joinClause - Join query handler
     * @returns {this} - `this`
     */
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

    /**
     * Handle select options to related join entity
     * @param selectClause - Select query handler
     * @returns {this} - `this`
     */
    public select(selectClause: SelectQueryHandler<T>): this {
        this._options.select = new SelectQueryBuilder(
            this.target,
            this.alias
        )

        selectClause(this._options.select)

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define conditional `ON` clause to options
     * @param onClause - On query handler
     * @returns {this} - `this`
     */
    public on(onClause: OnQueryHandler<T>): this {
        this._options.on = new ConditionalQueryHandler(
            this.target,
            this.alias
        )

        onClause(this._options.on)

        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `RelationOptions` object
    * @returns - A object with relation options
    */
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
    /** @internal */
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

    /** @internal */
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