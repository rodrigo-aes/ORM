import { EntityMetadata } from "../../Metadata"

import UnionEntity from "../../UnionEntity"

// Query Builders
import CountSQL from "./CountSQL"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../../types/General"
import type {
    CountQueryOption,
    CountQueryOptions,
    CountCaseOptions
} from "./types"
import type { ConditionalQueryOptions } from "../ConditionalQueryBuilder"


export default class CountSQLBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    public alias: string

    constructor(
        public target: T,
        public options: CountQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(this.countsSQL())
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        // if (this.target === UnionEntity) {
        //     return Reflect.getOwnMetadata(
        //         this.alias,
        //         this.target
        //     )
        // }

        return EntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

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