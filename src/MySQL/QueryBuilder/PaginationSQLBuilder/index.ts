import FindSQLBuilder, { type FindQueryOptions } from "../FindSQLBuilder"

// Query Builders
import CountSQLBuilder from "../CountSQLBuilder"

// Types
import type { EntityTarget } from "../../../types/General"
import type { PaginationOptions } from "./types"

export default class PaginationSQLBuilder<
    T extends EntityTarget
> extends FindSQLBuilder<T> {
    public page: number = 1
    public perPage: number = 26

    constructor(
        target: T,
        options: FindQueryOptions<InstanceType<T>>,
        pagination?: PaginationOptions
    ) {
        super(target, options)

        if (pagination?.page) this.page = pagination.page
        if (pagination?.perPage) this.perPage = pagination.perPage

        this.setLimit()
        this.setOffset()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public totalSQL(): string {
        return CountSQLBuilder.count(
            this.target,
            this.options.where,
            this.alias
        )
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
    type PaginationOptions
}