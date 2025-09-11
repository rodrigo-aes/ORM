import { EntityMetadata, PolymorphicEntityMetadata } from "../../Metadata"

// Query Builders
import UnionSQLBuilder from "../UnionSQLBuilder"
import SelectSQLBuilder from "../SelectSQLBuilder"
import JoinSQLBuilder from "../JoinSQLBuilder"

import ConditionalSQLBuilder, {
    WhereSQLBuilder
} from "../ConditionalSQLBuilder"

import GroupSQLBuilder from "../GroupSQLBuilder"

// Handlers
import { MetadataHandler, ScopeMetadataHandler } from "../../Metadata"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../types/General"
import type { FindOneQueryOptions } from "./types"
import type { EntityRelationsKeys } from "../types"
import type { RelationOptions, RelationsOptions } from "../JoinSQLBuilder/types"

export default class FindOneSQLBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

    public alias: string

    public unions: UnionSQLBuilder[] = []
    public select: SelectSQLBuilder<T>
    public joins: JoinSQLBuilder<any>[] = []
    public where?: WhereSQLBuilder<T>
    public group?: GroupSQLBuilder<T>


    constructor(
        public target: T,
        public options: FindOneQueryOptions<InstanceType<T>>,
        alias?: string,
        protected primary: boolean = true
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target)

        this.options = ScopeMetadataHandler.applyScope(
            this.target,
            'findOne',
            this.options
        )

        this.select = this.buildSelect()

        if (this.options.relations) this.buildJoins(
            this.options.relations
        )

        this.where = this.buildWhere()
        this.group = this.buildGroup()

        if (this.where) this.mergeUnions(this.where.unions())
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(
            [
                this.primary ? this.unionsSQL() : '',
                this.selectSQL(),
                this.joinsSQL(),
                this.whereSQL(),
                this.groupSQL(),
                this.limitSQL()
            ]
                .join(' ')
        )
    }

    // ------------------------------------------------------------------------

    public unionsSQL(): string {
        const included = new Set<string>()

        return this.unions
            .filter(({ name }) => {
                if (included.has(name)) return false
                included.add(name)

                return true
            })
            .map(union => union.SQL())
            .join(' ')
    }

    // ------------------------------------------------------------------------

    public selectSQL(): string {
        return this.select.SQL()
    }

    // ------------------------------------------------------------------------

    public joinsSQL(): string {
        return this.joins.map(join => join.SQL())
            .join(' ')
    }

    // ------------------------------------------------------------------------

    public whereSQL(): string {
        return this.where?.SQL() ?? ''
    }

    // ------------------------------------------------------------------------

    public groupSQL(): string {
        return this.group?.SQL() ?? ''
    }

    // ------------------------------------------------------------------------

    public limitSQL(): string {
        return 'LIMIT 1'
    }

    // ------------------------------------------------------------------------

    public mergeUnions(unions: UnionSQLBuilder[]): void {
        this.unions.push(...unions)
    }

    // Privates ---------------------------------------------------------------
    private buildSelect(): SelectSQLBuilder<T> {
        return new SelectSQLBuilder(
            this.target,
            this.options.select
        )
    }

    // ------------------------------------------------------------------------

    private buildJoins(
        relations: RelationOptions<any>,
        alias: string = this.alias
    ): void {
        const entries = Object.entries(relations) as [
            EntityRelationsKeys<any>,
            RelationOptions<any>
        ][]

        for (const [name, options] of entries) {
            const relation = this.metadata.relations?.find(
                (rel) => rel.name === name
            )

            if (!relation) throw new Error

            const join = new JoinSQLBuilder(
                relation,
                alias,
                options
            )

            const selectBuilder = join.selectQueryBuilder()
            this.select.merge(selectBuilder)
            this.joins.push(join)

            if (this.group) if (
                Object
                    .keys(this.options.group ?? {})
                    .length === 0
            ) this.group.merge(selectBuilder.groupQueryBuilder())

            if (join.hasTableUnion()) this.unions.push(
                join.tableUnionQueryBuilder()!
            )

            if (relations.relations) this.buildJoins(
                relations.relations,
                join.alias
            )
        }
    }

    // ------------------------------------------------------------------------

    private buildWhere(): WhereSQLBuilder<T> | undefined {
        if (this.options.where) return ConditionalSQLBuilder.where(
            this.target,
            this.options.where,
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    private buildGroup(): GroupSQLBuilder<T> | undefined {
        if (this.options.group) return new GroupSQLBuilder(
            this.target,
            this.options.group,
            this.alias
        )
    }
}

export {
    type FindOneQueryOptions
}