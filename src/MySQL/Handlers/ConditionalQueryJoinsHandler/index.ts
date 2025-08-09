import { EntityMetadata, EntityUnionMetadata, RelationMetadata } from "../../Metadata"

// SQL Builders
import JoinSQLBuilder from "../../QueryBuilder/JoinSQLBuilder"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"
import type { ConditionalQueryOptions } from "../../QueryBuilder/ConditionalSQLBuilder"

export default class ConditionalQueryJoinsHandler<
    T extends EntityTarget | UnionEntityTarget
> {
    protected metadata: EntityMetadata | EntityUnionMetadata

    public alias: string

    constructor(
        public target: T,
        public conditional: ConditionalQueryOptions<InstanceType<T>>,
        public auxiliarData?: any,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Instance Methods =======================================================
    public joins(): JoinSQLBuilder<any>[] {
        return Object.entries(this.extractConditionalRelations()).flatMap(
            ([key]) => this.handleJoin(key)
        )
    }

    // Privates ---------------------------------------------------------------
    private extractConditionalRelations(): (
        ConditionalQueryOptions<InstanceType<T>>
    ) {
        return this.conditional
            ? Object.fromEntries(Object.entries(this.conditional).flatMap(
                ([key, value]) => key.includes('.')
                    ? [[key, value]]
                    : []
            )) as (
                ConditionalQueryOptions<InstanceType<T>>
            )

            : {}
    }

    // ------------------------------------------------------------------------

    private handleJoin(
        key: string,
        metadata: EntityMetadata | EntityUnionMetadata = this.metadata,
        parentAlias: string = this.alias
    ): JoinSQLBuilder<any> | JoinSQLBuilder<any>[] {
        const [first, second, ...rest] = key.split('.')
        const relation = metadata.relations!.find(
            ({ name }) => name === first
        )!

        const join = new JoinSQLBuilder(
            relation,
            parentAlias,
            {}
        )

        if (rest.length === 0) return join

        metadata = MetadataHandler.loadMetadata(relation.relatedTarget)

        const next = this.handleJoin(
            `${second}.${rest.join('.')}`,
            metadata,
            join.alias
        )

        return [
            join,
            ...Array.isArray(next)
                ? next
                : [next]
        ]
    }
}