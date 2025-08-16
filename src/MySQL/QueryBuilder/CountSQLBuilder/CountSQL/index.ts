import { EntityMetadata, PolymorphicEntityMetadata } from "../../../Metadata"

// Query Builders
import ConditionalSQLBuilder, {
    Case,
    type ConditionalQueryOptions,
    type CaseQueryOptions,

} from "../../ConditionalSQLBuilder"

// Handler
import { MetadataHandler } from "../../../Metadata"

// Helpers
import { PropertySQLHelper } from "../../../Helpers"

// Types
import type {
    EntityTarget,
    EntityUnionTarget
} from "../../../../types/General"
import type { CountQueryOption, CountCaseOptions } from "../types"

export default class CountSQL<T extends EntityTarget | EntityUnionTarget> {
    private metadata: EntityMetadata | PolymorphicEntityMetadata

    public alias: string

    constructor(
        public target: T,
        public option?: CountQueryOption<InstanceType<T>>,
        public as?: string,
        alias?: string,
        public isolated?: boolean
    ) {
        this.alias = alias ?? this.targetName
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    private get targetName(): string {
        return this.target.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    private get table(): string {
        return `${this.metadata.tableName} ${this.targetName}`
    }

    // Instance Methods =======================================================
    public SQL(): string {
        return `${this.countSQL()} ${this.asSQL()}`
    }

    // Privates ---------------------------------------------------------------
    private countSQL(): string {
        if (typeof this.option === 'string') return this.commonCountSQL()

        else if (Object.getOwnPropertySymbols(this.option).includes(Case)) {
            return this.commonCountSQL()
        }

        else return this.isolated
            ? `(${this.selectCountSQL()})`
            : this.selectCountSQL()
    }

    // ------------------------------------------------------------------------

    private asSQL(): string {
        return this.as
            ? `AS ${this.as}`
            : ''
    }

    // ------------------------------------------------------------------------

    private commonCountSQL(): string {
        return `COUNT(${this.optionSQL()})`
    }

    // ------------------------------------------------------------------------

    private selectCountSQL(): string {
        return `SELECT COUNT(*) FROM ${this.table} ${this.optionSQL()}`
    }

    // ------------------------------------------------------------------------

    private optionSQL(): string {
        switch (typeof this.option) {
            case "string": return this.propertySQL()
            case "object": return this.objectOptionSQL()

            default: return ''
        }
    }

    // ------------------------------------------------------------------------

    private propertySQL(): string {
        return PropertySQLHelper.pathToAlias(
            this.option as string,
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    private objectOptionSQL(): string {
        if (Object.getOwnPropertySymbols(this.option).includes(Case)) return (
            this.caseSQL(
                (this.option as CountCaseOptions<InstanceType<T>>)[Case]
            )
        )

        return this.whereSQL(
            this.option as ConditionalQueryOptions<InstanceType<T>>
        )
    }

    // ------------------------------------------------------------------------

    private caseSQL(caseOptions: CaseQueryOptions<InstanceType<T>>): string {
        return ConditionalSQLBuilder.case(
            this.target,
            caseOptions,
            undefined,
            this.alias
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    private whereSQL(
        whereOptions: ConditionalQueryOptions<InstanceType<T>>
    ): string {
        return ConditionalSQLBuilder.where(
            this.target,
            whereOptions,
            this.alias
        )
            .SQL()
    }
}