import { EntityMetadata } from "../../../Metadata"

// SQL Builders
import CreateSQLBuilder, {
    type CreationAttributesOptions,
    type CreationAttributes,
    type CreationAttibutesKey
} from "../../CreateSQLBuilder"

// Types
import type { EntityTarget } from "../../../../types/General"

export default abstract class CreateQueryBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata
    protected sqlBuilder: CreateSQLBuilder<T>

    constructor(
        public target: T,
        public alias?: string,
    ) {
        this.metadata = this.loadMetadata()
        this.sqlBuilder = this.buildSQLBuilder()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public fields(...names: CreationAttibutesKey<InstanceType<T>>[]): this {
        this.sqlBuilder.fields(...names)
        return this
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return this.sqlBuilder.SQL()
    }

    // ------------------------------------------------------------------------

    public toQueryOptions(): CreationAttributesOptions<InstanceType<T>> {
        return this.sqlBuilder.mapAttributes()
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    private buildSQLBuilder(): CreateSQLBuilder<T> {
        return new CreateSQLBuilder(
            this.target,
            undefined,
            this.alias
        )
    }
}