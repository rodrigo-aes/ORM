import type {
    FindQueryOptions,
    SelectOptions,
    ConditionalQueryOptions,
    RelationsOptions,
    GroupQueryOptions,
    OrderQueryOptions
} from "../../../../QueryBuilder"

export default class ScopeMetadata {
    public select?: SelectOptions<any>
    public where?: ConditionalQueryOptions<any>
    public relations?: RelationsOptions<any>
    public group?: GroupQueryOptions<any>
    public order?: OrderQueryOptions<any>
    public limit?: number
    public offset?: number

    constructor(scope: FindQueryOptions<any>) {
        Object.assign(this, scope)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public mergeOptions<T extends FindQueryOptions<any>>(
        options: T,
        findMany: boolean = false
    ): T {
        options.select = this.mergeSelectOptions(options.select)
        options.where = this.mergeWhereOptions(options.where)
        options.relations = this.mergeRelationsOptions(options.relations)
        options.group = this.mergeGroupOptions(options.group)

        if (findMany) {
            if (!options.order) options.order = this.order
            if (!options.limit) options.limit = this.limit
            if (!options.offset) options.offset = this.offset
        }

        return options
    }

    // ------------------------------------------------------------------------

    public mergeSelectOptions<
        T extends SelectOptions<any>
    >(options?: T): T | undefined {
        if (!options) return
        if (!options.properties) options.properties = this.select?.properties

        options.count = {
            ...this.select?.count,
            ...options.count
        }

        return options
    }

    // ------------------------------------------------------------------------

    public mergeWhereOptions<T extends ConditionalQueryOptions<any>>(
        options?: T
    ): T | {} {

        return {
            ...this.where,
            ...options
        }
    }

    // ------------------------------------------------------------------------

    public mergeRelationsOptions<T extends RelationsOptions<any>>(
        options?: T
    ): T | {} {
        return {
            ...this.relations,
            ...options
        }
    }

    // ------------------------------------------------------------------------

    public mergeGroupOptions<T extends GroupQueryOptions<any>>(options?: T): (
        T
    ) {
        return [
            ...new Set([
                ...this.group ?? [],
                ...options ?? []
            ])
        ] as T
    }
}