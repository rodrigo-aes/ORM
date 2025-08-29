import {
    MetadataHandler,

    type EntityMetadata,
    type PolymorphicEntityMetadata
} from "../Metadata"

// Query Builders
import FindOneQueryBuilder from "./FindOneQueryBuilder"
import FindQueryBuilder from "./FindQueryBuilder"
import PaginateQueryBuilderObject from "./PaginateQueryBuilder"
import CountQueryBuilder from "./CountQueryBuilder"
import CountManyQueryBuilder from "./CountManyQueryBuilder"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types/General"

import PaginateQueryBuilder from "./PaginateQueryBuilder"

export default class QueryBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata
    protected alias?: string

    constructor(
        public target: T,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public findOne(alias?: string): FindOneQueryBuilder<T> {
        return new FindOneQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    public find(alias?: string): FindQueryBuilder<T> {
        return new FindQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    public paginate(page: number = 1, perPage: number = 26, alias?: string): (
        PaginateQueryBuilder<T>
    ) {
        return new PaginateQueryBuilderObject(
            this.target,
            page,
            perPage,
            alias ?? this.alias
        )
    }

    // ------------------------------------------------------------------------

    public count(alias?: string): CountQueryBuilder<T> {
        return new CountQueryBuilder(this.target, alias ?? this.alias)
    }

    // ------------------------------------------------------------------------

    public countMany(alias?: string): CountManyQueryBuilder<T> {
        return new CountManyQueryBuilder(this.target, alias ?? this.alias)
    }
}