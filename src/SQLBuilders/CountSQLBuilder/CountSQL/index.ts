// SQL Builders
import {
    CaseSQLBuilder,
    type CaseQueryOptions
} from "../../ConditionalSQLBuilder"

// Symbols
import { Case } from "../../ConditionalSQLBuilder"

// Types
import type { Target } from "../../../types"
import type { CountQueryOption, CountCaseOptions } from "./types"

export default class CountSQL<T extends Target> {
    constructor(
        public target: T,
        public options: CountQueryOption<InstanceType<T>>,
        public as?: string,
        public alias: string = target.name.toLowerCase()
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `${this.countSQL()} ${this.asSQL()}`
    }

    // Privates ---------------------------------------------------------------
    private countSQL(): string {
        switch (true) {
            case typeof this.options === 'string': return (
                `COUNT(${this.propertyOptionSQL()})`
            )

            // ----------------------------------------------------------------

            case Object
                .getOwnPropertySymbols(this.options)
                .includes(Case): return (
                    `CAST(SUM(${this.caseOptionSQL()}) AS SIGNED)`
                )

            // ----------------------------------------------------------------

            default: return `COUNT(${this.conditionalOptionSQL()})`
        }
    }

    // ------------------------------------------------------------------------

    private asSQL(): string {
        return this.as ? `AS ${this.as}` : ''
    }

    // ------------------------------------------------------------------------

    private propertyOptionSQL(): string {
        return `${this.alias}.${this.options as string}`
    }

    // ------------------------------------------------------------------------

    private caseOptionSQL(): string {
        return this.caseClauseSQL(this.options as (
            CaseQueryOptions<InstanceType<T>>
        ))
    }

    // ------------------------------------------------------------------------

    private conditionalOptionSQL(): string {
        return this.caseClauseSQL([[this.options, 1]])
    }

    // ------------------------------------------------------------------------

    private caseClauseSQL(options: CaseQueryOptions<InstanceType<T>>): string {
        return new CaseSQLBuilder(
            this.target,
            options,
            undefined,
            this.alias
        )
            .SQL()
    }
}

export {
    type CountQueryOption,
    type CountCaseOptions
}