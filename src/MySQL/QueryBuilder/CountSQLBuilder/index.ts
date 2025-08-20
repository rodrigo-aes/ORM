import { type EntityMetadata, PolymorphicEntityMetadata } from "../../Metadata"

// SQL Builders
import CountSQL from "./CountSQL"
import UnionSQLBuilder from "../UnionSQLBuilder"

// Handlers
import { MetadataHandler } from "../../Metadata"
import { ConditionalQueryJoinsHandler } from "../../Handlers"

// Symbols
import { Case } from "../ConditionalSQLBuilder"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types/General"
import type { CountQueryOptions } from "./types"
import type { CountQueryOption, CountCaseOptions } from "./CountSQL"
import JoinSQLBuilder from "../JoinSQLBuilder"


export default class CountSQLBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

    public alias: string

    private unions?: UnionSQLBuilder[]
    private joins?: JoinSQLBuilder<any>[]


    constructor(
        public target: T,
        public options: CountQueryOptions<InstanceType<T>>,
        alias?: string,
        public type: 'isolated' | 'inline' = 'isolated',
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target)

        this.unionSQLBuilders()
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get tableName(): string {
        return `${this.metadata.tableName} ${this.alias}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        switch (this.type) {
            case 'isolated': return this.isolatedCountQuery()
            case "inline": return CountSQLBuilder.inline(
                this.target,
                this.options,
                this.alias
            )
        }
    }

    // ------------------------------------------------------------------------

    public joinSQLBuilders(): JoinSQLBuilder<any>[] {
        if (this.joins) return this.joins

        this.joins = new ConditionalQueryJoinsHandler(this.target)
            .joinsByKeys(this.extractOptionsRelationsKeys())

        return this.joins
    }

    // ------------------------------------------------------------------------

    public unionSQLBuilders(): UnionSQLBuilder[] {
        this.unions = [
            ...(
                this.metadata instanceof PolymorphicEntityMetadata
                    ? [
                        new UnionSQLBuilder(
                            this.metadata.tableName,
                            this.target as PolymorphicEntityTarget
                        )
                    ]

                    : []
            ),
            ...this.joinSQLBuilders().flatMap(join =>
                join.tableUnionQueryBuilder() ?? []
            )
        ]

        return this.unions
    }

    // Privates ---------------------------------------------------------------
    private isolatedCountQuery(): string {
        return SQLStringHelper.normalizeSQL(`
            ${this.unionsSQL()}
            SELECT ${this.countsSQL()}
            ${this.fromSQL()}
            ${this.joinsSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    private countsSQL(): string {
        return CountSQLBuilder.inline(
            this.target,
            this.options,
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    private fromSQL(): string {
        return `FROM ${this.tableName}`
    }

    // ------------------------------------------------------------------------

    private joinsSQL(): string {
        return this.joinSQLBuilders()
            .map(joinSQLBuilder => joinSQLBuilder.SQL())
            .join(' ')
    }

    // ------------------------------------------------------------------------

    private unionsSQL(): string {
        return this.unions?.map(union => union.SQL())
            .join(' ')
            ?? ''
    }

    // ------------------------------------------------------------------------

    private extractOptionsRelationsKeys(): string[] {
        return this.extractOptionsKeys().filter(key =>
            this.metadata.relations?.some(({ name }) => name === key) ||
            key.includes('.')
        )
    }

    // ------------------------------------------------------------------------

    private extractOptionsKeys(): string[] {
        return Object.entries(this.options).flatMap(
            ([_, opt]) => {
                switch (typeof opt) {
                    case "string": return opt

                    case "object": return Array.isArray(opt)
                        ? opt.flatMap(and => Object.entries(and)
                            .flatMap(([key]) => key))

                        : Object.getOwnPropertySymbols(opt).includes(Case)
                            ? (opt as CountCaseOptions<InstanceType<T>>)[Case]
                                .flatMap(caseOpt =>
                                    Array.isArray(caseOpt)
                                        ? Object.entries(caseOpt[0])
                                            .flatMap(([key]) => key)
                                        : []
                                )

                            : Object.entries(opt).flatMap(([key]) => key)
                }
            }
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static inline<T extends EntityTarget | PolymorphicEntityTarget>(
        target: T,
        options: CountQueryOptions<InstanceType<T>>,
        alias?: string,
    ): string {
        return Object
            .entries(options)
            .map(([as, options]) =>
                new CountSQL(target, options, as, alias).SQL()
            )
            .join(', ')
    }

    // ------------------------------------------------------------------------

    public static countBuilder<
        T extends EntityTarget | PolymorphicEntityTarget
    >(
        target: T,
        options: CountQueryOption<InstanceType<T>>,
        alias?: string,
    ): CountSQLBuilder<T> {
        return new CountSQLBuilder(
            target,
            { result: options },
            alias
        )
    }

    // ------------------------------------------------------------------------

    public static countManyBuilder<
        T extends EntityTarget | PolymorphicEntityTarget
    >(
        target: T,
        options: CountQueryOptions<InstanceType<T>>,
        alias?: string,
    ): CountSQLBuilder<T> {
        return new CountSQLBuilder(
            target,
            options,
            alias
        )
    }
}

export {
    type CountQueryOption,
    type CountQueryOptions,
    type CountCaseOptions
}