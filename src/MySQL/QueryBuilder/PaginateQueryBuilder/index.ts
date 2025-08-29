import FindQueryBuilder from "../FindQueryBuilder"

// SQL Builders
import {
    PaginationSQLBuilder,
    type PaginationQueryOptions
} from "../../SQLBuilders"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types/General"

export default class PaginateQueryBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> extends FindQueryBuilder<T> {
    constructor(
        public target: T,
        public page: number = 1,
        public perPage: number = 26,
        public alias?: string,
    ) {
        super(target, alias)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override toQueryOptions(): PaginationQueryOptions<InstanceType<T>> {
        const { select, where, group, order } = this._options

        return {
            page: this.page,
            perPage: this.perPage,
            select: select?.toQueryOptions(),
            where: where?.toQueryOptions(),
            relations: this.relationsToOptions(),
            group: group?.toQueryOptions(),
            order: order?.toQueryOptions(),
        }
    }

    // Protecteds -------------------------------------------------------------
    protected override toSQLBuilder(): PaginationSQLBuilder<T> {
        return new PaginationSQLBuilder(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
    }
}