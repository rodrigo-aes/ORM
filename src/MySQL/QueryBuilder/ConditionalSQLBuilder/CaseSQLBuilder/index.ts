import { EntityMetadata, PolymorphicEntityMetadata } from "../../../Metadata"

// Query Builders
import AndSQLBuilder from "../AndSQLBuilder"
import OrSQLBuilder from "../OrSQLBuilder"

// Symbols
import { Case } from "./Symbol"

// Handlers
import { MetadataHandler } from "../../../Metadata"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../../Helpers"

// Types
import type { EntityTarget, EntityUnionTarget } from "../../../../types/General"
import type {
    CaseQueryOptions,
    CaseQueryTuple,
    WhenQueryOption,
    ElseQueryOption,

} from "./types"

export default class CaseSQLBuilder<
    T extends EntityTarget | EntityUnionTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

    public alias: string

    constructor(
        public target: T,
        public options: CaseQueryOptions<InstanceType<T>>,
        public as?: string,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target)!
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get whenClauses(): CaseQueryTuple<InstanceType<T>>[] {
        if (Array.isArray(this.lastOption)) return this.options
        return this.options.slice(0, this.options.length - 1)
    }

    // ------------------------------------------------------------------------

    public get elseClause(): ElseQueryOption | undefined {
        if (!Array.isArray(this.lastOption)) return this.lastOption
    }

    // Privates ---------------------------------------------------------------
    private get lastOption(): (
        CaseQueryTuple<InstanceType<T>> | ElseQueryOption
    ) {
        return this.options[this.options.length - 1]
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            CASE 
                ${this.whenClausesSQL()}
                ${this.elseClauseSQL()}
            END ${this.asSQL()}
        `)
    }

    // Privates ---------------------------------------------------------------
    private whenClausesSQL(): string {
        return this.whenClauses.map(
            ([when, then]) => `
                WHEN ${this.whenSQL(when)} 
                THEN ${PropertySQLHelper.valueSQL(then)}
            `
        )
            .join(' ')
    }

    // ------------------------------------------------------------------------

    private elseClauseSQL(): string {
        return this.elseClause
            ? `ELSE ${PropertySQLHelper.valueSQL(this.elseClause)}`
            : ''
    }

    // ------------------------------------------------------------------------

    private whenSQL(when: WhenQueryOption<InstanceType<T>>): string {
        return Array.isArray(when)
            ? new OrSQLBuilder(
                this.target,
                when,
                this.alias
            )
                .SQL()
            : new AndSQLBuilder(
                this.target,
                when,
                this.alias
            )
                .SQL()
    }

    // ------------------------------------------------------------------------

    private asSQL(): string {
        return this.as
            ? `AS ${this.as}`
            : ''
    }
}

export {
    Case,
    type CaseQueryOptions,
    type CaseQueryTuple,
    type WhenQueryOption,
    type ElseQueryOption,
}