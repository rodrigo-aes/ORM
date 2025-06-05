import { EntityMetadata, MetadataHandler } from "../../../Metadata"
import EntityHandler from "../../../EntityHandler"

// Query Builders
import CreateSQLBuilder from "../../CreateSQLBuilder"

// Types
import type { ResultSetHeader } from "mysql2"
import type MySQLConnection from "../../../Connection"
import type { EntityTarget } from "../../../../types/General"
import type { CreationAttibutesKey } from "../../CreateSQLBuilder"

export default abstract class CreateQueryBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata
    public SQLBuilder: CreateSQLBuilder<T>

    constructor(
        public target: T,
        public alias?: string,
        queryBuilder?: CreateSQLBuilder<T>
    ) {
        this.metadata = this.loadMetadata()

        this.SQLBuilder = queryBuilder ?? new CreateSQLBuilder(
            this.target,
            {},
            this.alias
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public fields(...names: CreationAttibutesKey<InstanceType<T>>[]): this {
        this.SQLBuilder.fields(...names)
        return this
    }

    // Protecteds -------------------------------------------------------------
    protected mapToEntities(): InstanceType<T> | InstanceType<T>[] {
        return EntityHandler.attributesToEntities(
            this.target,
            this.SQLBuilder.mapAttributes()
        ) as InstanceType<T> | InstanceType<T>[]
    }

    // ------------------------------------------------------------------------

    protected executeQuery(): (
        Promise<ResultSetHeader>
    ) {
        return this.getConnection().query(
            this.SQLBuilder.SQL(),
            this.SQLBuilder.columnsValues
        ) as unknown as Promise<ResultSetHeader>
    }

    // ------------------------------------------------------------------------

    protected getConnection(): MySQLConnection {
        const connection = MetadataHandler.getTargetConnection(
            this.target
        )

        if (connection) return connection

        throw new Error
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }
}