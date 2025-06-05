import { EntityMetadata } from "../../../Metadata"

// Query Handlers
import SelectQueryHandler from "../SelectQueryHandler"
import WhereQueryHandler from "../WhereQueryHandler"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { RelationOptions, RelationsOptions } from "../../JoinSQLBuilder/types"
import type {
    JoinQueryOptions,
    JoinQueryClause,
    SelectQueryFunction,
    OnQueryFunction,
    JoinQueryFunction,
} from "./types"

export default class JoinQueryHandler<T extends EntityTarget> {
    protected metadata: EntityMetadata

    private _options: JoinQueryClause<T> = {
        relations: {}
    }

    constructor(
        public target: T,
        public alias?: string,
        required?: boolean
    ) {
        this.metadata = this.loadMetadata()
        this._options.required = required
    }

    // Instace Methods ========================================================
    // Publics ----------------------------------------------------------------
    public innerJoin<T extends EntityTarget>(
        related: T,
        joinClause?: JoinQueryFunction<T>
    ): this {
        const [name, target] = this.handleRelated(related)
        const handler = new JoinQueryHandler(
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
        const handler = new JoinQueryHandler(
            target,
            this.alias,
            false
        )

        if (joinClause) joinClause(handler)
        this._options.relations![name] = handler

        return this
    }

    // ------------------------------------------------------------------------

    public select(selectClause: SelectQueryFunction<T>): this {
        this._options.select = new SelectQueryHandler(
            this.target,
            this.alias
        )

        selectClause(this._options.select)

        return this
    }

    // ------------------------------------------------------------------------

    public on(onClause: OnQueryFunction<T>): this {
        this._options.on = new WhereQueryHandler(
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
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.target)
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
                        : (value as JoinQueryHandler<any>).toQueryOptions()
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