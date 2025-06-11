import { EntityMetadata, RelationMetadata } from "../../Metadata"

// SQL Builders
import JoinSQLBuilder from "../../QueryBuilder/JoinSQLBuilder"

// Types
import type { EntityTarget } from "../../../types/General"
import type { ConditionalQueryOptions } from "../../QueryBuilder/ConditionalQueryBuilder"

export default class ConditionalQueryJoinsHandler<T extends EntityTarget> {
    protected metadata: EntityMetadata

    public alias: string

    constructor(
        public target: T,
        public conditional: ConditionalQueryOptions<InstanceType<T>>,
        public auxiliarData?: any,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()
    }

    // Instance Methods =======================================================
    public joins(): JoinSQLBuilder<any>[] {
        return Object.entries(this.extractConditionalRelations()).flatMap(
            ([key]) => this.handleJoin(key)
        )
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

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
        metadata: EntityMetadata = this.metadata,
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

        metadata = EntityMetadata.findOrBuild(
            RelationMetadata.extractEntityTarget(relation, this.auxiliarData)
        )

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