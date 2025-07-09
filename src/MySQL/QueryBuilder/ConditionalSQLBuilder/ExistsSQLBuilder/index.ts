// SQL Builders
import FindOneSQLBuilder from "../../FindOneSQLBuilder"

// Symbols
import { Exists } from "./Symbol"

// Handlers
import { MetadataHandler } from "../../../Metadata"

// Helpers
import { SQLStringHelper } from "../../../Helpers"

// Types
import type { EntityMetadata, EntityUnionMetadata } from "../../../Metadata"
import type {
    EntityTarget,
    UnionEntityTarget
} from "../../../../types/General"
import type { ConditionalQueryOptions } from "../types"
import type { RelationsOptions } from "../../JoinSQLBuilder"
import type UnionSQLBuilder from "../../UnionSQLBuilder"
import type { ExistsQueryOptions } from "./types"

export default class ExistsSQLBuilder<
    T extends EntityTarget | UnionEntityTarget
> {
    protected metadata: EntityMetadata | EntityUnionMetadata
    public alias: string

    protected relOptions: ConditionalQueryOptions<InstanceType<T>>

    public findSQLBuilder: FindOneSQLBuilder<T>

    constructor(
        public target: T,
        public options: ConditionalQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target!)

        this.relOptions = this.filterRelationsOptions()
        this.findSQLBuilder = this.buildFindSQLBuilder()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            EXISTS (${this.findSQLBuilder.SQL()})
        `)
    }

    // ------------------------------------------------------------------------

    public unions(): UnionSQLBuilder[] {
        return this.findSQLBuilder.unions
    }

    // Privates ---------------------------------------------------------------

    private buildFindSQLBuilder(): FindOneSQLBuilder<T> {
        return new FindOneSQLBuilder(
            this.target,
            {
                select: {
                    properties: '1'
                },
                where: this.options,
                relations: this.buildRelationsOptions()
            },
            this.alias,
            false
        )
    }

    // ------------------------------------------------------------------------

    private buildRelationsOptions(): RelationsOptions<InstanceType<T>> {
        const flatInput: any = this.relOptions
        const output: any = {}

        for (const key in flatInput) {
            const parts = key.split('.')
            const column = parts.pop()!

            let current = output

            for (const part of parts) {
                current[part] ??= {
                    required: true,
                    select: {
                        properties: '1'
                    }
                }
                current[part].relations ??= {}
                current = current[part].relations
            }

            current.on ??= {}
            current.on[column] = flatInput[key]
        }

        return output
    }

    // ------------------------------------------------------------------------

    private filterRelationsOptions(): (
        ConditionalQueryOptions<InstanceType<T>>
    ) {
        return Object.fromEntries(Object.entries(this.options).flatMap(
            ([key, value]) => key.includes('.')
                ? [[key, value]]
                : []
        )) as ConditionalQueryOptions<InstanceType<T>>
    }
}

export {
    Exists,
    type ExistsQueryOptions
}