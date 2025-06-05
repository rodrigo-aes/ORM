import { EntityMetadata } from "../Metadata"

// Query Builders
import { InsertQueryHandler, BulkInsertQueryHandler } from "./QueryHandlers"

// Types
import type { EntityTarget } from "../../types/General"
import type { EntityCreationAttributes } from "./CreateSQLBuilder"

export default class QueryBuilder<T extends EntityTarget> {
    public metadata: EntityMetadata
    public alias?: string

    constructor(
        public target: T,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public insert(alias?: string): InsertQueryHandler<T> {
        return new InsertQueryHandler(this.target, alias)
    }

    // ------------------------------------------------------------------------

    public bulkInsert(alias?: string): BulkInsertQueryHandler<T> {
        return new BulkInsertQueryHandler(this.target, alias)
    }

    // ------------------------------------------------------------------------

    public create(attributes: EntityCreationAttributes<InstanceType<T>>): (
        Promise<InstanceType<T>>
    ) {
        return InsertQueryHandler.create(
            this.target,
            attributes,
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    public createMany(
        attributes: EntityCreationAttributes<InstanceType<T>>[]
    ): Promise<InstanceType<T>[]> {
        return BulkInsertQueryHandler.createMany(
            this.target,
            attributes,
            this.alias
        )
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }
}