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
import type { Target, TargetMetadata } from "../../types"
import type { FindOneQueryOptions } from "./types"
import type { RelationsOptions } from "../JoinSQLBuilder"

export default class FindOneSQLBuilder<T extends Target> {
    protected metadata: TargetMetadata<T>

    public unions: UnionSQLBuilder[] = []
    public select: SelectSQLBuilder<T>
    public joins: JoinSQLBuilder<any>[]
    public where?: WhereSQLBuilder<T>
    public group?: GroupSQLBuilder<T>

    constructor(
        public target: T,
        public options: FindOneQueryOptions<InstanceType<T>>,
        public alias: string = target.name.toLowerCase(),
        protected isMain: boolean = true,
        scope: 'findOne' | 'find' = 'findOne'
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        this.options = ScopeMetadataHandler.applyScope(
            this.target, scope, this.options
        )

        this.select = this.buildSelect()
        this.joins = this.buildJoins()
        this.where = this.buildWhere()
        this.group = this.buildGroup()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(
            [
                this.isMain ? this.unionsSQL() : '',
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
            .filter(
                ({ name }) => included.has(name) ? false : included.add(name)
            )
            .map(union => union.SQL())
            .join(' ')
    }

    // ------------------------------------------------------------------------

    public selectSQL(): string {
        return this.select.SQL()
    }

    // ------------------------------------------------------------------------

    public joinsSQL(): string {
        return this.joins.map(join => join.SQL()).join(' ')
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

    public addUnions(unions: UnionSQLBuilder[]): void {
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
        relations: RelationsOptions<any> | undefined = this.options.relations,
        alias: string = this.alias
    ): JoinSQLBuilder<any>[] {
        return relations
            ? Object.entries(relations).flatMap(([name, options]) => {
                options = typeof options === 'object' ? options : undefined

                const join = new JoinSQLBuilder(
                    this.target,
                    this.metadata.relations.findOrThrow(name),
                    options,
                    alias,
                )

                this.select.merge(join.selectSQLBuilder)
                this.unions.push(...join.unionSQLBuilders)

                return [
                    join,
                    ...this.buildJoins(options?.relations, join.relatedAlias)
                ]
            })
            : []
    }

    // ------------------------------------------------------------------------

    private buildWhere(): WhereSQLBuilder<T> | undefined {
        if (this.options.where) {
            const where = ConditionalSQLBuilder.where(
                this.target,
                this.options.where,
                this.alias
            )

            this.unions.push(...where.unions ?? [])
            return where
        }
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