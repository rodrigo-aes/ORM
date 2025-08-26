import FindSQLBuilder, { type FindQueryOptions } from "../FindSQLBuilder"

// Query Builders
import CountSQLBuilder from "../CountSQLBuilder"

// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../../types/General"
import type { PaginationQueryOptions } from "./types"

export default class PaginationSQLBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> extends FindSQLBuilder<T> {
    public page: number = 1
    public perPage: number = 26

    constructor(
        target: T,
        { page, perPage, ...options }: PaginationQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        super(target, options, alias)

        if (page) this.page = page
        if (perPage) this.perPage = perPage

        this.setLimit()
        this.setOffset()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public totalSQL(): string {
        return `SELECT COUNT(*) AS total FROM ${this.metadata.tableName}`
    }

    // Privates ---------------------------------------------------------------
    private setLimit(): void {
        this.limit = this.perPage
    }

    private setOffset(): void {
        this.offset = (this.page - 1) * this.perPage
    }
}

export {
    type PaginationQueryOptions
}