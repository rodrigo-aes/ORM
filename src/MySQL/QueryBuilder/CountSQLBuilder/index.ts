import type { EntityMetadata, EntityUnionMetadata } from "../../Metadata"

// Query Builders
import CountSQL from "./CountSQL"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"
import type {
    CountQueryOption,
    CountQueryOptions,
    CountCaseOptions
} from "./types"
import type { ConditionalQueryOptions } from "../ConditionalSQLBuilder"


export default class CountSQLBuilder<
    T extends EntityTarget | UnionEntityTarget
> {
    protected metadata: EntityMetadata | EntityUnionMetadata

    public alias: string

    constructor(
        public target: T,
        public options: CountQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(this.countsSQL())
    }

    // Privates ---------------------------------------------------------------
    private countsSQL(): string {
        return Object.entries(this.options)
            .map(([as, option]) =>
                new CountSQL(
                    this.target,
                    option,
                    as,
                    this.alias,
                    true
                )
                    .SQL()
            )
            .join(', ')
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static count<T extends EntityTarget>(
        target: T,
        options?: ConditionalQueryOptions<InstanceType<T>>,
        alias?: string
    ): string {
        return SQLStringHelper.normalizeSQL(
            new CountSQL(
                target,
                options,
                undefined,
                alias
            )
                .SQL()
        )
    }
}

export {
    type CountQueryOption,
    type CountQueryOptions,
    type CountCaseOptions
}